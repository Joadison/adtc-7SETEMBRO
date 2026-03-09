import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const { eventId, porteiro, recepcao, timeMax, timeMin, professoraUp, professoraDow } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: "ID do evento é obrigatório" }, { status: 400 });
    }

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

    const { data: realEvent } = await calendar.events.instances({
      calendarId,
      eventId: eventId,
      timeMin: timeMin,
      timeMax: timeMax,
    });

    const instance = realEvent.items?.[0];

    let description = realEvent.description || "";

    if (porteiro) {
      description = updateFieldInDescription(description, "Porteiro", porteiro);
    }
    if (recepcao) {
      description = updateFieldInDescription(description, "Recepção", recepcao);
    }

    if (professoraUp) {
      description = updateFieldInDescription(description, "professoraMaiores", professoraUp);
    }

    if (professoraDow) {
      description = updateFieldInDescription(description, "professoraMenores", professoraDow);
    }

    await calendar.events.patch({
      calendarId,
      eventId: instance?.id!,
      requestBody: { 
        description
      },
    }); 

    return NextResponse.json({ success: true, message: "Evento atualizado" });

  } catch (error: any) {
    console.error("Erro:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function updateFieldInDescription(description: string, field: string, value: string): string {
  if (value === "LIVRE") {
    const fieldPattern = new RegExp(`${field}\\s*[:\\-]\\s*.+?(\\n|$)`, "i");
    return description.replace(fieldPattern, "").trim();
  }

  const fieldPattern = new RegExp(`${field}\\s*[:\\-]\\s*.+?(?:\\n|$)`, "i");

  if (fieldPattern.test(description)) {
    return description.replace(fieldPattern, `${field}: ${value}\n`);
  } else {
    const trimmedDesc = description.trim();
    return (trimmedDesc + (trimmedDesc ? "\n" : "") + `${field}: ${value}`).trim();
  }
}