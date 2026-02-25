"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Cake, Church, HandHelping } from "lucide-react";
import type { CalendarEvent, EventCategory } from "@/lib/ics-parser";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  selectedEvent: CalendarEvent | null;
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}


function sortEventsByPriority(events: CalendarEvent[]): CalendarEvent[] {
  const priorityOrder: Partial<Record<EventCategory, number>> = {
    "Aniversário": 1,
    "SEDE": 2,
    "Culto de Missão": 3,
    "Culto da Família": 3,
    "Culto de Santa Ceia": 3,
    "Culto de Louvor e Adoração": 3,
    "Culto de Mulheres": 3,
    "Culto de Doutrina": 3,
    "Círculo de Oração": 4,
    "Consagração": 4,
    "Culto de Jovens": 4,
    "Culto de Crianças": 4,
    "Reunião de Liderança": 5,
  };

  return [...events].sort((a, b) => {
    const priorityA = priorityOrder[a.category] ?? 999;
    const priorityB = priorityOrder[b.category] ?? 999;
    return priorityA - priorityB;
  });
}


function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = event.allDay
      ? parseLocalDate(event.start)
      : new Date(event.start);

    const eventEnd = event.allDay
      ? parseLocalDate(event.end)
      : new Date(event.end);

    if (event.allDay) {
      const adjustedEnd = new Date(eventEnd);
      adjustedEnd.setDate(adjustedEnd.getDate() - 1);
      return (
        (day >= eventStart && day <= adjustedEnd) ||
        isSameDay(day, eventStart)
      );
    }

    return isSameDay(eventStart, day);
  });
}

function getCategoryStyle(title: EventCategory): string {
  switch (title) {
    case "Aniversário":
      return "bg-orange-100 text-orange-800 border-orange-200";
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
      return "bg-muted text-muted-foreground border-border";
  }
}

function getCategoryDot(title: EventCategory): string {
  switch (title) {
    case "Aniversário":
      return "bg-orange-500";
    case "SEDE":
      return "bg-blue-900";
    case "Culto de Mulheres":
      return "bg-pink-600";
    case "Culto de Doutrina":
      return "bg-purple-600";
    case "Culto de Missão":
      return "bg-green-600";
    case "Culto da Família":
      return "bg-red-600";
    case "Culto de Santa Ceia":
      return "bg-red-100";
    case "Culto de Louvor e Adoração":
      return "bg-indigo-600";
    case "Círculo de Oração":
      return "bg-yellow-600";
    case "Consagração":
      return "bg-emerald-600";
    case "Culto de Jovens":
      return "bg-cyan-600";
    case "Culto de Crianças":
      return "bg-lime-75";
    case "Reunião de Liderança":
      return "bg-violet-75";
    default:
      return "bg-muted-foreground";
  }
}

export function CalendarGrid({
  currentDate,
  events,
  selectedDate,
  selectedEvent,
  onSelectDate,
  onSelectEvent,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/60">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className={cn(
              "px-1 py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-2 sm:py-3 sm:text-sm",
              day === "Dom" && "text-primary font-bold",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = sortEventsByPriority(getEventsForDay(events, day));
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDayToday = isToday(day);
          const isSunday = day.getDay() === 0;
          const hasBirthday = dayEvents.some(
            (e) => e.title === "Aniversário",
          );

          return (
            <button
              type="button"
              key={day.toISOString()}
              onClick={() => {
                onSelectDate(day);
                if (dayEvents.length > 0) {
                  onSelectEvent(dayEvents[0]);
                }
              }}
              className={cn(
                "relative flex min-h-[72px] flex-col border-b border-r border-border p-1 text-left transition-colors sm:min-h-[100px] sm:p-2",
                !isCurrentMonth && "bg-muted/30 opacity-50",
                isSelected && "bg-primary/5 ring-2 ring-inset ring-primary/40",
                !isSelected && isCurrentMonth && "hover:bg-muted/60",
                (index + 1) % 7 === 0 && "border-r-0",
                hasBirthday && isCurrentMonth && "bg-pink-50/50",
              )}
              aria-label={`${format(day, "d 'de' MMMM", { locale: ptBR })}${dayEvents.length > 0 ? `, ${dayEvents.length} evento(s)` : ""}`}
            >
              {/* Day number */}
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-7 sm:w-7 sm:text-sm",
                    !isCurrentMonth && "text-muted-foreground/50",
                    isCurrentMonth && "text-foreground",
                    isSunday && isCurrentMonth && "font-bold text-primary",
                    isDayToday &&
                      "bg-primary font-bold text-primary-foreground shadow-sm",
                    isSelected &&
                      !isDayToday &&
                      "bg-primary/10 font-semibold text-primary",
                  )}
                >
                  {format(day, "d")}
                </span>
                {hasBirthday && isCurrentMonth && (
                  <Cake className="h-3.5 w-3.5 text-pink-500" />
                )}
              </div>

              {dayEvents.length > 0 && (
                <div className="mt-0.5 flex max-h-20 flex-col gap-0.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent sm:mt-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate(day);
                        onSelectEvent(event);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                          onSelectDate(day);
                          onSelectEvent(event);
                        }
                      }}
                      className={cn(
                        "flex w-full items-center gap-1 truncate rounded-md border px-1 py-0.5 text-left text-[10px] font-semibold leading-tight transition-all sm:text-xs ",
                        getCategoryStyle(event.category),
                        selectedEvent?.id === event.id &&
                          "ring-2 ring-foreground/20 shadow-sm",
                      )}
                    >
                      {event.title === "Aniversário" && (
                        <Cake className="hidden h-2.5 w-2.5 shrink-0 sm:inline-block" />
                      )}
                      {event.title === "Consagração" && (
                        <HandHelping className="hidden h-2.5 w-2.5 shrink-0 sm:inline-block" />
                      )}
                      {event.title === "SEDE" && (
                        <Church className="hidden h-2.5 w-2.5 shrink-0 sm:inline-block" />
                      )}
                      <span className="truncate">
                        <span className="hidden sm:inline">{event.title}</span>
                        <span className="sm:hidden">
                          {event.title.length > 10
                            ? `${event.title.slice(0, 10)}..`
                            : event.title}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {dayEvents.length > 0 && (
                <div className="mt-auto flex gap-0.5 pt-0.5 sm:hidden">
                  {dayEvents.slice(0, 4).map((event) => (
                    <span
                      key={`dot-${event.id}`}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        getCategoryDot(event.category),
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
