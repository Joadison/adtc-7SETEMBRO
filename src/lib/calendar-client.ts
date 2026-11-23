import { MESES } from "./escala-types";
import type { CalendarEvent } from "./ics-parser";

export async function fetchMonthEvents(mes: string, ano = new Date().getFullYear()): Promise<CalendarEvent[]> {
  const month = MESES.indexOf(mes.toUpperCase()) + 1;
  if (!month) return [];

  const res = await fetch(`/api/calendar?year=${ano}&month=${month}`);
  if (!res.ok) throw new Error(`Falha ao buscar o calendário (HTTP ${res.status})`);
  return (await res.json()).events ?? [];
}

export async function fetchEventsOfMonths(meses: string[], ano?: number): Promise<CalendarEvent[]> {
  return (await Promise.all(meses.map((m) => fetchMonthEvents(m, ano)))).flat();
}