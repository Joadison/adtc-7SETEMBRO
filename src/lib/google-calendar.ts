// Só para rotas de API (server). Centraliza auth, credenciais e tratamento de erro.
import { google } from "googleapis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function requireAuth() {
  if ((await cookies()).get("auth")?.value !== "true") throw new HttpError(401, "Não autorizado");
}

export function getCalendar(access: "read" | "write" = "read") {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!email || !key || !calendarId) throw new HttpError(500, "Configuração incompleta");

  const scope = `https://www.googleapis.com/auth/calendar${access === "read" ? ".readonly" : ""}`;
  const auth = new google.auth.JWT({ email, key, scopes: [scope] });
  return { calendar: google.calendar({ version: "v3", auth }), calendarId };
}

/** Meia-noite de Brasília (UTC-3) do dia 1. monthIndex 0-11; aceita negativo/overflow (ex.: -12). */
export const startOfMonthBR = (year: number, monthIndex: number) =>
  new Date(Date.UTC(year, monthIndex, 1, 3)).toISOString();

/** Envolve o handler: erros viram JSON com o status certo (sem try/catch em cada rota). */
export function apiRoute(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (e: any) {
      if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
      console.error("[api]", e);
      if (e?.code === 403 || e?.code === 429) {
        return NextResponse.json(
          { error: "Limite de requisições excedido. Tente novamente em alguns segundos." },
          { status: 429 },
        );
      }
      return NextResponse.json({ error: e?.message ?? "Erro interno" }, { status: 500 });
    }
  };
}