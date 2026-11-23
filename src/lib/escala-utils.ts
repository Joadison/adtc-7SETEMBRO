import type { EscalaFields } from "./calendar-description";
import type { CultoEntry, EscalaData } from "./escala-types";

export const DIA = { DOMINGO: 0, QUINTA: 4 } as const;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Data de calendário escrita no ISO, sem conversão de fuso.
 * (new Date("2026-11-26") é lido como UTC e vira o dia anterior no Brasil.)
 */
export function calendarDate(iso?: string): Date | null {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}

/** 0 = domingo … 6 = sábado; -1 se não houver data. */
export const diaDaSemana = (iso?: string) => calendarDate(iso)?.getDay() ?? -1;

/** Horário padrão: quinta 19:30, demais dias 18:00. */
export function horarioPadrao(date: Date): Date {
  const d = new Date(date);
  const quinta = d.getDay() === DIA.QUINTA;
  d.setHours(quinta ? 19 : 18, quinta ? 30 : 0, 0, 0);
  return d;
}

export function sortCultos(cultos: CultoEntry[]): CultoEntry[] {
  const key = (c: CultoEntry) => (c.dataISO ? new Date(c.dataISO).getTime() : Number.MAX_SAFE_INTEGER);
  return [...cultos].sort((a, b) => key(a) - key(b));
}

// ---------- <input type="date"> ↔ culto ----------

/** YYYY-MM-DD para o input (cai no "DD/MM" antigo se o culto não tiver dataISO). */
export function cultoDateToInput(c: Pick<CultoEntry, "data" | "dataISO">): string {
  let d = calendarDate(c.dataISO);
  if (!d) {
    const m = c.data?.match(/^(\d{2})\/(\d{2})$/);
    if (m) d = new Date(new Date().getFullYear(), +m[2] - 1, +m[1]);
  }
  return d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : "";
}

/** Atualiza `data` E `dataISO` juntos (antes só `data` mudava e o sync/dia da semana quebravam). */
export function dateFromInput(value: string): Pick<CultoEntry, "data" | "dataISO"> {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return { data: "", dataISO: undefined };
  return { data: `${pad(d)}/${pad(m)}`, dataISO: horarioPadrao(new Date(y, m - 1, d)).toISOString() };
}

// ---------- resultado da IA ----------

export interface AtribuicoesIA {
  /** id do culto → campos preenchidos */
  cultos: Record<string, Partial<EscalaFields>>;
  /** id da semana → conjunto */
  conjuntos: Record<string, string>;
}

/** Aplica as sugestões da IA sem mexer em ids, datas ou vínculo com o Calendar. */
export function applyAtribuicoes(data: EscalaData, ia: AtribuicoesIA): EscalaData {
  return {
    ...data,
    semanas: data.semanas.map((w) => {
      const conjunto = ia.conjuntos?.[w.id];
      return {
        ...w,
        conjunto: conjunto ?? w.conjunto,
        cultos: w.cultos.map((c) => ({ ...c, ...ia.cultos?.[c.id], ...(conjunto && { conjunto }) })),
      };
    }),
  };
}