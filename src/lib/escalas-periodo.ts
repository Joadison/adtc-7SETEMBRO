/**
 * Escalas por período (Kids = bimestre, EBD = trimestre, Mídia = mês).
 *
 * Tudo é uma lista de "slots" (uma data + papéis). Onde cada uma mora no Calendar:
 *  - Kids e Mídia: no JSON do `description` do evento do CULTO (domingo/quinta) — editam só os próprios campos.
 *  - EBD: evento próprio "EBD", todo domingo das 8h às 10h (criado se ainda não existir).
 */
import {
  emptyFields,
  pickFields,
  serializeDescription,
  type EscalaFields,
  type FieldKey,
} from "./calendar-description";
import { PESSOAS } from "./escala-people";
import { isCultoCategory } from "./escala-types";
import { calendarDate, DIA, diaDaSemana } from "./escala-utils";
import type { CalendarEvent, EventCategory } from "./ics-parser";
import type { Periodo } from "./periodos";
import type { SyncPayload } from "./sync-calendar";

export interface Papel {
  campo: FieldKey;
  label: string;
  /** lista de pessoas; vazio/ausente = campo de texto livre */
  opcoes?: readonly string[];
  opcional?: boolean;
}

export interface Slot {
  /** id do evento no Calendar, ou "novo-AAAA-MM-DD" se ainda não existe */
  id: string;
  eventId?: string;
  nome: string;
  /** DD/MM */
  data: string;
  dataISO: string;
  dia: number;
  campos: EscalaFields;
}

export interface ConfigEscala {
  tipo: "kids" | "ebd" | "midia";
  titulo: string;
  periodo: Periodo;
  colunasPreview: number;
  subtituloPreview?: string;
  /** Papéis editáveis por dia da semana. [] = esse dia não entra na escala. */
  papeis: (dia: number) => Papel[];
  /** Linhas do preview (padrão: uma por papel). */
  linhas?: (slot: Slot) => [string, string][];
  /** Ajusta os campos ao carregar (ex.: dados antigos). */
  normalizar?: (campos: EscalaFields) => EscalaFields;
  /** Campos antigos que devem ser apagados quando o slot for salvo. */
  legados?: FieldKey[];
  /** Presente = a escala tem evento próprio no Calendar (senão usa os cultos). */
  evento?: { categoria: EventCategory; titulo: string; dia: number; inicio: string; fim: string };
}

// ---------- as três escalas ----------

const papel = (campo: FieldKey, label: string, opcoes?: readonly string[], opcional = false): Papel => ({
  campo,
  label,
  opcoes,
  opcional,
});

const kids: ConfigEscala = {
  tipo: "kids",
  titulo: "Escala Kids",
  periodo: "bimestre",
  colunasPreview: 2,
  papeis: (dia) =>
    dia === DIA.DOMINGO
      ? [
          papel("professoraUp", "Professoras dos Maiores", PESSOAS.professoras),
          papel("professoraDow", "Professoras dos Menores", PESSOAS.professoras),
        ]
      : dia === DIA.QUINTA
        ? [
            papel("professoraUp", "Professora 1", PESSOAS.professoras),
            papel("professoraDow", "Professora 2", PESSOAS.professoras),
          ]
        : [],
  linhas: ({ dia, campos: c }) =>
    dia === DIA.DOMINGO
      ? [
          ["Professoras dos Maiores", c.professoraUp],
          ["Professoras dos Menores", c.professoraDow],
        ]
      : [["Professora", [c.professoraUp, c.professoraDow].filter(Boolean).join(" / ")]],
  // eventos antigos de quinta guardavam "Professora: A / B" num campo só
  normalizar: (c) => {
    if (c.professoraUp || c.professoraDow || !c.professora) return c;
    const [up = "", dow = ""] = c.professora.split("/").map((s) => s.trim());
    return { ...c, professoraUp: up, professoraDow: dow };
  },
  legados: ["professora"],
};

const midia: ConfigEscala = {
  tipo: "midia",
  titulo: "Escala de Mídia",
  periodo: "mes", // ← troque para "bimestre"/"trimestre" se a mídia for escalada em outro período
  colunasPreview: 2,
  papeis: (dia) => {
    const fotos = papel("fotos", "Fotos", PESSOAS.midia);
    const computador = papel("computador", "Computador", PESSOAS.midia);
    const som = papel("som", "Som", PESSOAS.midia);
    return dia === DIA.DOMINGO ? [fotos, computador, som] : dia === DIA.QUINTA ? [computador, som] : [];
  },
};

const ebd: ConfigEscala = {
  tipo: "ebd",
  titulo: "Escala EBD",
  periodo: "trimestre",
  colunasPreview: 2,
  subtituloPreview: "Todos os domingos, das 8h às 10h",
  evento: { categoria: "EBD", titulo: "EBD", dia: DIA.DOMINGO, inicio: "08:00", fim: "10:00" },
  // 1 ou 2 pessoas por aula
  papeis: () => [
    papel("ebd1", "Professor(a) 1", PESSOAS.ebd),
    papel("ebd2", "Professor(a) 2 (opcional)", PESSOAS.ebd, true),
  ],
  linhas: ({ campos: c }) => [["Professores", [c.ebd1, c.ebd2].filter(Boolean).join(" / ")]],
};

export const ESCALAS = { kids, ebd, midia } satisfies Record<string, ConfigEscala>;

export function linhasDoSlot(config: ConfigEscala, slot: Slot): [string, string][] {
  if (config.linhas) return config.linhas(slot);
  return config
    .papeis(slot.dia)
    .filter((p) => slot.campos[p.campo] || !p.opcional)
    .map((p) => [p.label, slot.campos[p.campo]]);
}

// ---------- Calendar → slots ----------

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const ddmm = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;

function datasDoDia(meses: number[], ano: number, dia: number): Date[] {
  return meses.flatMap((m) => {
    const datas: Date[] = [];
    for (const d = new Date(ano, m, 1); d.getMonth() === m; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === dia) datas.push(new Date(d));
    }
    return datas;
  });
}

export function montarSlots(config: ConfigEscala, meses: number[], ano: number, eventos: CalendarEvent[]): Slot[] {
  const normalizar = (e: CalendarEvent) => {
    const campos = pickFields(e);
    return config.normalizar?.(campos) ?? campos;
  };

  // EBD: um slot por domingo; usa o evento se já existir, senão fica "novo"
  if (config.evento) {
    const { categoria, titulo, dia, inicio } = config.evento;
    return datasDoDia(meses, ano, dia).map((d) => {
      const dataStr = ymd(d);
      const ev = eventos.find((e) => e.category === categoria && e.start.startsWith(dataStr));
      return ev
        ? { id: ev.id, eventId: ev.id, nome: ev.title, data: ddmm(d), dataISO: ev.start, dia, campos: normalizar(ev) }
        : { id: `novo-${dataStr}`, nome: titulo, data: ddmm(d), dataISO: `${dataStr}T${inicio}:00`, dia, campos: emptyFields() };
    });
  }

  // Kids / Mídia: cultos do período nos dias que a escala cobre
  return eventos
    .filter((e) => {
      const d = calendarDate(e.start);
      return (
        !e.allDay &&
        isCultoCategory(e.category) &&
        !!d &&
        d.getFullYear() === ano &&
        meses.includes(d.getMonth()) &&
        config.papeis(d.getDay()).length > 0
      );
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .map((e) => ({
      id: e.id,
      eventId: e.id,
      nome: e.title,
      data: ddmm(calendarDate(e.start)!),
      dataISO: e.start,
      dia: diaDaSemana(e.start),
      campos: normalizar(e),
    }));
}

// ---------- slots → Calendar ----------

export interface ResultadoSync {
  atualizados: number;
  criados: number;
  erros: string[];
}

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 207) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}

export const slotAlterado = (config: ConfigEscala, slot: Slot, base?: EscalaFields) =>
  config.papeis(slot.dia).some((p) => slot.campos[p.campo] !== base?.[p.campo]);

/**
 * Envia só o que mudou:
 *  - evento existente → /api/calendar/update (mescla apenas os campos alterados, sem tocar nos das outras escalas)
 *  - EBD sem evento (e com nome preenchido) → /api/calendar/sync cria o evento das 8h às 10h
 * Nunca apaga eventos.
 */
export async function sincronizarSlots(
  config: ConfigEscala,
  slots: Slot[],
  base: Record<string, EscalaFields>,
): Promise<ResultadoSync> {
  const r: ResultadoSync = { atualizados: 0, criados: 0, erros: [] };
  const toCreate: SyncPayload["toCreate"] = [];

  for (const slot of slots) {
    const campos = config.papeis(slot.dia).map((p) => p.campo);
    const rotulo = `${slot.nome} ${slot.data}`;

    if (slot.eventId) {
      const mudou = campos.filter((k) => slot.campos[k] !== base[slot.id]?.[k]);
      if (!mudou.length) continue;

      // "LIVRE" = remover o campo do JSON
      const fields: Partial<EscalaFields> = Object.fromEntries(mudou.map((k) => [k, slot.campos[k].trim() || "LIVRE"]));
      for (const k of config.legados ?? []) if (slot.campos[k]) fields[k] = "LIVRE";

      try {
        await post("/api/calendar/update", { eventId: slot.eventId, fields });
        r.atualizados++;
      } catch (e: any) {
        r.erros.push(`${rotulo}: ${e.message}`);
      }
    } else if (config.evento && campos.some((k) => slot.campos[k].trim())) {
      toCreate.push({
        summary: config.evento.titulo,
        description: serializeDescription(slot.campos),
        start: slot.dataISO,
        end: `${slot.dataISO.slice(0, 11)}${config.evento.fim}:00`,
        clientId: slot.id,
      });
    }
  }

  if (toCreate.length) {
    try {
      const { results } = await post("/api/calendar/sync", { toCreate });
      r.criados += results?.created?.length ?? 0;
      for (const e of results?.errors ?? []) r.erros.push(`${e.target}: ${e.error}`);
    } catch (e: any) {
      r.erros.push(`Criação de eventos: ${e.message}`);
    }
  }

  return r;
}

export function resumoSyncSlots(r: ResultadoSync) {
  const partes =
    [
      [r.criados, "criado(s)"],
      [r.atualizados, "atualizado(s)"],
    ]
      .filter(([n]) => n)
      .map(([n, t]) => `${n} ${t}`)
      .join(", ") || "nada a fazer";

  return r.erros.length
    ? `Sincronização parcial: ${partes}\n\nErros: ${r.erros.length}\n${r.erros.map((e) => `- ${e}`).join("\n")}`
    : `Calendário sincronizado: ${partes}.`;
}
