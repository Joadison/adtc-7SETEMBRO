import { NextResponse } from "next/server";
import type { calendar_v3 } from "googleapis";
import { normalizeDescription } from "@/lib/calendar-description";
import { apiRoute, getCalendar, requireAuth } from "@/lib/google-calendar";
import type { SyncPayload, SyncResult } from "@/lib/sync-calendar";

export const POST = apiRoute(async (request) => {
  await requireAuth();

  const {
    toCreate = [],
    toUpdate = [],
    toDelete = [],
    defaultTimeZone = "America/Sao_Paulo",
  } = (await request.json()) as Partial<SyncPayload>;

  const { calendar, calendarId } = getCalendar("write");
  const results: SyncResult = { deleted: [], updated: [], created: [], errors: [] };

  // uma operação com falha não derruba as outras (resposta 207)
  const attempt = async (op: string, target: string, fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (e: any) {
      results.errors.push({ op, target, error: e.message });
    }
  };
  const when = (dateTime: string, timeZone?: string) => ({ dateTime, timeZone: timeZone || defaultTimeZone });

  // 1) DELETE — 404/410 = já não existe, conta como sucesso
  for (const { eventId } of toDelete) {
    if (!eventId) continue;
    await attempt("delete", eventId, async () => {
      try {
        await calendar.events.delete({ calendarId, eventId });
      } catch (e: any) {
        if (e.code !== 404 && e.code !== 410) throw e;
      }
      results.deleted.push(eventId);
    });
  }

  // 2) UPDATE — só os campos enviados; description sempre gravada como JSON canônico
  for (const { eventId, summary, description, start, end, timeZone } of toUpdate) {
    if (!eventId) continue;

    const requestBody: calendar_v3.Schema$Event = {};
    if (summary !== undefined) requestBody.summary = summary;
    if (description !== undefined) requestBody.description = normalizeDescription(description);
    if (start) requestBody.start = when(start, timeZone);
    if (end) requestBody.end = when(end, timeZone);
    if (!Object.keys(requestBody).length) continue;

    await attempt("update", eventId, async () => {
      const { data } = await calendar.events.patch({ calendarId, eventId, requestBody });
      results.updated.push({ eventId, id: data.id! });
    });
  }

  // 3) CREATE
  for (const item of toCreate) {
    await attempt("create", item.summary || "(sem título)", async () => {
      const { data } = await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: item.summary || "Culto",
          description: normalizeDescription(item.description),
          start: when(item.start, item.timeZone),
          end: when(item.end, item.timeZone),
        },
      });
      results.created.push({ id: data.id!, clientId: item.clientId });
    });
  }

  return NextResponse.json(
    { success: !results.errors.length, results },
    { status: results.errors.length ? 207 : 200 },
  );
});