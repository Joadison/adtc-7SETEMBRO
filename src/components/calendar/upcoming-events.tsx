"use client";

import { CalendarDays, Church, Clock, DoorOpen, HandHelping, Mic2 } from "lucide-react";
import { format, isBefore, isToday, isTomorrow, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { getStart } from "@/lib/calendar-dates";
import { getCategory } from "@/lib/category-config";
import { isCultoCategory } from "@/lib/escala-types";
import type { CalendarEvent } from "@/lib/ics-parser";
import { cn } from "@/lib/utils";

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  selectedEvent: CalendarEvent | null;
}

function relativeDate(date: Date) {
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanha";
  return format(date, "EEEE, d MMM", { locale: ptBR });
}

export function UpcomingEvents({ events, onSelectEvent, selectedEvent }: UpcomingEventsProps) {
  const today = startOfDay(new Date());
  const upcoming = events.filter((e) => !isBefore(startOfDay(getStart(e)), today)).slice(0, 6);

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">Nenhum evento proximo</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Proximos Eventos
      </h2>

      {upcoming.map((event) => {
        const { soft, border, label, icon } = getCategory(event.category);
        const Icon = icon ?? (isCultoCategory(event.category) ? Church : null);
        const start = getStart(event);

        const people = [
          { Icon: DoorOpen, value: event.porteiro1, color: "text-primary" },
          { Icon: DoorOpen, value: event.porteiro2, color: "text-primary" },
          { Icon: HandHelping, value: event.recepcao, color: "text-amber-700" },
          { Icon: Mic2, value: event.pregador, color: "text-emerald-700" },
        ].filter((p) => p.value);

        return (
          <button
            type="button"
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className={cn(
              "flex flex-col gap-1.5 rounded-xl border border-l-4 border-border bg-card p-3 text-left transition-all hover:shadow-md",
              border,
              selectedEvent?.id === event.id && "bg-primary/5 shadow-md",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" />}
                <span className="text-sm font-semibold text-foreground">{event.title}</span>
              </div>
              <Badge className={cn("max-w-35 shrink-0 truncate border text-[10px]", soft)}>
                {isToday(start) ? "Hoje" : label}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className={cn("flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize", soft)}>
                <CalendarDays className="h-3 w-3" />
                {relativeDate(start)}
              </span>
              {!event.allDay && (
                <span className={cn("flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium", soft)}>
                  <Clock className="h-3 w-3" />
                  {format(start, "HH:mm")}
                </span>
              )}
            </div>

            {people.length > 0 && (
              <div className="mt-0.5 flex flex-wrap gap-1.5">
                {people.map(({ Icon: PersonIcon, value, color }, i) => (
                  <span key={i} className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium", color)}>
                    <PersonIcon className="h-2.5 w-2.5" />
                    {value}
                  </span>
                ))}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}