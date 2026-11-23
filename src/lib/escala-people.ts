// Fonte única das listas (antes duplicadas no formulário e na rota da IA).
// Obs.: juntei as duas versões antigas — confira se todos os nomes ainda fazem parte da escala.

export const PESSOAS = {
  porteiros: [
    "Pb. Gleidystone", "Dc. Cleiton", "Aux. Wagner", "Aux. Viana", "Aux. Joadison",
    "Aux. Davi", "Aux. Paulo", "Aux. Antonilson", "Aux. Vitor",
  ],
  recepcao: [
    "Ir. Natalia", "Ir. Victoria", "Ir. Daniele", "Ir. Rebeca", "Ir. Iris",
    "Ir. Ruthe", "Ir. Eloisa", "Ir. Ester",
  ],
  professoras: [
    "Ir. Monica", "Ir. Victoria", "Ir. Daniele", "Ir. Rebeca", "Ir. Val",
    "Ir. Cleuma", "Ir. Marilia", "Ir. Ruthe", "Ir. Raryane",
  ],
  // Preencha para o formulário virar lista de seleção; vazio = campo de texto livre.
  midia: [] as string[],
  ebd: [] as string[],
} as const;

export const CONJUNTOS = [
  "Conjunto de Jovens",
  "Conjunto de Senhoras",
  "Conjunto de Crianças",
  "Conjunto de Homens",
] as const;

/** Classes do formulário (Tailwind) para o cabeçalho da semana. */
export const CORES_CONJUNTO: Record<string, string> = {
  "Conjunto de Jovens": "bg-blue-100 border-blue-300",
  "Conjunto de Senhoras": "bg-pink-100 border-pink-300",
  "Conjunto de Crianças": "bg-yellow-100 border-yellow-300",
  "Conjunto de Homens": "bg-purple-100 border-purple-300",
};

// ---- o que a IA pode escolher sozinha (estes só entram manualmente) ----
const SOMENTE_MANUAL = new Set<string>(["Pb. Gleidystone", "Ir. Ester"]);
const automatico = (lista: readonly string[]) => lista.filter((n) => !SOMENTE_MANUAL.has(n));

export const PESSOAS_IA = {
  porteiros: automatico(PESSOAS.porteiros),
  recepcao: automatico(PESSOAS.recepcao),
  professoras: automatico(PESSOAS.professoras),
};
export const CONJUNTOS_IA: readonly string[] = CONJUNTOS.slice(0, 2);
