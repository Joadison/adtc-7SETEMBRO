import type { EscalaData, CultoEntry } from "./escala-types";
import type { CalendarEvent } from "./ics-parser";

export interface SyncPayload {
  toCreate: Array<{
    summary: string;
    description: string;
    start: string;
    end: string;
    timeZone?: string;
    clientId?: string;
  }>;
  toUpdate: Array<{
    eventId: string;
    summary?: string;
    description?: string;
    start?: string;
    end?: string;
    timeZone?: string;
  }>;
  toDelete: Array<{ eventId: string }>;
  defaultTimeZone?: string;
}

const DEFAULT_TZ = "America/Sao_Paulo";

// ---------- helpers ----------

function norm(d?: string) {
  return (d || "").replace(/\.\d+Z$/, "Z");
}

/** Monta a descrição a partir do culto (mesmo formato do seu updateFieldInDescription) */
export function buildDescription(culto: CultoEntry): string {
  const lines: string[] = [];
  if (culto.pregador) lines.push(`Pregador: ${culto.pregador}`);
  if (culto.conjunto) lines.push(`Conjunto: ${culto.conjunto}`);
  if (culto.porteiro1) lines.push(`Porteiro 1: ${culto.porteiro1}`);
  if (culto.porteiro2) lines.push(`Porteiro 2: ${culto.porteiro2}`);
  if (culto.recepcao) lines.push(`Recepção: ${culto.recepcao}`);
  if (culto.acomodadores) lines.push(`Acomodadores: ${culto.acomodadores}`);
  if (culto.professoraUp) lines.push(`professoraMaiores: ${culto.professoraUp}`);
  if (culto.professoraDow) lines.push(`professoraMenores: ${culto.professoraDow}`);
  return lines.join("\n");
}

/** Deriva start/end a partir do dataISO. Se o culto já tiver `start`/`end`, use-os. */
function resolveStartEnd(culto: CultoEntry): { start: string; end: string } | null {
  // Se culto tem campos explícitos, use
  const anyCulto = culto as any;
  if (anyCulto.startISO && anyCulto.endISO) {
    return { start: anyCulto.startISO, end: anyCulto.endISO };
  }
  if (!culto.dataISO) return null;

  const startDate = new Date(culto.dataISO);
  if (isNaN(startDate.getTime())) return null;

  // horário padrão: quinta 19:30, domingo 18:00 (ajuste como quiser)
  const isQuinta = startDate.getDay() === 4;
  const hour = isQuinta ? 19 : 18;
  const minute = isQuinta ? 30 : 0;

  startDate.setHours(hour, minute, 0, 0);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1, startDate.getMinutes() + 30);

  return { start: startDate.toISOString(), end: endDate.toISOString() };
}

/**
 * Localiza o evento correspondente a um culto.
 * Match por: mesmo dia (start ISO) + título/descrição contém o nome do culto.
 */
function findEvent(culto: CultoEntry, events: CalendarEvent[]): CalendarEvent | undefined {
  const cultoDate = norm(culto.dataISO);
  if (!cultoDate) return undefined;

  const nome = (culto.nome || "").toLowerCase().trim();

  // 1ª tentativa: match exato por dia + nome
  let match = events.find((e) => {
    if (norm(e.start) !== cultoDate) return false;
    const t = (e.title || "").toLowerCase();
    const d = (e.description || "").toLowerCase();
    return nome ? t.includes(nome) || d.includes(nome) : false;
  });
  if (match) return match;

  // 2ª tentativa: mesmo dia (se não houver ambiguidade)
  const sameDay = events.filter((e) => norm(e.start) === cultoDate);
  if (sameDay.length === 1) return sameDay[0];

  return undefined;
}

// ---------- diff ----------

export function calculateSyncDiff(
  escalaData: EscalaData,
  calendarEvents: CalendarEvent[],
  options?: { scopeFilter?: (e: CalendarEvent) => boolean },
): SyncPayload {
  const toCreate: SyncPayload["toCreate"] = [];
  const toUpdate: SyncPayload["toUpdate"] = [];
  const toDelete: SyncPayload["toDelete"] = [];

  const filter = options?.scopeFilter ?? (() => true);
  const eventsInScope = calendarEvents.filter(filter);

  const matchedIds = new Set<string>();

  for (const week of escalaData.semanas ?? []) {
    for (const culto of week.cultos ?? []) {
      if (!culto.dataISO) continue;

      const existing = findEvent(culto, eventsInScope);
      const description = buildDescription(culto);

      if (existing) {
        matchedIds.add(existing.id);

        // ---- UPDATE ----
        const update: SyncPayload["toUpdate"][number] = {
          eventId: existing.id,
          description,
        };

        // título: só altera se mudou
        if ((culto.nome || "") !== (existing.title || "")) {
          update.summary = culto.nome || existing.title;
        }

        // dia/hora: se dataISO mudou de horário em relação ao evento → patch start/end
        const resolved = resolveStartEnd(culto);
        if (resolved) {
          const evStart = norm(existing.start);
          const newStart = norm(resolved.start);
          if (evStart !== newStart) {
            update.start = resolved.start;
            update.end = resolved.end;
          }
        }

        toUpdate.push(update);
      } else {
        // ---- CREATE ----
        const resolved = resolveStartEnd(culto);
        if (!resolved) continue; // sem data válida → não cria

        toCreate.push({
          summary: culto.nome || "Culto",
          description,
          start: resolved.start,
          end: resolved.end,
          clientId: culto.id,
        });
      }
    }
  }

  // ---- DELETE: eventos do escopo que não foram casados ----
  for (const ev of eventsInScope) {
    if (!matchedIds.has(ev.id)) {
      toDelete.push({ eventId: ev.id });
    }
  }

  return { toCreate, toUpdate, toDelete, defaultTimeZone: DEFAULT_TZ };
}

// ---------- chamada ----------

export interface SyncResult {
  deleted: string[];
  updated: { eventId: string; id: string }[];
  created: { id: string; clientId?: string }[];
  errors: { op: string; target: string; error: string }[];
}

export async function syncCalendar(
  escalaData: EscalaData,
  calendarEvents: CalendarEvent[],
  options?: { scopeFilter?: (e: CalendarEvent) => boolean },
): Promise<SyncResult> {
  const payload = calculateSyncDiff(escalaData, calendarEvents, options);

  if (!payload.toCreate.length && !payload.toUpdate.length && !payload.toDelete.length) {
    return { deleted: [], updated: [], created: [], errors: [] };
  }

  const res = await fetch("/api/calendar/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok && res.status !== 207) {
    throw new Error(json.error || `Falha no sync (HTTP ${res.status})`);
  }
  return json.results as SyncResult;
}