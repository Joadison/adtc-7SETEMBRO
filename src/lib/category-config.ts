import { Cake, Church, HandHelping, MapPin, type LucideIcon } from "lucide-react";
import type { EventCategory } from "./ics-parser";

/** solid = chip/cabeçalho/bolinha · soft = badge claro · border = borda lateral do card */
interface Palette {
  solid: string;
  soft: string;
  border: string;
}

const P = {
  orange: { solid: "bg-orange-500 text-white border-orange-600", soft: "bg-orange-100 text-orange-800 border-orange-200", border: "border-l-orange-500" },
  slate: { solid: "bg-slate-900 text-white border-slate-800", soft: "bg-slate-200 text-slate-900 border-slate-300", border: "border-l-slate-900" },
  green: { solid: "bg-green-600 text-white border-green-700", soft: "bg-green-100 text-green-800 border-green-200", border: "border-l-green-600" },
  rose: { solid: "bg-rose-600 text-white border-rose-700", soft: "bg-rose-100 text-rose-800 border-rose-200", border: "border-l-rose-600" },
  red: { solid: "bg-red-700 text-white border-red-800", soft: "bg-red-100 text-red-800 border-red-200", border: "border-l-red-700" },
  indigo: { solid: "bg-indigo-600 text-white border-indigo-700", soft: "bg-indigo-100 text-indigo-800 border-indigo-200", border: "border-l-indigo-600" },
  pink: { solid: "bg-pink-600 text-white border-pink-700", soft: "bg-pink-100 text-pink-800 border-pink-200", border: "border-l-pink-600" },
  purple: { solid: "bg-purple-600 text-white border-purple-700", soft: "bg-purple-100 text-purple-800 border-purple-200", border: "border-l-purple-600" },
  amber: { solid: "bg-amber-500 text-black border-amber-600", soft: "bg-amber-100 text-amber-800 border-amber-200", border: "border-l-amber-500" },
  emerald: { solid: "bg-emerald-600 text-white border-emerald-700", soft: "bg-emerald-100 text-emerald-800 border-emerald-200", border: "border-l-emerald-600" },
  cyan: { solid: "bg-cyan-600 text-white border-cyan-700", soft: "bg-cyan-100 text-cyan-800 border-cyan-200", border: "border-l-cyan-600" },
  lime: { solid: "bg-lime-400 text-lime-950 border-lime-500", soft: "bg-lime-100 text-lime-900 border-lime-200", border: "border-l-lime-400" },
  violet: { solid: "bg-violet-700 text-white border-violet-800", soft: "bg-violet-100 text-violet-900 border-violet-200", border: "border-l-violet-700" },
  zinc: { solid: "bg-zinc-600 text-white border-zinc-700", soft: "bg-zinc-100 text-zinc-800 border-zinc-200", border: "border-l-zinc-500" },
} satisfies Record<string, Palette>;

export interface CategoryConfig extends Palette {
  label: string;
  /** menor = aparece primeiro no dia */
  priority: number;
  icon?: LucideIcon;
}

export const CATEGORY_CONFIG: Record<EventCategory, CategoryConfig> = {
  "Aniversário": { label: "Aniversário", priority: 1, icon: Cake, ...P.orange },
  "SEDE": { label: "Culto na Sede", priority: 2, icon: Church, ...P.slate },
  "Culto de Missão": { label: "Culto de Missão", priority: 3, ...P.green },
  "Culto da Família": { label: "Culto da Família", priority: 3, ...P.rose },
  "Culto de Santa Ceia": { label: "Culto de Santa Ceia", priority: 3, ...P.red },
  "Culto de Louvor e Adoração": { label: "Culto de Louvor e Adoração", priority: 3, ...P.indigo },
  "Culto Natalício": { label: "Culto Natalício", priority: 3, ...P.indigo },
  "Festa": { label: "Festa", priority: 3, ...P.indigo },
  "Culto de Mulheres": { label: "Culto de Mulheres", priority: 3, ...P.pink },
  "Culto de Doutrina": { label: "Culto de Doutrina", priority: 3, ...P.purple },
  "Círculo de Oração": { label: "Círculo de Oração", priority: 4, ...P.amber },
  "Consagração": { label: "Consagração", priority: 4, icon: HandHelping, ...P.emerald },
  "Culto de Jovens": { label: "Culto de Jovens", priority: 4, ...P.cyan },
  "Culto de Crianças": { label: "Culto de Crianças", priority: 4, ...P.lime },
  "Reunião de Liderança": { label: "Reunião de Liderança", priority: 5, ...P.violet },
  "EBD": { label: "Escola Bíblica", priority: 6, icon: MapPin, ...P.zinc },
  "Bazar": { label: "Bazar", priority: 6, ...P.zinc },
  "Culto Campal": { label: "Culto Campal", priority: 6, ...P.zinc },
};

const FALLBACK: CategoryConfig = { label: "Evento", priority: 999, ...P.zinc };

export const getCategory = (category: EventCategory): CategoryConfig => CATEGORY_CONFIG[category] ?? FALLBACK;