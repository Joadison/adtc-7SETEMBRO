// app/api/calendar/sync/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { cookies } from "next/headers";

type CreateItem = {
  summary: string;
  description?: string;
  start: string; // ISO
  end: string;   // ISO
  timeZone?: string;
  recurrence?: string[];
  clientId?: string; // opcional: id local (culto.id) para mapear de volta
};

type UpdateItem = {
  eventId: string;
  summary?: string;
  description?: string;
  start?: string;
  end?: string;
  timeZone?: string;
};

type DeleteItem = {
  eventId: string;
};

export async function POST(request: Request) {
  try {
    // ---------- auth ----------
    const cookieStore = await cookies();
    if (cookieStore.get("auth")?.value !== "true") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // ---------- payload ----------
    const {
      toCreate = [] as CreateItem[],
      toUpdate = [] as UpdateItem[],
      toDelete = [] as DeleteItem[],
      defaultTimeZone = "America/Sao_Paulo",
    } = await request.json();

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!clientEmail || !privateKey || !calendarId) {
      return NextResponse.json({ error: "Configuração incompleta" }, { status: 500 });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
    const calendar = google.calendar({ version: "v3", auth });

    const results = {
      deleted: [] as string[],
      updated: [] as { eventId: string; id: string }[],
      created: [] as { id: string; clientId?: string }[],
      errors: [] as { op: string; target: string; error: string }[],
    };

    // ---------- 1) DELETE primeiro ----------
    for (const item of toDelete) {
      if (!item?.eventId) continue;
      try {
        await calendar.events.delete({ calendarId, eventId: item.eventId });
        results.deleted.push(item.eventId);
      } catch (e: any) {
        // 404/410 = já não existe → idempotente
        if (e.code === 404 || e.code === 410) {
          results.deleted.push(item.eventId);
        } else {
          results.errors.push({
            op: "delete",
            target: item.eventId,
            error: e.message,
          });
        }
      }
    }

    // ---------- 2) UPDATE (título, descrição, dia/hora) ----------
    for (const item of toUpdate) {
      if (!item?.eventId) continue;
      try {
        const tz = item.timeZone || defaultTimeZone;
        const requestBody: Record<string, unknown> = {};

        if (item.summary !== undefined) requestBody.summary = item.summary;
        if (item.description !== undefined) requestBody.description = item.description;

        // Mudança de dia/hora
        if (item.start) requestBody.start = { dateTime: item.start, timeZone: tz };
        if (item.end) requestBody.end = { dateTime: item.end, timeZone: tz };

        if (Object.keys(requestBody).length === 0) continue;

        const { data } = await calendar.events.patch({
          calendarId,
          eventId: item.eventId,
          requestBody,
        });

        results.updated.push({ eventId: item.eventId, id: data.id! });
      } catch (e: any) {
        results.errors.push({
          op: "update",
          target: item.eventId,
          error: e.message,
        });
      }
    }

    // ---------- 3) CREATE ----------
    for (const item of toCreate) {
      try {
        const tz = item.timeZone || defaultTimeZone;
        const { data } = await calendar.events.insert({
          calendarId,
          requestBody: {
            summary: item.summary || "Culto",
            description: item.description ?? "",
            start: { dateTime: item.start, timeZone: tz },
            end: { dateTime: item.end, timeZone: tz },
            ...(item.recurrence ? { recurrence: item.recurrence } : {}),
          },
        });
        results.created.push({ id: data.id!, clientId: item.clientId });
      } catch (e: any) {
        results.errors.push({
          op: "create",
          target: item.summary || "(sem título)",
          error: e.message,
        });
      }
    }

    const httpStatus = results.errors.length ? 207 : 200; // 207 = multi-status
    return NextResponse.json({ success: results.errors.length === 0, results }, { status: httpStatus });
  } catch (error: any) {
    console.error("Erro sync:", error);
    if (error.code === 403 || error.code === 429) {
      await new Promise((r) => setTimeout(r, 5000));
      return NextResponse.json(
        { error: "Limite de requisições excedido. Tente novamente em 5 segundos." },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}