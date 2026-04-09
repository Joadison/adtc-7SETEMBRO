import { NextResponse } from "next/server";
import { google } from "googleapis";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {

    //VALIDAR ACESSO!!!
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("escala_auth");

    if (authCookie?.value !== "true") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }


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

    let eventData;
    let finalEventId;

    if (!eventId.includes('_')) {
      const { data: realEvent } = await calendar.events.instances({
        calendarId,
        eventId: eventId,
        timeMin: timeMin,
        timeMax: timeMax,
      });
      eventData = realEvent.items?.[0];
      finalEventId = eventData?.id;
      if (!finalEventId) {
        return NextResponse.json({ error: "Instância do evento não encontrada" }, { status: 404 });
      }
    } else {
      console.log("ID já contém data, pulando chamada de instances...");
      const { data } = await calendar.events.get({
        calendarId,
        eventId: eventId,
      });
      eventData = data;
      finalEventId = eventId;
    }

    let description = eventData?.description || "";

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
      eventId: finalEventId,
      requestBody: { 
        description
      },
    }); 

    return NextResponse.json({ success: true, message: "Evento atualizado" });

  } catch (error: any) {
    console.error("Erro:", error);
     if (error.code === 403 || error.code === 429) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return NextResponse.json({ 
            error: "Limite de requisições excedido. Tente novamente em 5 segundos." 
        }, { status: 429 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function updateFieldInDescription(description: string, field: string, value: string): string {
  const lines = description.split('\n');
  const fieldPattern = new RegExp(`^${field}\\s*[:\\-]\\s*`, 'i');

  let fieldIndex = -1;
  const cleanLines = lines.filter(line => line.trim() !== '');

  for (let i = 0; i < cleanLines.length; i++) {
    if (fieldPattern.test(cleanLines[i])) {
      fieldIndex = i;
      break;
    }
  }

  if (value === "LIVRE") {
    if (fieldIndex !== -1) {
      cleanLines.splice(fieldIndex, 1);
    }
    return cleanLines.join('\n').trim();
  }

  const newLine = `${field}: ${value}`;

   if (fieldIndex !== -1) {
    cleanLines[fieldIndex] = newLine;
  } else {
    cleanLines.push(newLine);
  }

  return cleanLines.join('\n').trim();
}