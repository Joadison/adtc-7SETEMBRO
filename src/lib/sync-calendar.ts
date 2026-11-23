import { CAMPOS_CULTO, emptyFields, pickFields, serializeDescription, type EscalaFields } from "./calendar-description";
import type { CultoEntry, EscalaData } from "./escala-types";
import { calendarDate, horarioPadrao } from "./escala-utils";
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

export interface SyncResult {
  deleted: string[];
  updated: { eventId: string; id: string }[];
  created: { id: string; clientId?: string }[];
  errors: { op: string; target: string; error: string }[];
}

const DEFAULT_TZ = "America/Sao_Paulo";

// ---------- helpers (também usados por update-calendar.ts) ----------

/** Compara pelo instante, então "…Z" e "…-03:00" são tratados como iguais. */
const sameInstant = (a?: string, b?: string) =>
  !!a && !!b && new Date(a).getTime() === new Date(b).getTime();

/**
 * Descrição do evento = JSON. Só os campos da escala principal vêm do culto;
 * os de outras escalas (Mídia, EBD) são mantidos como estão no evento do Calendar.
 */
export function buildDescription(culto: CultoEntry, existing?: CalendarEvent): string {
  const preservados = existing ? pickFields(existing) : emptyFields();
  const meus = Object.fromEntries(CAMPOS_CULTO.map((k) => [k, culto[k]])) as Partial<EscalaFields>;
  return serializeDescription({ ...preservados, ...meus }, culto.observacoes ?? existing?.description);
}

/** Acha o evento do Calendar que corresponde ao culto (mesmo horário + nome parecido). */
export function findEvent(culto: CultoEntry, events: CalendarEvent[]): CalendarEvent | undefined {
  if (!culto.dataISO) return undefined;

  const sameStart = events.filter((e) => sameInstant(e.start, culto.dataISO));
  const nome = (culto.nome || "").toLowerCase().trim();

  return (
    sameStart.find((e) => nome && e.title.toLowerCase().includes(nome)) ??
    (sameStart.length === 1 ? sameStart[0] : undefined)
  );
}

/** Cultos novos: horário padrão (ver horarioPadrao) e duração de 1h30. */
function defaultTimes(dataISO: string) {
  const base = calendarDate(dataISO);
  if (!base) return null;

  const start = horarioPadrao(base);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

// ---------- diff ----------

export function calculateSyncDiff(
  escalaData: EscalaData,
  calendarEvents: CalendarEvent[],
  options?: { scopeFilter?: (e: CalendarEvent) => boolean },
): SyncPayload {
  const payload: SyncPayload = { toCreate: [], toUpdate: [], toDelete: [], defaultTimeZone: DEFAULT_TZ };
  const inScope = calendarEvents.filter(options?.scopeFilter ?? (() => true));
  const matched = new Set<string>();

  for (const culto of escalaData.semanas.flatMap((w) => w.cultos)) {
    if (!culto.dataISO) continue;

    const existing = findEvent(culto, inScope);

    if (existing) {
      matched.add(existing.id);

      const update: SyncPayload["toUpdate"][number] = { eventId: existing.id };
      if (culto.nome && culto.nome !== existing.title) update.summary = culto.nome;
      if (CAMPOS_CULTO.some((k) => (culto[k] || "") !== (existing[k] || ""))) {
        update.description = buildDescription(culto, existing);
      }

      // só envia se mudou alguma coisa além do eventId
      if (Object.keys(update).length > 1) payload.toUpdate.push(update);
      continue;
    }

    const times = defaultTimes(culto.dataISO);
    if (!times) continue;

    payload.toCreate.push({
      summary: culto.nome || "Culto",
      description: buildDescription(culto),
      ...times,
      clientId: culto.id,
    });
  }

  // eventos do escopo que não estão na escala são removidos
  for (const event of inScope) {
    if (!matched.has(event.id)) payload.toDelete.push({ eventId: event.id });
  }

  return payload;
}

// ---------- chamada ----------

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
