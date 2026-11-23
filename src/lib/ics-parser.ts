import type { calendar_v3 } from "googleapis";
import { parseDescription, type EscalaFields } from "./calendar-description";

export type EventCategory =
  | "SEDE"
  | "Aniversário"
  | "Culto Natalício"
  | "Culto Campal"
  | "Culto de Doutrina"
  | "Culto de Missão"
  | "Culto da Família"
  | "Culto de Santa Ceia"
  | "Culto de Louvor e Adoração"
  | "EBD"
  | "Círculo de Oração"
  | "Consagração"
  | "Culto de Jovens"
  | "Culto de Crianças"
  | "Culto de Mulheres"
  | "Bazar"
  | "Festa"
  | "Reunião de Liderança";

export interface CalendarEvent extends EscalaFields {
  id: string;
  recurringEventId?: string;
  title: string;
  /** Só as anotações livres (os campos da escala já vêm separados acima). */
  description: string;
  start: string;
  end: string;
  location: string;
  allDay: boolean;
  category: EventCategory;
}

// ---------- categorização (ordem importa: a 1ª regra que casar vence) ----------

interface Rule {
  category: EventCategory;
  keywords: string[]; // sem acento e minúsculas
  inAnyField?: boolean; // true = procura também na descrição e no local
}

const RULES: Rule[] = [
  { category: "Aniversário", keywords: ["aniversario", "niver"] },
  { category: "SEDE", keywords: ["sede"], inAnyField: true },
  { category: "Festa", keywords: ["festa"], inAnyField: true },
  { category: "Culto Natalício", keywords: ["natalicio"] },
  { category: "Culto de Doutrina", keywords: ["doutrina"] },
  { category: "Bazar", keywords: ["bazar"] },
  { category: "Culto de Missão", keywords: ["missao"] },
  { category: "Culto da Família", keywords: ["familia", "gv de casais", "gv dos casais"] },
  { category: "Culto de Santa Ceia", keywords: ["santa ceia"] },
  { category: "Culto de Mulheres", keywords: ["mulheres"] },
  { category: "Culto de Louvor e Adoração", keywords: ["louvor", "adoracao"] },
  { category: "EBD", keywords: ["ebd", "escola biblica"] },
  { category: "Círculo de Oração", keywords: ["circulo"] },
  { category: "Consagração", keywords: ["consagracao"] },
  { category: "Culto de Jovens", keywords: ["jovens"] },
  { category: "Culto de Crianças", keywords: ["criancas"] },
  { category: "Reunião de Liderança", keywords: ["lideranca"] },
];

const simplify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function categorizeEvent(title: string, notes: string, location: string): EventCategory {
  const t = simplify(title);
  const all = `${t} ${simplify(notes)} ${simplify(location)}`;
  const rule = RULES.find(({ keywords, inAnyField }) =>
    keywords.some((k) => (inAnyField ? all : t).includes(k)),
  );
  return rule?.category ?? "SEDE";
}

// ---------- Google Calendar → CalendarEvent ----------

export function parseGoogleEvents(items: calendar_v3.Schema$Event[]): CalendarEvent[] {
  return items.map((item) => {
    const title = item.summary || "Sem titulo";
    const location = item.location || "";
    const { fields, notes } = parseDescription(item.description);

    return {
      ...fields,
      id: item.id ?? "",
      recurringEventId: item.recurringEventId ?? undefined,
      title,
      description: notes,
      start: item.start?.dateTime || item.start?.date || "",
      end: item.end?.dateTime || item.end?.date || "",
      location,
      allDay: !!item.start?.date,
      category: categorizeEvent(title, notes, location),
    };
  });
}