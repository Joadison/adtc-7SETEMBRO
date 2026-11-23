import { NextResponse } from "next/server";
import { parseGoogleEvents } from "@/lib/ics-parser";
import { apiRoute, getCalendar, startOfMonthBR } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";

export const GET = apiRoute(async (req) => {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month")); // 1-12

  const { calendar, calendarId } = getCalendar("read");
  const range = year && month
    ? { timeMin: startOfMonthBR(year, month - 1), timeMax: startOfMonthBR(year, month) }
    : {};

  const { data } = await calendar.events.list({
    calendarId,
    ...range,
    singleEvents: true,
    orderBy: "startTime",
  });

  return NextResponse.json({ events: parseGoogleEvents(data.items ?? []) });
});