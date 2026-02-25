"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EscalaForm } from "@/components/escalas/escala-form";
import { EscalaPreview } from "@/components/escalas/escala-preview";
import { createDefaultEscala, MESES } from "@/lib/escala-types";
import type { EscalaData } from "@/lib/escala-types";

import { updateCalendarWithEscalaData } from "@/lib/update-calendar";
import { CalendarEvent } from "@/lib/ics-parser";

export default function EscalaPage() {
  const [data, setData] = useState<EscalaData>(createDefaultEscala);
  const [isExporting, setIsExporting] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCalendar() {
      if (!data.mes) return;
      try {
        setIsSyncing(true);
        const anoAtual = new Date().getFullYear();
        const mesIndex = MESES.indexOf(data.mes.toUpperCase());
        const mesNumero = mesIndex + 1;
        
        if (mesNumero < 1 || mesNumero > 12) {
          console.warn("Mês inválido:", data.mes);
          return;
        }

        const res = await fetch(`/api/calendar/?year=${anoAtual}&month=${mesNumero}`);
        const json = await res.json();
        setCalendarEvents(json.events || []);
      } catch (err) {
        console.error("Erro ao buscar calendario", err);
        setCalendarEvents([]); 
      } finally {
        setIsSyncing(false);
      }
    }
    if (data.mes) {
      fetchCalendar();
    }
  }, [data.mes]);

  const handleSyncToCalendar = async () => {
    setIsSyncing(true);
    try {
      await updateCalendarWithEscalaData({
        escalaData: data,
        calendarEvents: calendarEvents,
        onSuccess: () => {
          alert("Calendário atualizado com sucesso!");
        },
        onError: (error) => {
          alert("Erro ao atualizar calendário: " + error.message);
        }
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 200));
    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = previewRef.current;
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `Escala-${data.mes}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  }, [data.mes]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button size="icon" aria-label="Voltar ao calendario">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Gerar Escala
            </h1>
            <p className="text-sm text-muted-foreground">
              Monte a escala semanal e exporte como imagem
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSyncToCalendar} 
            disabled={isSyncing}
            variant="outline"
          >
            <Calendar className="h-4 w-4" />
            {isSyncing ? "Sincronizando..." : "Sincronizar com Calendário"}
          </Button>

          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4" />
            {isExporting ? "Exportando..." : "Baixar imagem"}
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div
          className="w-full shrink-0 lg:w-[420px] xl:w-[460px]"
        >
          <EscalaForm data={data} onChange={setData} calendarEvents={calendarEvents}/>
        </div>

        <div
          className="min-w-0 flex-1"
        >
          <div className="rounded-xl border bg-card p-2">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pre-visualizacao
            </h3>
            <div className="flex justify-center overflow-x-auto">
              <div className="inline-block min-w-full rounded-lg border shadow-sm">
                <EscalaPreview ref={previewRef} data={data}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
