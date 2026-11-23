"use client";

import {
  ArrowDown,
  ArrowUp,
  Cake,
  CalendarDays,
  Clock,
  DoorOpen,
  HandHelping,
  MapPin,
  Mic2,
  MicVocal,
  X,
  BookOpen,
  Camera,
  Monitor,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getEnd, getStart } from "@/lib/calendar-dates";
import { getCategory } from "@/lib/category-config";
import { isCultoCategory } from "@/lib/escala-types";
import type { CalendarEvent } from "@/lib/ics-parser";
import { cn } from "@/lib/utils";

interface Role {
  icon: LucideIcon;
  label: string;
  name?: string;
  color: string;
}

function RoleCard({ icon: Icon, label, name, color }: Role & { name: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
      </div>
    </div>
  );
}

function Section({ title, generic, roles }: { title: string; generic: boolean; roles: Role[] }) {
  const filled = roles.filter((r) => r.name);
  return (
    <>
      <Separator className="my-4" />
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {generic ? (
        <p className="text-sm text-foreground">Consulte a escala completa no grupo de WhatsApp.</p>
      ) : filled.length > 0 ? (
        <div className="flex flex-col gap-2">
          {filled.map((r) => (
            <RoleCard key={r.label} {...r} name={r.name!} />
          ))}
        </div>
      ) : (
        <p className="text-xs italic text-muted-foreground">Nenhuma escala definida na descricao.</p>
      )}
    </>
  );
}

export function EventDetailPanel({ event, onClose }: { event: CalendarEvent | null; onClose: () => void }) {
  if (!event) return null;

  const { solid, label, icon } = getCategory(event.category);
  const CategoryIcon = icon ?? CalendarDays;
  const startDate = getStart(event);
  const endDate = getEnd(event);
  const sameDay = isSameDay(startDate, endDate);

  const isCulto = isCultoCategory(event.category);
  const isGeneric = event.title.trim().toLowerCase() === "culto";

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className={cn("flex items-start justify-between gap-2 p-4", solid)}>
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <CategoryIcon className="h-4 w-4 text-white/80" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">{label}</span>
          </div>
          <h2 className="text-balance font-serif text-lg font-bold">{event.title}</h2>
          <p className="mt-1.5 text-sm capitalize opacity-80">
            {format(startDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <Button
          size="icon"
          onClick={onClose}
          className="shrink-0 text-white hover:bg-white/10 hover:text-white"
          aria-label="Fechar detalhes"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {event.allDay ? (
            <Badge variant="secondary" className="w-fit">
              Dia inteiro
            </Badge>
          ) : (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                {format(startDate, "HH:mm")} - {format(endDate, sameDay ? "HH:mm" : "HH:mm '('d MMM')'", { locale: ptBR })}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {isCulto && (
          <>
            <Section
              title="Escala de Pregação"
              generic={isGeneric}
              roles={[{ icon: Mic2, label: "Pregador(a)", name: event.pregador, color: "bg-emerald-100 text-emerald-700" }]}
            />
            <Section
              title="Escala do Dia"
              generic={isGeneric}
              roles={[
                { icon: MicVocal, label: "Conjunto", name: event.conjunto, color: "bg-violet-100 text-violet-700" },
                { icon: DoorOpen, label: "Porteiro Externo", name: event.porteiro1, color: "bg-primary/10 text-primary" },
                { icon: DoorOpen, label: "Porteiro Interno", name: event.porteiro2, color: "bg-primary/10 text-primary" },
                { icon: HandHelping, label: "Recepção", name: event.recepcao, color: "bg-amber-100 text-amber-700" },
              ]}
            />
            <Section
              title="Escala Infantil do Dia"
              generic={isGeneric}
              roles={[
                { icon: ArrowDown, label: "Professora", name: event.professora, color: "bg-blue-100 text-blue-700" },
                { icon: ArrowDown, label: "Professora Menores", name: event.professoraDow, color: "bg-blue-100 text-blue-700" },
                { icon: ArrowUp, label: "Professora Maiores", name: event.professoraUp, color: "bg-blue-100 text-blue-700" },
              ]}
            />
            <Section
              title="Escala de Mídia"
              generic={isGeneric}
              roles={[
                { icon: Camera, label: "Fotos", name: event.fotos, color: "bg-rose-100 text-rose-700" },
                { icon: Monitor, label: "Computador", name: event.computador, color: "bg-slate-200 text-slate-700" },
                { icon: Volume2, label: "Som", name: event.som, color: "bg-sky-100 text-sky-700" },
              ]}
            />
          </>
        )}

        {event.category === "EBD" && (
          <Section
            title="Escala da EBD"
            generic={false}
            roles={[
              { icon: BookOpen, label: "Professor(a) 1", name: event.ebd1, color: "bg-sky-100 text-sky-700" },
              { icon: BookOpen, label: "Professor(a) 2", name: event.ebd2, color: "bg-sky-100 text-sky-700" },
            ]}
          />
        )}

        {event.category === "Aniversário" && (
          <>
            <Separator className="my-4" />
            <div className="rounded-lg bg-orange-50 p-4 text-center">
              <Cake className="mx-auto h-8 w-8 text-orange-600" />
              <p className="mt-2 font-serif text-sm font-bold text-orange-800">Feliz Aniversario!</p>
              <p className="mt-0.5 text-xs text-orange-600">Que Deus abencoe mais este ano de vida.</p>
            </div>
          </>
        )}

        {/* já vem sem os campos da escala; renderizado como texto (sem dangerouslySetInnerHTML) */}
        {event.description && (
          <>
            <Separator className="my-4" />
            <p className="whitespace-pre-line text-sm text-foreground">{event.description}</p>
          </>
        )}
      </div>
    </div>
  );
}
