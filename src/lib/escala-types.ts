import { EventCategory } from "./ics-parser";

export type TipoCulto = 
  | "Culto de Doutrina"
  | "Culto de Missão"
  | "Culto da Família"
  | "Culto de Santa Ceia"
  | "Culto de Louvor e Adoração"
  | "Culto de Mulheres"
  | "Culto de Crianças"
  | "Culto de Jovens";

export interface CultoEntry {
  id: string;
  nome: TipoCulto | string;
  data: string;
  dataISO?: string;
  pregador: string;
  porteiro: string;
  recepcao: string;
  observacoes?: string;
  calendarioId?: string;
  categoriaOriginal?: EventCategory;
  local?: string;
}

export interface WeekEntry {
  id: string;
  inicio: string;
  fim: string;
  conjunto: "Conjunto de Jovens" | "Conjunto de Senhoras";
  cultos: CultoEntry[];
}

export interface EscalaData {
  mes: string;
  versiculoTopo: string;
  referenciaTopo: string;
  versiculoRodape: string;
  referenciaRodape: string;
  semanas: WeekEntry[];
}

export const MESES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARCO",
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

export const TIPOS_CULTO: TipoCulto[] = [
  "Culto de Doutrina",
  "Culto de Missão",
  "Culto da Família", 
  "Culto de Santa Ceia",
  "Culto de Louvor e Adoração",
  "Culto de Mulheres",
  "Culto de Crianças",
  "Culto de Jovens"
];

export function createEmptyCulto(): CultoEntry {
  return {
    id: crypto.randomUUID(),
    nome: "",
    data: "",
    pregador: "",
    porteiro: "",
    recepcao: "",
  };
}

export function createEmptyWeek(): WeekEntry {
  return {
    id: crypto.randomUUID(),
    inicio: "",
    fim: "",
    conjunto: "Conjunto de Jovens",
    cultos: [],
    //cultos: [createEmptyCulto(), createEmptyCulto()],
  };
} 

export function createDefaultEscala(): EscalaData {
  return {
    mes: "",
    versiculoTopo:
      '"Nao se esquecam da hospitalidade; foi praticando-a que, sem o saber, alguns acolheram anjos."',
    referenciaTopo: "Hebreus 13:2",
    versiculoRodape:
      '"Tudo quanto fizerdes, fazei-o de todo o coracao, como para o Senhor e nao para homens."',
    referenciaRodape: "Colossenses 3:23",
    semanas: [],
  };
}
 
