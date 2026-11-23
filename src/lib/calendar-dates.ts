import type { CalendarEvent } from "./ics-parser";

/** "2026-11-26" → Date local (new Date("YYYY-MM-DD") usaria UTC e erraria o dia). */
export function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export const getStart = (e: CalendarEvent) => (e.allDay ? parseLocalDate(e.start) : new Date(e.start));
export const getEnd = (e: CalendarEvent) => (e.allDay ? parseLocalDate(e.end) : new Date(e.end));