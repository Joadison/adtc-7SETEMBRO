// lib/update-calendar.ts
import type { EscalaData, CultoEntry } from "./escala-types";
import { CalendarEvent } from "./ics-parser";

interface UpdateCalendarParams {
  escalaData: EscalaData;
  calendarEvents: CalendarEvent[];
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export async function updateCalendarWithEscalaData({
  escalaData,
  calendarEvents,
  onSuccess,
  onError
}: UpdateCalendarParams) {
  try {
    const itemsToUpdate = escalaData.semanas.flatMap(week => 
      week.cultos.map(culto => {
        const matchingEvent = findMatchingEvent(culto, calendarEvents);
        return matchingEvent ? { matchingEvent, culto } : null;
      })
    ).filter(Boolean);

    if (itemsToUpdate.length === 0) {
      onSuccess?.();
      return;
    }
    
    const updatePromises = itemsToUpdate.map(async (item) => {
      const { matchingEvent, culto } = item!;
      const response = await fetch("/api/calendar/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          eventId: matchingEvent.id,
          porteiro: culto.porteiro,
          recepcao: culto.recepcao,
          professoraUp: culto.professoraUp,
          professoraDow: culto.professoraDow,
          timeMin: matchingEvent.start,
          timeMax: matchingEvent.end,
        }),
      });

      if (!response.ok) throw new Error(`Erro no evento ${matchingEvent.id}`);
      return response.json(); 
    });

    await Promise.all(updatePromises);
    onSuccess?.();
    
  } catch (error) {
    console.error("Erro na atualização:", error);
    onError?.(error as Error);
  }
}

function findMatchingEvent(
  culto: CultoEntry, 
  calendarEvents: CalendarEvent[]
): CalendarEvent | undefined {
  return calendarEvents.find(event => {
    const eventNormalized = event.start.replace(/\.\d+Z$/, 'Z'); 
    const cultoNormalized = culto.dataISO?.replace(/\.\d+Z$/, 'Z');

    if (eventNormalized !== cultoNormalized) {
      return false;
    }
    const titleMatch = event.title.toLowerCase().includes(culto.nome.toLowerCase());
    
    const descriptionMatch = event.description ? 
      event.description.toLowerCase().includes(culto.nome.toLowerCase()) : false;
    
    return titleMatch || descriptionMatch;
  });
}