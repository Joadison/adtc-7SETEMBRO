
export type EventCategory =
  | "SEDE"
  | "Aniversário"
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
  | "Reunião de Liderança";

export interface CalendarEvent {
  id: string;
  recurringEventId: string;
  title: string;
  description: string;
  start: string;
  end: string;
  location: string;
  allDay: boolean;
  porteiro?: string;
  recepcao?: string;
  pregador?: string;
  category: EventCategory;
}

export function extractField(description: string, field: string): string | undefined {
  if (!description) return undefined;

  const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = new RegExp(
    `${escapedField}\\s*[:\\-]\\s*([^\\n]+)`,
    "i"
  );

  const match = description.match(pattern);

  if (match && match[1]) {
    return match[1].trim();
  }

  return undefined;
}

function categorizeEvent(
  title: string,
  description: string,
  location: string,
): EventCategory {
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  const l = location.toLowerCase();

  // 🎂 Aniversário
  if (
    t.includes("aniversario") ||
    t.includes("aniversário") ||
    t.includes("niver")
  ) {
    return "Aniversário";
  }

  // 🏛 SEDE
  if (t.includes("sede") || d.includes("sede") || l.includes("sede")) {
    return "SEDE";
  }

  // ⛪ Cultos específicos
  if (t.includes("doutrina")) return "Culto de Doutrina";
  if (t.includes("missão") || t.includes("missao")) return "Culto de Missão";
  if (t.includes("família") || t.includes("familia")) return "Culto da Família";
  if (t.includes("santa ceia")) return "Culto de Santa Ceia";
  if (t.includes("mulheres")) return "Culto de Mulheres";
  if (t.includes("louvor") || t.includes("adoração") || t.includes("adoracao"))
    return "Culto de Louvor e Adoração";
  if (t.includes("ebd") || t.includes("escola bíblica") || t.includes("escola biblica"))
    return "EBD";
  if (t.includes("círculo") || t.includes("circulo"))
    return "Círculo de Oração";
  if (t.includes("consagração") || t.includes("consagracao"))
    return "Consagração";
  if (t.includes("jovens")) return "Culto de Jovens";
  if (t.includes("crianças") || t.includes("criancas"))
    return "Culto de Crianças";
  if (t.includes("liderança") || t.includes("lideranca"))
    return "Reunião de Liderança";

  // ⛪ fallback genérico
  if (t.includes("culto de doutrina")) {
    return "Culto de Doutrina"; // ou escolha um padrão
  }

  // fallback obrigatório
  return "SEDE";
}

export function parseGoogleEvents(data: any[]): CalendarEvent[] {
  return data.map((event) => {
    const description = event.description || "";
    const title = event.summary || "Sem titulo";
    const location = event.location || "";
    const isAllDay = !!event.start?.date; 

    return {
      id: event.id,
      title,
      description,
      start: event.start?.dateTime || event.start?.date || "",
      end: event.end?.dateTime || event.end?.date || "",
      location,
      porteiro: extractField(description, "Porteiro"),
      recepcao: extractField(description, "Recepção"),
      pregador: extractField(description, "Pregador"),
      allDay: isAllDay,
      category: categorizeEvent(title, description, location),
      recurringEventId: event.recurringEventId,
    };
  });
}