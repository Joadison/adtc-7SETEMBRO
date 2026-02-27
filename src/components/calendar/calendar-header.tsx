"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  const monthYear = format(currentDate, "MMMM yyyy", { locale: ptBR });

  return (
    <header className="flex flex-col gap-4 pb-6 sm:flex-row items-center justify-center">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          Hoje
        </Button>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            onClick={onPreviousMonth}
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[160px] text-center font-serif text-lg font-bold capitalize text-foreground">
            {monthYear}
          </span>
          <Button
            size="icon"
            onClick={onNextMonth}
            aria-label="Proximo mes"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
