import { pickFields, type EscalaFields } from "./calendar-description";
import type { CultoEntry, EscalaData } from "./escala-types";
import { DIA, diaDaSemana } from "./escala-utils";
import type { CalendarEvent } from "./ics-parser";
import { findEvent } from "./sync-calendar";

interface UpdateCalendarParams {
  escalaData: EscalaData;
  calendarEvents: CalendarEvent[];
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/** Quinta: uma "professora" só (Maiores / Menores). Domingo: separadas. Outros dias: nenhuma. */
function buildFields(culto: CultoEntry): Partial<EscalaFields> {
  const { professora, professoraUp, professoraDow, ...rest } = pickFields(culto);
  const dia = diaDaSemana(culto.dataISO);

  if (dia === DIA.QUINTA) {
    return { ...rest, professora: [professoraUp, professoraDow].filter(Boolean).join(" / ") };
  }
  if (dia === DIA.DOMINGO) return { ...rest, professoraUp, professoraDow };
  return rest;
}

async function updateEvent(culto: CultoEntry, event: CalendarEvent) {
  const response = await fetch("/api/calendar/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId: event.id,
      fields: buildFields(culto),
      timeMin: event.start,
      timeMax: event.end,
    }),
  });
  if (!response.ok) throw new Error(`Erro no evento ${event.id}`);
}

export async function updateCalendarWithEscalaData({
  escalaData,
  calendarEvents,
  onSuccess,
  onError,
}: UpdateCalendarParams) {
  try {
    const jobs = escalaData.semanas
      .flatMap((week) => week.cultos)
      .flatMap((culto) => {
        const event = findEvent(culto, calendarEvents);
        return event ? [{ culto, event }] : [];
      });

    await Promise.all(jobs.map(({ culto, event }) => updateEvent(culto, event)));
    onSuccess?.();
  } catch (error) {
    console.error("Erro na atualização:", error);
    onError?.(error as Error);
  }
}