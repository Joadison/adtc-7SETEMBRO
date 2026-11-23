"use client";

import useSWR from "swr";
import type { CalendarEvent } from "@/lib/ics-parser";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro ${res.status}`); // senão erro da API vira "sem eventos"
  return res.json();
};

export function useCalendarEvents(year?: number, month?: number) {
  const params = new URLSearchParams();
  if (year) params.set("year", String(year));
  if (month) params.set("month", String(month));
  const query = params.toString();

  const { data, error, isLoading } = useSWR<{ events: CalendarEvent[] }>(
    `/api/calendar${query ? `?${query}` : ""}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 2 * 60 * 1000, // 2 min
      keepPreviousData: true, // não pisca o skeleton ao trocar de mês
    },
  );

  return { events: data?.events ?? [], isLoading, error };
}