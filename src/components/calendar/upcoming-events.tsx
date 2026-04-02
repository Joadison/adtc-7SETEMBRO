"use client";

import {
  DoorOpen,
  HandHelping,
  Mic2,
  CalendarDays,
  Clock,
  Cake,
  Church,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isTomorrow, isPast, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarEvent, EventCategory } from "@/lib/ics-parser";
import { cn } from "@/lib/utils";
import { parseLocalDate } from "./calendar-grid";

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  selectedEvent: CalendarEvent | null;
}

function formatRelativeDate(dateInput: string | Date): string {
  const date =
    typeof dateInput === "string"
      ? parseLocalDate(dateInput)
      : dateInput;
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanha";
  return format(date, "EEEE, d MMM", { locale: ptBR });
}

function getCategoryBorderColor(title: EventCategory): string {
  switch (title) {
    case "Aniversário":
      return "border-orange-200";
    case "SEDE":
      return "border-blue-800";
    case "Culto de Missão":
      return "border-green-200";
    case "Culto da Família":
      return "border-red-200";
    case "Culto de Santa Ceia":
      return "border-red-200";
    case "Culto de Louvor e Adoração":
      return "border-indigo-200";
    case "Culto de Mulheres":
      return "border-pink-200";
    case "Culto de Doutrina":
      return "border-purple-200";
    case "Círculo de Oração":
      return "border-yellow-200";
    case "Consagração":
      return "border-emerald-200";
    case "Culto de Jovens":
      return "border-cyan-200";
    case "Culto de Crianças":
      return "border-lime-25";
    case "Reunião de Liderança":
      return "border-violet-25";
    default:
      return "border-l-muted-foreground";
  }
}

function getCategoryBadgeStyle(title: EventCategory): string {
  switch (title) {
    case "Aniversário":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "SEDE":
      return "bg-blue-900 text-blue-50 border-blue-800";
    case "Culto de Missão":
      return "bg-green-100 text-green-800 border-green-200";
    case "Culto da Família":
      return "bg-red-100 text-red-800 border-red-200";
    case "Culto de Santa Ceia":
      return "bg-red-100 text-red-800 border-red-200";
    case "Culto de Louvor e Adoração":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "Culto de Mulheres":
      return "bg-pink-100 text-pink-800 border-pink-200";
    case "Culto de Doutrina":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Círculo de Oração":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Consagração":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Culto de Jovens":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "Culto de Crianças":
      return "bg-lime-400 text-lime-95 border-lime-25";
    case "Reunião de Liderança":
      return "bg-violet-15 text-violet-95 border-violet-25";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function UpcomingEvents({
  events,
  onSelectEvent,
  selectedEvent,
}: UpcomingEventsProps) {
  const upcoming = events
    .filter((e) => {
      const eventDate = e.allDay ? parseLocalDate(e.start) : new Date(e.start);
      return !isBefore(startOfDay(eventDate), startOfDay(new Date()));
    })
    .slice(0, 6);

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          Nenhum evento proximo
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Proximos Eventos
      </h2>
      <div className="flex flex-col gap-2">
        {upcoming.map((event) => {
          const startDate = event.allDay ? parseLocalDate(event.start) : new Date(event.start);
          const dayIsToday = isToday(startDate);

          const isBirthday =
            event.category === "Aniversário" ||
            event.title.toLowerCase().startsWith("aniversário") ||
            event.title.toLowerCase().startsWith("aniversario");

          const isCulto = event.category.toLowerCase().startsWith("culto");

          return (
            <button
              type="button"
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className={cn(
                "flex flex-col gap-1.5 rounded-xl border border-l-4 border-border bg-card p-3 text-left transition-all hover:shadow-md",
                getCategoryBorderColor(event.category),
                selectedEvent?.id === event.id &&
                  "border-primary/30 bg-primary/5 shadow-md",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isBirthday ? (
                    <Cake className="h-4 w-4 shrink-0  text-orange-600" />
                  ) : isCulto ? (
                    <Church className="h-4 w-4 shrink-0 text-primary" />
                  ) : null}
                  <span className="text-sm font-semibold text-foreground">
                    {event.title}
                  </span>
                </div>
                <Badge
                  className={cn(
                    "shrink-0 max-w-[140px] truncate text-[10px] border",
                    getCategoryBadgeStyle(event.category),
                  )}
                >
                  {dayIsToday
                    ? "Hoje"
                    : event.title}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className={cn(
                    "flex items-center gap-1 capitalize rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                    getCategoryBadgeStyle(event.category),
                  )}>
                  <CalendarDays className="h-3 w-3" />
                  {formatRelativeDate(startDate)}
                </span>
                {!event.allDay && (
                  <span className={cn(
                    "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                    getCategoryBadgeStyle(event.category),
                  )}>
                    <Clock className="h-3 w-3"/>
                    {format(startDate, "HH:mm")}
                  </span>
                )}
              </div>

              {(event.porteiro || event.recepcao || event.pregador) && (
                <div className="mt-0.5 flex flex-wrap gap-1.5">
                  {event.porteiro && (
                    <span className="inline-flex items-center gap-1 rounded-md  px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      <DoorOpen className="h-2.5 w-2.5" />
                      {event.porteiro}
                    </span>
                  )}
                  {event.recepcao && (
                    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                      <HandHelping className="h-2.5 w-2.5" />
                      {event.recepcao}
                    </span>
                  )}
                  {event.pregador && (
                    <span className="inline-flex items-center gap-1 rounded-md  px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                      <Mic2 className="h-2.5 w-2.5" />
                      {event.pregador}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
