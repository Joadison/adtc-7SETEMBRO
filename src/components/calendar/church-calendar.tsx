"use client";

import { useState, useCallback } from "react";
import { addMonths, subMonths, startOfMonth, isSameDay } from "date-fns";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarGrid, parseLocalDate } from "@/components/calendar/calendar-grid";
import { EventDetailPanel } from "@/components/calendar/event-detail-panel";
import { UpcomingEvents } from "@/components/calendar/upcoming-events";
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";
import { AlertCircle } from "lucide-react";
import type { CalendarEvent } from "@/lib/ics-parser";

export function ChurchCalendar() {
  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { events, isLoading, error } = useCalendarEvents(year, month);

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(startOfMonth(today));
    setSelectedDate(today);

    // Find today's first event
    const todaysEvent = events.find((e) => isSameDay(new Date(e.start), today));
    if (todaysEvent) {
      setSelectedEvent(todaysEvent);
    }
  }, [events]);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);

    const eventDate = event.allDay
      ? parseLocalDate(event.start)
      : new Date(event.start);

    setSelectedDate(eventDate);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">
            Erro ao carregar calendario
          </h2>
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
        {/* Main calendar grid */}
        <div className="min-w-0 flex-1">
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            onSelectDate={handleSelectDate}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        {/* Sidebar */}
        <div className="w-full shrink-0 lg:w-80 xl:w-96">
          <div className="flex flex-col gap-4 lg:sticky lg:top-6">
            {selectedEvent ? (
              <EventDetailPanel
                event={selectedEvent}
                onClose={handleCloseDetail}
              />
            ) : (
              <UpcomingEvents
                events={events}
                onSelectEvent={handleSelectEvent}
                selectedEvent={selectedEvent}
              />
            )}

            {/* Legend */}
            <div className="rounded-xl border border-border bg-card p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Legenda
              </h3>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-blue-900" />
                  <span className="text-xs text-foreground">
                    Sede
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-green-800" />
                  <span className="h-3 w-3 rounded bg-red-800" />
                  <span className="h-3 w-3 rounded bg-red-900" />
                  <span className="h-3 w-3 rounded bg-indigo-900" />
                  <span className="text-xs text-foreground">
                    Cultos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-purple-800" />
                  <span className="text-xs text-foreground">
                    Culto de Doutrina
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-yellow-400" />
                  <span className="text-xs text-foreground">
                    Circulo de Oração
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-emerald-400" />
                  <span className="text-xs text-foreground">
                    Consagração
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-orange-500" />
                  <span className="text-xs text-foreground">
                    Aniversario
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
