"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Cake } from "lucide-react";
import { getEnd, getStart } from "@/lib/calendar-dates";
import { getCategory } from "@/lib/category-config";
import type { CalendarEvent } from "@/lib/ics-parser";
import { cn } from "@/lib/utils";

// compatibilidade com imports antigos
export { parseLocalDate } from "@/lib/calendar-dates";

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  selectedEvent: CalendarEvent | null;
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

function eventsOnDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events
    .filter((e) => {
      const start = getStart(e);
      if (isSameDay(start, day)) return true;
      // evento de dia inteiro com várias datas (o fim é exclusivo)
      return e.allDay && day > start && day <= addDays(getEnd(e), -1);
    })
    .sort((a, b) => getCategory(a.category).priority - getCategory(b.category).priority);
}

export function CalendarGrid({
  currentDate,
  events,
  selectedDate,
  selectedEvent,
  onSelectDate,
  onSelectEvent,
}: CalendarGridProps) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { locale: ptBR }),
    end: endOfWeek(endOfMonth(currentDate), { locale: ptBR }),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-7 border-b border-border bg-muted/60">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className={cn(
              "px-1 py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-2 sm:py-3 sm:text-sm",
              day === "Dom" && "font-bold text-primary",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = eventsOnDay(events, day);
          const inMonth = isSameMonth(day, currentDate);
          const isSelected = !!selectedDate && isSameDay(day, selectedDate);
          const isDayToday = isToday(day);
          const hasBirthday = dayEvents.some((e) => e.category === "Aniversário");

          const select = (event: CalendarEvent) => {
            onSelectDate(day);
            onSelectEvent(event);
          };

          return (
            <button
              type="button"
              key={day.toISOString()}
              onClick={() => {
                onSelectDate(day);
                if (dayEvents[0]) onSelectEvent(dayEvents[0]);
              }}
              className={cn(
                "relative flex min-h-18 flex-col border-b border-r border-border p-1 text-left transition-colors sm:min-h-25 sm:p-2",
                !inMonth && "bg-muted/30 opacity-50",
                isSelected && "bg-primary/5 ring-2 ring-inset ring-primary/40",
                !isSelected && inMonth && "hover:bg-muted/60",
                (index + 1) % 7 === 0 && "border-r-0",
                hasBirthday && inMonth && "bg-pink-50/50",
              )}
              aria-label={`${format(day, "d 'de' MMMM", { locale: ptBR })}${dayEvents.length ? `, ${dayEvents.length} evento(s)` : ""}`}
            >
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-7 sm:w-7 sm:text-sm",
                    inMonth ? "text-foreground" : "text-muted-foreground/50",
                    day.getDay() === 0 && inMonth && "font-bold text-primary",
                    isDayToday && "bg-primary font-bold text-primary-foreground shadow-sm",
                    isSelected && !isDayToday && "bg-primary/10 font-semibold text-primary",
                  )}
                >
                  {format(day, "d")}
                </span>
                {hasBirthday && inMonth && <Cake className="h-3.5 w-3.5 text-pink-500" />}
              </div>

              {dayEvents.length > 0 && (
                <>
                  <div className="mt-0.5 flex max-h-20 flex-col gap-0.5 overflow-y-auto pr-1 sm:mt-1">
                    {dayEvents.map((event) => {
                      const { solid, icon: Icon } = getCategory(event.category);
                      return (
                        <div
                          key={event.id}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            select(event);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              select(event);
                            }
                          }}
                          className={cn(
                            "flex w-full min-w-0 items-center gap-1 rounded-md border px-1 py-0.5 text-[10px] font-semibold leading-tight sm:text-xs",
                            solid,
                            selectedEvent?.id === event.id && "shadow-sm ring-2 ring-foreground/20",
                          )}
                        >
                          {Icon && <Icon className="hidden h-2.5 w-2.5 shrink-0 sm:inline-block" />}
                          <span className="truncate">{event.title}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* mobile: só bolinhas */}
                  <div className="mt-auto flex gap-0.5 pt-0.5 sm:hidden">
                    {dayEvents.slice(0, 4).map((event) => (
                      <span
                        key={`dot-${event.id}`}
                        className={cn("h-1.5 w-1.5 rounded-full", getCategory(event.category).solid)}
                      />
                    ))}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}