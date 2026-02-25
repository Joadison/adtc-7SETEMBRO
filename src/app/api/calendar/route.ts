
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { parseGoogleEvents } from "@/lib/ics-parser";

export const revalidate = 300;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!clientEmail || !privateKey || !calendarId) {
      return NextResponse.json(
        { error: "Configuração incompleta" },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const calendar = google.calendar({ version: "v3", auth });
    
    let timeMin: string | undefined;
    let timeMax: string | undefined;

    if (yearParam && monthParam) {
      const year = Number(yearParam);
      const month = Number(monthParam) - 1;

      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);

      timeMin = start.toISOString();
      timeMax = end.toISOString();
    }

    const { data } = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = parseGoogleEvents(data.items || []);

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error("Erro ao processar calendario:", error);
    return NextResponse.json(
      { error: "Erro ao processar calendario" },
      { status: 500 }
    );
  }
}
