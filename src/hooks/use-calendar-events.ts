"use client";

import useSWR from "swr";
import type { CalendarEvent } from "@/lib/ics-parser";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCalendarEvents(year?: number, month?: number) {
  let url = "/api/calendar";
  const params = new URLSearchParams();

  if (year) params.append("year", year.toString());
  if (month) params.append("month", month.toString());
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const { data, error, isLoading } = useSWR<{ events: CalendarEvent[] }>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 2 * 60 * 1000, // Refresh every 10 min
    }
  );

  return {
    events: data?.events || [],
    isLoading,
    error,
  };
}
