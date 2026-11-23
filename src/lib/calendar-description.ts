/**
 * Único lugar que sabe ler/escrever o `description` do Google Calendar.
 *
 * Formato novo (JSON):
 *   { "pregador": "João", "conjunto": "Jovens", "porteiro1": "Ana", "notas": "texto livre" }
 *
 * Eventos antigos ("Pregador: João" por linha) continuam sendo lidos
 * e são convertidos para JSON na próxima vez que forem salvos.
 */

export const FIELD_KEYS = [
  "pregador",
  "conjunto",
  "porteiro1",
  "porteiro2",
  "recepcao",
  "acomodadores",
  "professora",
  "professoraUp",
  "professoraDow",
  // EBD (evento próprio, domingo 8h–10h)
  "ebd1",
  "ebd2",
  // Mídia (ficam no evento do culto)
  "fotos",
  "computador",
  "som",
] as const;

export type FieldKey = (typeof FIELD_KEYS)[number];
export type EscalaFields = Record<FieldKey, string>;

/** Campos que pertencem à escala principal (cultos). Os demais são de EBD / Mídia e nunca são sobrescritos por ela. */
export const CAMPOS_CULTO: readonly FieldKey[] = [
  "pregador",
  "conjunto",
  "porteiro1",
  "porteiro2",
  "recepcao",
  "acomodadores",
  "professora",
  "professoraUp",
  "professoraDow",
];

export interface ParsedDescription {
  fields: EscalaFields;
  notes: string;
}

/** Rótulos do formato antigo (sempre em minúsculo). */
const LEGACY_LABELS: Record<FieldKey, string[]> = {
  pregador: ["pregador"],
  conjunto: ["conjunto"],
  porteiro1: ["porteiro 1", "porteiro"],
  porteiro2: ["porteiro 2"],
  recepcao: ["recepção"],
  acomodadores: ["acomodadores"],
  professora: ["professora"],
  professoraUp: ["professoramaiores"],
  professoraDow: ["professoramenores"],
  ebd1: ["ebd1"],
  ebd2: ["ebd2"],
  fotos: ["fotos"],
  computador: ["computador"],
  som: ["som"],
};

export const emptyFields = (): EscalaFields =>
  Object.fromEntries(FIELD_KEYS.map((k) => [k, ""])) as EscalaFields;

/** Copia só os campos da escala de qualquer objeto (CultoEntry, CalendarEvent...). */
export const pickFields = (src: Partial<EscalaFields>): EscalaFields =>
  Object.fromEntries(FIELD_KEYS.map((k) => [k, src[k] ?? ""])) as EscalaFields;

// ---------- leitura ----------

/** O Google às vezes devolve o texto com <br>, &quot; etc. quando editado pela interface dele. */
function toPlainText(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

function tryParseJson(text: string): Record<string, unknown> | null {
  if (!text.startsWith("{")) return null;
  try {
    const value = JSON.parse(text.slice(0, text.lastIndexOf("}") + 1));
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

function parseLegacy(text: string): ParsedDescription {
  const fields = emptyFields();
  const keyByLabel = new Map<string, FieldKey>();
  for (const key of FIELD_KEYS) for (const label of LEGACY_LABELS[key]) keyByLabel.set(label, key);

  const notes: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([^:\-]+?)\s*[:\-]\s*(.+)$/);
    const key = match && keyByLabel.get(match[1].toLowerCase());
    if (match && key) fields[key] = match[2].trim();
    else if (line.trim()) notes.push(line.trim());
  }
  return { fields, notes: notes.join("\n") };
}

export function parseDescription(raw?: string | null): ParsedDescription {
  const text = toPlainText(raw || "");
  if (!text) return { fields: emptyFields(), notes: "" };

  const json = tryParseJson(text);
  if (!json) return parseLegacy(text);

  const fields = emptyFields();
  for (const key of FIELD_KEYS) {
    if (typeof json[key] === "string") fields[key] = (json[key] as string).trim();
  }
  return { fields, notes: typeof json.notas === "string" ? json.notas : "" };
}

// ---------- escrita ----------

/** Gera o JSON salvo no Calendar. Campos vazios (ou "LIVRE") não são gravados. */
export function serializeDescription(fields: Partial<EscalaFields>, notes = ""): string {
  const data: Record<string, string> = {};
  for (const key of FIELD_KEYS) {
    const value = fields[key]?.trim();
    if (value && value !== "LIVRE") data[key] = value;
  }
  if (notes.trim()) data.notas = notes.trim();
  return Object.keys(data).length ? JSON.stringify(data, null, 2) : "";
}

/**
 * Atualiza só os campos enviados, preservando o resto e as notas.
 *  - undefined / ""  → mantém como está
 *  - "LIVRE"         → remove o campo
 */
export function mergeDescription(raw: string | null | undefined, patch: Partial<EscalaFields>): string {
  const { fields, notes } = parseDescription(raw);
  for (const key of FIELD_KEYS) {
    const value = patch[key]?.trim();
    if (!value) continue;
    fields[key] = value === "LIVRE" ? "" : value;
  }
  return serializeDescription(fields, notes);
}

/** Qualquer texto (JSON ou formato antigo) → JSON canônico. Usado pelas rotas antes de gravar. */
export function normalizeDescription(raw?: string | null): string {
  const { fields, notes } = parseDescription(raw);
  return serializeDescription(fields, notes);
}
