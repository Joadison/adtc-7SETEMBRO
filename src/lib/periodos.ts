export type Periodo = "mes" | "bimestre" | "trimestre";

const TAMANHO: Record<Periodo, number> = { mes: 1, bimestre: 2, trimestre: 3 };
const NOME: Record<Periodo, string> = { mes: "", bimestre: "Bimestre", trimestre: "Trimestre" };

export const MESES_LABEL = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export interface OpcaoPeriodo {
  value: string;
  /** índices dos meses (0–11) */
  meses: number[];
  /** "1º Bimestre (Janeiro / Fevereiro)" */
  label: string;
  /** "1º Bimestre" */
  curto: string;
  /** "Janeiro / Fevereiro" */
  nomes: string;
}

/** Mês: 12 opções · Bimestre: 6 (Jan–Fev, Mar–Abr…) · Trimestre: 4 (Jan–Mar, Abr–Jun…). */
export function opcoesPeriodo(periodo: Periodo): OpcaoPeriodo[] {
  const n = TAMANHO[periodo];
  return Array.from({ length: 12 / n }, (_, i) => {
    const meses = Array.from({ length: n }, (_, j) => i * n + j);
    const nomes = meses.map((m) => MESES_LABEL[m]).join(" / ");
    const curto = periodo === "mes" ? nomes : `${i + 1}º ${NOME[periodo]}`;
    return { value: String(i), meses, nomes, curto, label: periodo === "mes" ? nomes : `${curto} (${nomes})` };
  });
}

export const periodoAtual = (periodo: Periodo, hoje = new Date()) =>
  String(Math.floor(hoje.getMonth() / TAMANHO[periodo]));
