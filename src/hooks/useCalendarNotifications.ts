"use client";

import { useEffect, useState, useCallback } from "react";
import { format, isToday, parseISO, isAfter, isBefore, addMinutes } from "date-fns";
import { useNotifications } from "./useNotifications";

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
}

export function useCalendarNotifications() {
  const [events, setEvents] = useState<Event[]>([]);
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set());
  const { permission, requestPermission, sendNotification } = useNotifications();

  const fetchEvents = useCallback(async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      
      const response = await fetch(`/api/calendar?year=${year}&month=${month}`);
      const data = await response.json();
      
      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  }, []);

  const checkAndNotify = useCallback(() => {
    if (permission !== 'granted') return;

    const now = new Date();
    
    events.forEach(event => {
      const eventDate = parseISO(event.start);
      const eventId = event.id;
      
      if (notifiedEvents.has(eventId)) return;
      
      if (isToday(eventDate)) {
        const oneHourBefore = addMinutes(eventDate, -60);
        
        if (isAfter(now, oneHourBefore) && isBefore(now, eventDate)) {
          sendNotification(`📅 Hoje: ${event.title}`, {
            body: `Começa às ${format(eventDate, "HH:mm")}${event.location ? ` em ${event.location}` : ''}`,
            tag: `event-${eventId}`,
            data: { eventId, url: `/agenda?event=${eventId}` }
          });
          setNotifiedEvents(prev => new Set([...prev, eventId]));
        }
      }
      
      // 2. Evento amanhã (notificar uma vez)
      /* if (isTomorrow(eventDate)) {
        sendNotification(`📅 Amanhã: ${event.title}`, {
          body: `Às ${format(eventDate, "HH:mm")}${event.location ? ` em ${event.location}` : ''}`,
          tag: `event-${eventId}`,
          data: { eventId, url: `/agenda?event=${eventId}` }
        });
        setNotifiedEvents(prev => new Set([...prev, eventId]));
      } */
      
      // 3. Evento em 3 dias
      /* const daysDiff = differenceInDays(eventDate, now);
      if (daysDiff === 3) {
        sendNotification(`📅 Em 3 dias: ${event.title}`, {
          body: `${format(eventDate, "EEEE, dd/MM")} às ${format(eventDate, "HH:mm")}`,
          tag: `event-${eventId}`,
          data: { eventId, url: `/agenda?event=${eventId}` }
        });
        setNotifiedEvents(prev => new Set([...prev, eventId]));
      } */
    });
  }, [events, permission, notifiedEvents, sendNotification]);

  // Buscar eventos periodicamente
  useEffect(() => {
    fetchEvents();
    // Buscar a cada 30 minutos
    const interval = setInterval(fetchEvents, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  useEffect(() => {
    checkAndNotify();    
    const interval = setInterval(checkAndNotify, 60 * 1000); // 1 minuto
    return () => clearInterval(interval);
  }, [checkAndNotify]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = new Date();
      setNotifiedEvents(prev => {
        const newSet = new Set(prev);
        events.forEach(event => {
          const eventDate = parseISO(event.start);
          if (isBefore(eventDate, now)) {
            newSet.delete(event.id);
          }
        });
        return newSet;
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(cleanup);
  }, [events]);

  return {
    events,
    requestPermission,
    hasPermission: permission === 'granted'
  };
}