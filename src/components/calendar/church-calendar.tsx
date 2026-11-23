"use client";

import { useCallback, useState } from "react";
import { addMonths, isSameDay, startOfMonth, subMonths } from "date-fns";
import { AlertCircle } from "lucide-react";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";
import { EventDetailPanel } from "@/components/calendar/event-detail-panel";
import { UpcomingEvents } from "@/components/calendar/upcoming-events";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { getStart } from "@/lib/calendar-dates";
import { getCategory } from "@/lib/category-config";
import type { CalendarEvent, EventCategory } from "@/lib/ics-parser";
import { cn } from "@/lib/utils";

const LEGEND: { label: string; categories: EventCategory[] }[] = [
  { label: "Sede", categories: ["SEDE"] },
  { label: "Cultos", categories: ["Culto de Missão", "Culto da Família", "Culto de Santa Ceia", "Culto de Louvor e Adoração"] },
  { label: "Culto de Doutrina", categories: ["Culto de Doutrina"] },
  { label: "Culto de Jovens", categories: ["Culto de Jovens"] },
  { label: "Culto de Mulheres", categories: ["Culto de Mulheres"] },
  { label: "Circulo de Oração", categories: ["Círculo de Oração"] },
  { label: "Consagração", categories: ["Consagração"] },
  { label: "Aniversario", categories: ["Aniversário"] },
];

export function ChurchCalendar() {
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const { events, isLoading, error } = useCalendarEvents(currentDate.getFullYear(), currentDate.getMonth() + 1);

  const handlePreviousMonth = useCallback(() => setCurrentDate((d) => subMonths(d, 1)), []);
  const handleNextMonth = useCallback(() => setCurrentDate((d) => addMonths(d, 1)), []);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(startOfMonth(today));
    setSelectedDate(today);
    const todaysEvent = events.find((e) => isSameDay(getStart(e), today));
    if (todaysEvent) setSelectedEvent(todaysEvent);
  }, [events]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(getStart(event));
  }, []);

  if (isLoading) return <CalendarSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">Erro ao carregar calendario</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nao foi possivel carregar os eventos. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            onSelectDate={setSelectedDate}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        <div className="w-full shrink-0 lg:w-80 xl:w-96">
          <div className="flex flex-col gap-4 lg:sticky lg:top-6">
            {selectedEvent ? (
              <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            ) : (
              <UpcomingEvents events={events} onSelectEvent={handleSelectEvent} selectedEvent={selectedEvent} />
            )}

            <div className="rounded-xl border border-border bg-card p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legenda</h3>
              <div className="flex flex-col gap-1.5">
                {LEGEND.map(({ label, categories }) => (
                  <div key={label} className="flex items-center gap-2">
                    {categories.map((c) => (
                      <span key={c} className={cn("h-3 w-3 rounded", getCategory(c).solid)} />
                    ))}
                    <span className="text-xs text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}