"use client";

import { useEffect, useRef } from "react";
import { addMinutes, format, isAfter, isBefore, isToday, parseISO } from "date-fns";
import { useCalendarEvents } from "@/hooks/use-calendar-events";
import { useNotifications } from "@/hooks/useNotifications";


/** Avisa 1h antes dos eventos de hoje (uma vez por evento). */
export function useCalendarNotifications() {
  const today = new Date();
  const { events } = useCalendarEvents(today.getFullYear(), today.getMonth() + 1);
  const { permission, requestPermission, sendNotification } = useNotifications();
  const notified = useRef(new Set<string>());

  useEffect(() => {
    if (permission !== "granted") return;

    const check = () => {
      const now = new Date();
      for (const event of events) {
        if (event.allDay || notified.current.has(event.id)) continue;

        const start = parseISO(event.start);
        if (!isToday(start) || !isAfter(now, addMinutes(start, -60)) || !isBefore(now, start)) continue;

        notified.current.add(event.id);
        sendNotification(`📅 Hoje: ${event.title}`, {
          body: `Começa às ${format(start, "HH:mm")}${event.location ? ` em ${event.location}` : ""}`,
          tag: `event-${event.id}`,
          data: { eventId: event.id, url: `/agenda?event=${event.id}` },
        });
      }
    };

    check();
    const timer = setInterval(check, 60 * 1000);
    return () => clearInterval(timer);
  }, [events, permission, sendNotification]);

  return { events, requestPermission, hasPermission: permission === "granted" };
}