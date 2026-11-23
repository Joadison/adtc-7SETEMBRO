import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { parseDescription, type EscalaFields, type FieldKey } from "@/lib/calendar-description";
import { CONJUNTOS_IA, PESSOAS_IA } from "@/lib/escala-people";
import { MESES } from "@/lib/escala-types";
import { DIA, diaDaSemana, type AtribuicoesIA } from "@/lib/escala-utils";
import { apiRoute, getCalendar, HttpError, requireAuth, startOfMonthBR } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------- entrada ----------

interface Body {
  mes: string;
  ano: number;
  /** estrutura atual do formulário: a IA só devolve atribuições, nunca recria cultos */
  semanas: { id: string; cultos: { id: string; data: string; dataISO?: string; nome: string; pregador?: string }[] }[];
  /** true = devolve só o prompt (para depurar), sem chamar a IA */
  debug?: boolean;
}

const NOMES_DIA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** Quinta: sem porteiro 2 e sem professoras. Domingo: com professoras (Up = Maiores, Dow = Menores). */
function camposDoDia(dia: number): FieldKey[] {
  if (dia === DIA.QUINTA) return ["porteiro1", "recepcao"];
  if (dia === DIA.DOMINGO) return ["porteiro1", "porteiro2", "recepcao", "professoraUp", "professoraDow"];
  return ["porteiro1", "porteiro2", "recepcao"];
}

const permitidos = (campo: FieldKey): readonly string[] =>
  campo === "recepcao" ? PESSOAS_IA.recepcao
  : campo === "professoraUp" || campo === "professoraDow" ? PESSOAS_IA.professoras
  : PESSOAS_IA.porteiros;

// ---------- histórico (lido do JSON do description) ----------

const FUNCOES: [FieldKey, "porteiro" | "recepcao" | "professora"][] = [
  ["porteiro1", "porteiro"],
  ["porteiro2", "porteiro"],
  ["recepcao", "recepcao"],
  ["professora", "professora"],
  ["professoraUp", "professora"],
  ["professoraDow", "professora"],
];

const nomesDe = (valor: string) =>
  valor.split("/").map((n) => n.trim()).filter((n) => n && n !== "LIVRE");

async function carregarHistorico(ano: number, mesIndex: number) {
  const { calendar, calendarId } = getCalendar("read");
  const { data } = await calendar.events.list({
    calendarId,
    timeMin: startOfMonthBR(ano, mesIndex - 12),
    timeMax: startOfMonthBR(ano, mesIndex),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 2500,
  });

  const chaveMesAnterior = new Date(Date.UTC(ano, mesIndex - 1, 1)).toISOString().slice(0, 7);
  const carga: Record<string, Record<string, number>> = {}; // pessoa → função → vezes
  const mesAnterior: Record<string, string>[] = [];

  for (const e of data.items ?? []) {
    if (!(e.summary ?? "").toLowerCase().startsWith("culto")) continue;

    const inicio = e.start?.dateTime ?? e.start?.date ?? "";
    const { fields } = parseDescription(e.description);
    const registro: Record<string, string> = { data: inicio.slice(0, 10) };

    for (const [campo, funcao] of FUNCOES) {
      const nomes = nomesDe(fields[campo]);
      if (!nomes.length) continue;
      registro[campo] = fields[campo];
      for (const nome of nomes) {
        carga[nome] ??= {};
        carga[nome][funcao] = (carga[nome][funcao] ?? 0) + 1;
      }
    }

    if (Object.keys(registro).length > 1 && inicio.startsWith(chaveMesAnterior)) mesAnterior.push(registro);
  }

  return { mesAnterior, carga };
}

// ---------- prompt ----------

type Historico = Awaited<ReturnType<typeof carregarHistorico>>;

function montarPrompt(mes: string, ano: number, cultos: object[], { mesAnterior, carga }: Historico) {
  return `
Você monta a escala de serviço de uma igreja. Retorne APENAS JSON puro (sem markdown, sem comentários).

REGRAS:
1. Preencha SOMENTE os campos listados em "preencher" de cada culto, para TODOS os cultos. Não invente cultos nem ids.
2. Use apenas nomes das LISTAS. Se não houver pessoa disponível para uma função, use "LIVRE".
3. Não repetir a mesma pessoa na mesma função dentro do mês, a menos que seja inevitável.
4. Não repetir quem serviu na mesma função no mês anterior ("mesAnterior").
5. Equilibre pela "cargaUltimos12Meses": prefira quem serviu menos. Ninguém serve mais de 4 vezes no mês, havendo pessoas suficientes.
6. A mesma pessoa não ocupa duas funções no mesmo culto.
7. professoraUp = Maiores, professoraDow = Menores.
8. Para cada semana escolha um conjunto das LISTAS.

LISTAS:
${JSON.stringify({ ...PESSOAS_IA, conjuntos: CONJUNTOS_IA })}

MÊS A MONTAR: ${mes}/${ano}

CULTOS:
${JSON.stringify(cultos)}

HISTÓRICO:
${JSON.stringify({ mesAnterior, cargaUltimos12Meses: carga })}

FORMATO DE SAÍDA:
{
  "conjuntos": { "<id da semana>": "<conjunto>" },
  "cultos": { "<id do culto>": { "porteiro1": "...", "recepcao": "..." } }
}`.trim();
}

// ---------- IA ----------

function extrairJson(text: string) {
  const ini = text.indexOf("{");
  const fim = text.lastIndexOf("}");
  if (ini === -1 || fim < ini) throw new HttpError(502, "A IA não retornou JSON");
  try {
    return JSON.parse(text.slice(ini, fim + 1));
  } catch {
    throw new HttpError(502, "A IA retornou um JSON inválido. Tente novamente.");
  }
}

async function chamarGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new HttpError(500, "GEMINI_API_KEY ausente");

  const ai = new GoogleGenAI({ apiKey });
  const interaction = await ai.interactions.create({
    model: process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
    input: prompt,
  });
  if (!interaction.output_text) throw new HttpError(502, "Gemini não retornou conteúdo");
  return extrairJson(interaction.output_text);
}

/** Só passa o que é válido: ids/campos esperados e nomes das listas (nome inventado vira "LIVRE"). */
function sanitizar(raw: any, cultos: { id: string; preencher: FieldKey[] }[], semanas: Body["semanas"]): AtribuicoesIA {
  const out: AtribuicoesIA = { cultos: {}, conjuntos: {} };

  for (const { id, preencher } of cultos) {
    const bruto = raw?.cultos?.[id];
    if (!bruto) continue;

    const campos: Partial<EscalaFields> = {};
    for (const campo of preencher) {
      const valor = bruto[campo];
      if (typeof valor !== "string") continue;
      campos[campo] = valor === "LIVRE" || permitidos(campo).includes(valor) ? valor : "LIVRE";
    }
    out.cultos[id] = campos;
  }

  for (const { id } of semanas) {
    const conjunto = raw?.conjuntos?.[id];
    if (CONJUNTOS_IA.includes(conjunto)) out.conjuntos[id] = conjunto;
  }
  return out;
}

// ---------- rota ----------

export const POST = apiRoute(async (req) => {
  await requireAuth();

  const { mes, ano, semanas, debug } = (await req.json()) as Body;
  const mesSemAcento = (mes ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const mesIndex = MESES.indexOf(mesSemAcento); // "MARÇO" e "MARCO" funcionam
  if (mesIndex === -1 || !ano || !Array.isArray(semanas)) {
    throw new HttpError(400, "mes, ano e semanas são obrigatórios");
  }

  const cultos = semanas.flatMap((w) =>
    w.cultos.map((c) => {
      const dia = diaDaSemana(c.dataISO);
      return {
        id: c.id,
        semana: w.id,
        data: c.data,
        dia: NOMES_DIA[dia] ?? "indefinido",
        nome: c.nome,
        pregador: c.pregador || undefined,
        preencher: camposDoDia(dia),
      };
    }),
  );

  const prompt = montarPrompt(mes, ano, cultos, await carregarHistorico(ano, mesIndex));
  if (debug) return NextResponse.json({ prompt });

  const atribuicoes = sanitizar(await chamarGemini(prompt), cultos, semanas);
  return NextResponse.json({ atribuicoes });
});