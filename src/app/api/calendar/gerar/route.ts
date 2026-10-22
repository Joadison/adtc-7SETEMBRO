

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PORTEIROS = [
  "Dc. Cleiton",
  "Aux. Wagner",
  "Aux. Viana",
  "Aux. Joadison",
  "Aux. Davi",
  "Aux. Paulo",
  "Aux. Antonilson",
  "Aux. Vitor",
];

const RECEPCOES = [
  "Ir. Natalia",
  "Ir. Victoria",
  "Ir. Daniele",
  "Ir. Rebeca",
  "Ir. Iris",
  "Ir. Ruthe",
  "Ir. Eloisa",
];

const PROFESSORAS = [
  "Ir. Monica",
  "Ir. Victoria",
  "Ir. Daniele",
  "Ir. Rebeca",
  "Ir. Val",
  "Ir. Cleuma",
  "Ir. Marilia",
  "Ir. Ruthe",
  "Ir. Raryane",
];

const CONJUNTOS = [
  "Conjunto de Jovens",
  "Conjunto de Senhoras",
];

function montarPrompt(params: {
  mes: string;
  ano: number;
  eventos: any[];
  escalaMesAnterior: string;
  diasComCulto: string[];
}) {
  const {
    mes,
    ano,
    eventos,
    escalaMesAnterior,
    diasComCulto,
  } = params;

  return `
Você é um assistente! Monte a escala COMPLETA para TODOS os dias listados em DIAS COM CULTO.
Não pule nenhum dia. Não invente datas. Retorne APENAS JSON puro (sem markdown, sem comentários).

REGRAS OBRIGATÓRIAS:
1. NÃO repetir a mesma pessoa em funções iguais no mesmo mês, a menos que seja inevitável.
2. NÃO repetir pessoas que já serviram no mês anterior na MESMA função.
3. Distribuir as funções de forma equilibrada.
4. Ninguém deve servir mais de 4 vezes no mês, quando houver pessoas suficientes.
5. Cultos de quinta-feira NÃO têm "Porteiro 2".
6. Cultos de quinta-feira NÃO têm professoras.
7. Cultos de domingo TÊM professoras:
   - professoraUp = Maiores
   - professoraDow = Menores
8. Se faltar pessoa disponível para alguma função, use "LIVRE".
9. Não invente nomes fora das listas disponíveis.
10. Utilize os eventos do Google Calendar para identificar o nome do culto/pregador quando essas informações estiverem disponíveis.

LISTAS DISPONÍVEIS:
Porteiros:${PORTEIROS.join(", ")}
Recepção:${RECEPCOES.join(", ")}
Professoras:${PROFESSORAS.join(", ")}
Conjuntos:${CONJUNTOS.join(", ")}
MÊS A MONTAR:${mes}/${ano}

DIAS COM CULTO:
${diasComCulto.join(", ") || "(não informado)"}

EVENTOS DO GOOGLE CALENDAR PARA SER PREENCHIDO PELO O AGENTE:
${JSON.stringify(eventos, null, 2)}

ESCALA DO MÊS ANTERIOR:
${JSON.stringify(escalaMesAnterior ?? {}, null, 2)}

FORMATO DE SAÍDA (JSON puro, sem markdown):
{
  "semanas": [
    {
      "id": "w1",
      "conjunto": "<um dos Conjuntos disponíveis>",
      "cultos": [
        {
          "id": "c1",
          "data": "DD/MM",
          "dataISO": "YYYY-MM-DD",
          "nome": "<nome do culto>",
          "pregador": "<nome ou vazio>",
          "porteiro1": "<Porteiro ou LIVRE>",
          "porteiro2": "<Porteiro, LIVRE, ou vazio se quinta>",
          "recepcao": "<Recepção ou LIVRE>",
          "professoraUp": "<Professora, LIVRE, ou vazio se não-domingo>",
          "professoraDow": "<Professora, LIVRE, ou vazio se não-domingo>"
        }
      ]
    }
  ]
}`.trim();
}

async function chamarGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ausente");
  }
  
  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });
    console.log(interaction.output_text);
    const text = interaction.output_text;
    if (!text) throw new Error("Gemini não retornou conteúdo");
    let limpo = text.replace(/^```json\s*|\s*```$/g, "").trim();
    let parsed: any = JSON.parse(limpo);
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
    if (!parsed || !Array.isArray(parsed.semanas)) {
      throw new Error(
        "Gemini retornou JSON sem o campo 'semanas' esperado: " +
        JSON.stringify(parsed).slice(0, 200)
      );
    }
    return parsed;
  } catch (error: any) {
    console.error(`[Gemini]:`, error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      mes,
      ano,
      diasComCulto,
    } = body as {
      mes: string;
      ano: number;
      diasComCulto: string[];
    };

    if (!mes || !ano) {
      return NextResponse.json(
        {error: "mes e ano são obrigatórios"},
        {status: 400}
      );
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace( /\\n/g, "\n" );
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!clientEmail || !privateKey || !calendarId) {
      return NextResponse.json(
        {error:"Configuração do Google Calendar incompleta"},
        {status: 500}
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/calendar.readonly",
      ],
    });

    const calendar = google.calendar({ version: "v3", auth});

    const MESES = [
      "JANEIRO",
      "FEVEREIRO",
      "MARÇO",
      "ABRIL",
      "MAIO",
      "JUNHO",
      "JULHO",
      "AGOSTO",
      "SETEMBRO",
      "OUTUBRO",
      "NOVEMBRO",
      "DEZEMBRO",
    ];

    const mesIndex = MESES.indexOf(
      mes.toUpperCase()
    );

    if (mesIndex === -1) {
      return NextResponse.json(
        {error: "Mês inválido"},
        {status: 400}
      );
    }

    const inicioHistorico = new Date(Date.UTC(ano, mesIndex - 12, 1, 0, 0, 0));
    const fimHistorico = new Date(Date.UTC(ano, mesIndex, 1, 0, 0, 0));

    const inicio = new Date(Date.UTC(ano,mesIndex,1,0,0,0));
    const fim = new Date(Date.UTC(ano, mesIndex + 1, 1,0,0,0));
    const response = await calendar.events.list({
      calendarId,
      timeMin: inicio.toISOString(),
      timeMax: fim.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 2500,
    });

    const eventosDoMes = response.data.items ?? [];
    const eventos = eventosDoMes
    .filter((e) => {
      const nome = (e.summary ?? "").toLowerCase();
      return nome.startsWith("culto");
    })
    .map(
      (evento) => ({
        id: evento.id,
        nome: evento.summary ?? "",
        descricao: evento.description ?? "",
        inicio: evento.start?.dateTime ??evento.start?.date ?? "",
        fim: evento.end?.dateTime ?? evento.end?.date ?? "",
        local: evento.location ?? "",
        criador: evento.creator?.email ?? "",
        organizador: evento.organizer?.email ?? "",
      })
    );
    
    const historicoResponse = await calendar.events.list({
      calendarId,
      timeMin: inicioHistorico.toISOString(),
      timeMax: fimHistorico.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 2500,
    });
   const eventosHistorico = historicoResponse.data.items ?? [];
   let escalaMesAnterior: string = "";
    for (const e of eventosHistorico) {
      const nome = (e.summary ?? "").toLowerCase();

      if (!nome.startsWith("culto")) {
        continue;
      }

      const desc = (e.description ?? "")
        .replace(/&nbsp;/g, " ")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .trim();

      if (!desc) continue;

      const iso = e.start?.dateTime ?? e.start?.date ?? "";

      const campos: string[] = [];

      const porteiro = desc.match(/Porteiro\s*\d?\s*:\s*([^\n]+)/i);
      const recepcao = desc.match(/Recep(?:ç|c)(?:ão|ao)\s*:\s*([^\n]+)/i);
      const prof = desc.match(/professora\s*:\s*([^\n]+)/i);
      const profUp = desc.match(/professoraMaiores\s*:\s*([^\n]+)/i);
      const profDown = desc.match(/professoraMenores\s*:\s*([^\n]+)/i);

      if (porteiro) campos.push(`Porteiro: ${porteiro[1].trim()}`);
      if (recepcao) campos.push(`Recepcao: ${recepcao[1].trim()}`);
      if (prof) campos.push(`Professora ${prof[1].trim()}`);
      if (profUp) campos.push(`professoraMaiores: ${profUp[1].trim()}`);
      if (profDown) campos.push(`professoraMenores: ${profDown[1].trim()}`);

      if (campos.length === 0) continue;

      const data = new Date(iso).toLocaleDateString("pt-BR");

      escalaMesAnterior += `${data}: ${campos.join(" | ")}\n`;
    }

   const prompt = montarPrompt({
      mes,
      ano,
      eventos,
      escalaMesAnterior,
      diasComCulto,
    });
    console.log(prompt)

    //const escalaGerada = await chamarGemini(prompt);

    return NextResponse.json({
      prompt: prompt,
      //escala: escalaGerada,
      eventosEncontrados:
        eventos.length,
    });
  } catch (err: any) {
    console.error(
      "[gerar escala]",
      err
    );

    return NextResponse.json(
      { error: err?.message ?? "Erro ao gerar escala"},
      {status: 500}
    );
  }
}

function extrairEscala(desc: string): string | null {
  const campos: string[] = [];

  const porteiro = desc.match(/Porteiro\s*\d?\s*:\s*([^\n]+)/i);
  const recepcao = desc.match(/Recep(?:ç|c)(?:ão|ao)\s*:\s*([^\n]+)/i);
  const profUp = desc.match(/professoraMaiores\s*:\s*([^\n]+)/i);
  const profDown = desc.match(/professoraMenores\s*:\s*([^\n]+)/i);

  if (porteiro) campos.push(`P: ${porteiro[1].trim()}`);
  if (recepcao) campos.push(`R: ${recepcao[1].trim()}`);
  if (profUp) campos.push(`PMa: ${profUp[1].trim()}`);
  if (profDown) campos.push(`PMe: ${profDown[1].trim()}`);

  return campos.length > 0 ? campos.join(" | ") : null;
}