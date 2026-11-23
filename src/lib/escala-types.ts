import { emptyFields, type EscalaFields } from "./calendar-description";
import type { EventCategory } from "./ics-parser";

export const TIPOS_CULTO = [
  "Culto de Doutrina",
  "Culto de Missão",
  "Culto da Família",
  "Culto de Santa Ceia",
  "Culto de Louvor e Adoração",
  "Culto de Mulheres",
  "Culto de Crianças",
  "Culto de Jovens",
  "Culto Natalício",
  "Festa",
] as const satisfies readonly EventCategory[];

export type TipoCulto = (typeof TIPOS_CULTO)[number];

export const isCultoCategory = (category: EventCategory): category is TipoCulto =>
  (TIPOS_CULTO as readonly string[]).includes(category);

/** Os campos da escala (pregador, porteiros...) vêm de EscalaFields. */
export interface CultoEntry extends EscalaFields {
  id: string;
  nome: string;
  data: string;
  dataISO?: string;
  observacoes?: string;
  calendarioId?: string;
  categoriaOriginal?: EventCategory;
  local?: string;
}

export interface WeekEntry {
  id: string;
  inicio: string;
  fim: string;
  conjunto: string;
  cultos: CultoEntry[];
}

export interface EscalaData {
  mes: string[];
  versiculoTopo: string;
  referenciaTopo: string;
  versiculoRodape: string;
  referenciaRodape: string;
  semanas: WeekEntry[];
}

export const MESES = [
  "JANEIRO", "FEVEREIRO", "MARCO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
];

export const createEmptyCulto = (): CultoEntry => ({
  id: crypto.randomUUID(),
  nome: "",
  data: "",
  ...emptyFields(),
});

export const createEmptyWeek = (): WeekEntry => ({
  id: crypto.randomUUID(),
  inicio: "",
  fim: "",
  conjunto: "",
  cultos: [],
});

export const createDefaultEscala = (): EscalaData => ({
  mes: [],
  versiculoTopo: '"Nao se esquecam da hospitalidade; foi praticando-a que, sem o saber, alguns acolheram anjos."',
  referenciaTopo: "Hebreus 13:2",
  versiculoRodape: '"Tudo quanto fizerdes, fazei-o de todo o coracao, como para o Senhor e nao para homens."',
  referenciaRodape: "Colossenses 3:23",
  semanas: [],
});