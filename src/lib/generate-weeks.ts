import { createEmptyCulto, CultoEntry, MESES, TIPOS_CULTO, WeekEntry } from './escala-types';
import { CalendarEvent, EventCategory, extractField } from './ics-parser';

export function generateWeeksFromMonth(
  mes: string,
  ano: number,
  eventos: CalendarEvent[]
): WeekEntry[] {

  const mesIndex = MESES.indexOf(mes);
  if (mesIndex === -1) return [];

  const primeiroDia = new Date(ano, mesIndex, 1);
  const ultimoDia = new Date(ano, mesIndex + 1, 0);

  const semanas: WeekEntry[] = [];
  let atual = new Date(primeiroDia);

  const diaDaSemana = atual.getDay();

  if (diaDaSemana === 0) { 
    atual.setDate(atual.getDate() - 6);
  } else if (diaDaSemana > 1) {
    atual.setDate(atual.getDate() - (diaDaSemana - 1));
  }

  const formatar = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;

  while (atual <= ultimoDia) {
    const inicio = new Date(atual);
    inicio.setHours(0, 0, 0, 0);

    const fimSemana = new Date(inicio);
    fimSemana.setDate(fimSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999);

    if (fimSemana > ultimoDia) {
      fimSemana.setTime(ultimoDia.getTime());
    } 

    const eventosDaSemana = eventos.filter((event) => {
      if (!isCultoEvent(event.category)) return false;

      const dataEvento = new Date(event.start);
      dataEvento.setHours(0, 0, 0, 0);

      return dataEvento >= inicio && dataEvento <= fimSemana;
    });

    if (eventosDaSemana.length === 0) {
      atual.setDate(atual.getDate() + 7);
      continue;
    }

    const cultos = eventosDaSemana
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .map(convertEventToCulto);

    const conjuntoDaSemana = cultos[0].conjunto || "Conjunto de Jovens";

    const cultosComConjunto = cultos.map((c) => ({
      ...c,
      conjunto: c.conjunto || conjuntoDaSemana,
    }));

    /* const cultos: CultoEntry[] =
      eventosDaSemana.length > 0
        ? eventosDaSemana
            .sort(
              (a, b) =>
                new Date(a.start).getTime() -
                new Date(b.start).getTime()
            )
            .map(convertEventToCulto)
        : [createEmptyCulto()]; */

    semanas.push({
      id: crypto.randomUUID(),
      inicio: formatar(inicio),
      fim: formatar(fimSemana),
      conjunto: "",
      cultos: cultosComConjunto,
    });

    atual.setDate(atual.getDate() + 7);
  }

  return semanas;
}

function isCultoEvent(category: EventCategory): boolean {
  const cultosValidos: EventCategory[] = TIPOS_CULTO
  return cultosValidos.includes(category);
}

function convertEventToCulto(event: CalendarEvent): CultoEntry {
  const data = new Date(event.start);
  const dataFormatada = `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`;

  return {
    id: event.id,
    nome: event.title,
    data: dataFormatada,
    dataISO: event.start,
    pregador: extractField(event.description || "", "pregador") || "",
    conjunto: extractField(event.description || "", "conjunto") || "",
    porteiro1: extractField(event.description || "", "porteiro 1") || extractField(event.description || "", "porteiro") || "",
    porteiro2: extractField(event.description || "", "porteiro 2") || "",
    recepcao: extractField(event.description || "", "recepção") || "",
    professora: extractField(event.description || "", "professora") || "",
    professoraUp: extractField(event.description || "", "professoraMaiores") || "",
    professoraDow: extractField(event.description || "", "professoraMenores") || "",
    acomodadores: extractField(event.acomodadores || "", "acomodadores") || "",
    observacoes: event.description,
    calendarioId: event.id,
    categoriaOriginal: event.category,
    local: event.location
  };
}