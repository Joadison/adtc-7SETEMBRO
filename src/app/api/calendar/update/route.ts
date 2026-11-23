import { NextResponse } from "next/server";
import type { calendar_v3 } from "googleapis";
import { mergeDescription } from "@/lib/calendar-description";
import { apiRoute, getCalendar, HttpError, requireAuth } from "@/lib/google-calendar";

/**
 * Evento único → ele mesmo. Mestre de uma série recorrente → a instância do período pedido.
 * (Antes, ids sem "_" iam direto para `instances`, o que falha em eventos não recorrentes.)
 */
async function loadEvent(
  calendar: calendar_v3.Calendar,
  calendarId: string,
  eventId: string,
  timeMin?: string,
  timeMax?: string,
) {
  const { data } = await calendar.events.get({ calendarId, eventId });
  if (!data.recurrence?.length) return data;
  return (await calendar.events.instances({ calendarId, eventId, timeMin, timeMax })).data.items?.[0];
}

export const POST = apiRoute(async (request) => {
  await requireAuth();

  // Aceita { eventId, fields: {...} } (novo) ou os campos soltos no corpo (formato antigo).
  const { eventId, timeMin, timeMax, fields, ...flatFields } = await request.json();
  if (!eventId) throw new HttpError(400, "ID do evento é obrigatório");

  const { calendar, calendarId } = getCalendar("write");
  const event = await loadEvent(calendar, calendarId, eventId, timeMin, timeMax);
  if (!event?.id) throw new HttpError(404, "Evento não encontrado");

  await calendar.events.patch({
    calendarId,
    eventId: event.id,
    requestBody: { description: mergeDescription(event.description, { ...flatFields, ...fields }) },
  });

  return NextResponse.json({ success: true, message: "Evento atualizado" });
});
