import { pickFields } from "./calendar-description";
import { isCultoCategory, MESES, type CultoEntry, type WeekEntry } from "./escala-types";
import type { CalendarEvent } from "./ics-parser";

const CONJUNTO_PADRAO = "Conjunto de Jovens";

const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

function toCulto(event: CalendarEvent, conjuntoPadrao: string): CultoEntry {
  const fields = pickFields(event);
  return {
    ...fields,
    conjunto: fields.conjunto || conjuntoPadrao,
    id: event.id,
    nome: event.title,
    data: fmt(new Date(event.start)),
    dataISO: event.start,
    observacoes: event.description,
    calendarioId: event.id,
    categoriaOriginal: event.category,
    local: event.location,
  };
}

/** Agrupa os cultos do mês em semanas (segunda a domingo). Semanas sem culto são ignoradas. */
export function generateWeeksFromMonth(mes: string, ano: number, eventos: CalendarEvent[]): WeekEntry[] {
  const mesIndex = MESES.indexOf(mes);
  if (mesIndex === -1) return [];

  const ultimoDia = new Date(ano, mesIndex + 1, 0, 23, 59, 59, 999);
  const cultos = eventos
    .filter((e) => isCultoCategory(e.category))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // segunda-feira da semana que contém o dia 1
  const inicio = new Date(ano, mesIndex, 1);
  inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7));

  const semanas: WeekEntry[] = [];

  for (; inicio <= ultimoDia; inicio.setDate(inicio.getDate() + 7)) {
    const domingo = new Date(inicio);
    domingo.setDate(domingo.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);
    const fim = domingo > ultimoDia ? ultimoDia : domingo;

    const daSemana = cultos.filter((e) => {
      const t = new Date(e.start);
      return t >= inicio && t <= fim;
    });
    if (daSemana.length === 0) continue;

    const conjuntoDaSemana = daSemana[0].conjunto || CONJUNTO_PADRAO;

    semanas.push({
      id: crypto.randomUUID(),
      inicio: fmt(inicio),
      fim: fmt(fim),
      conjunto: "",
      cultos: daSemana.map((e) => toCulto(e, conjuntoDaSemana)),
    });
  }

  return semanas;
}