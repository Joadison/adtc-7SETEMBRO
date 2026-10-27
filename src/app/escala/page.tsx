"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Calendar, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EscalaForm } from "@/components/escalas/escala-form";
import { EscalaPreview } from "@/components/escalas/escala-preview";
import { createDefaultEscala, MESES } from "@/lib/escala-types";
import type { EscalaData } from "@/lib/escala-types";

import { CalendarEvent } from "@/lib/ics-parser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EscalaPreviewKids } from "@/components/escalas/escala-previewkids";
import { syncCalendar, type SyncResult } from "@/lib/sync-calendar";

export default function EscalaPage() {
  const [data, setData] = useState<EscalaData>(createDefaultEscala);
  const [isExporting, setIsExporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const previewRef = useRef<HTMLDivElement>(null);

  // ---------- busca eventos do calendário ----------
  useEffect(() => {
    async function fetchCalendar() {
      if (!data.mes || data.mes.length === 0) return;
      try {
        setIsSyncing(true);
        const anoAtual = new Date().getFullYear();
        let allEvents: CalendarEvent[] = [];
        for (const mes of data.mes) {
          const mesIndex = MESES.indexOf(mes.toUpperCase());
          const mesNumero = mesIndex + 1;
          if (mesNumero < 1 || mesNumero > 12) continue;
          const res = await fetch(
            `/api/calendar?year=${anoAtual}&month=${mesNumero}`,
          );
          const json = await res.json();
          allEvents = [...allEvents, ...(json.events || [])];
        }
        setCalendarEvents(allEvents);
      } catch (err) {
        console.error("Erro ao buscar calendario", err);
        setCalendarEvents([]);
      } finally {
        setIsSyncing(false);
      }
    }
    fetchCalendar();
  }, [data.mes]);

  // ---------- Sincronização (create + update + delete) ----------
  const handleSyncToCalendar = async () => {
    if (!data.mes?.[0]) {
      alert("Selecione um mês antes de sincronizar.");
      return;
    }

    setIsSyncing(true);
    try {
      // 1) garante que temos os eventos mais recentes
      const ano = new Date().getFullYear();
      const mesIndex = MESES.indexOf(data.mes[0].toUpperCase()) + 1;
      let events = calendarEvents;

      if (!events.length) {
        const res = await fetch(`/api/calendar?year=${ano}&month=${mesIndex}`);
        const json = await res.json();
        events = json.events || [];
        setCalendarEvents(events);
      }

      // 2) calcula diff e aplica no Google Calendar
      const result: SyncResult = await syncCalendar(data, events, {
        // SEGURANÇA: só mexe em eventos que contenham "culto" no título
        scopeFilter: (e) => (e.title || "").toLowerCase().includes("culto"),
      });

      // 3) feedback
      const partes: string[] = [];
      if (result.created.length) partes.push(`${result.created.length} criado(s)`);
      if (result.updated.length) partes.push(`${result.updated.length} atualizado(s)`);
      if (result.deleted.length) partes.push(`${result.deleted.length} removido(s)`);

      if (result.errors.length) {
        console.warn("Erros parciais:", result.errors);
        alert(
          `Sincronização parcial:\n${partes.join(", ") || "nada"}\n\n` +
          `Erros: ${result.errors.length}\n` +
          result.errors.map((e) => `- ${e.op} (${e.target}): ${e.error}`).join("\n"),
        );
      } else {
        alert(`Calendário sincronizado: ${partes.join(", ") || "nada a fazer"}.`);
      }

      // 4) recarrega eventos para refletir o estado real
      const res = await fetch(`/api/calendar?year=${ano}&month=${mesIndex}`);
      const json = await res.json();
      setCalendarEvents(json.events || []);
    } catch (e: any) {
      console.error(e);
      alert("Erro ao sincronizar: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // ---------- Export imagem ----------
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
      link.download = `Escala-${data.mes.join("-")}.png`;
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
          <Link href="/editor">
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
            disabled={isSyncing || !data.mes?.[0]}
            variant="outline"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                Sincronizar com Calendário
              </>
            )}
          </Button>

          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4" />
            {isExporting ? "Exportando..." : "Baixar imagem"}
          </Button>
        </div>
      </header>

      <Tabs defaultValue="escala" className="min-w-0 flex-1">
        <TabsList>
          <TabsTrigger value="escala">Escala</TabsTrigger>
          <TabsTrigger value="escalakid">Escala Kids</TabsTrigger>
        </TabsList>

        <TabsContent value="escala">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="w-full shrink-0 lg:w-[420px] xl:w-[460px]">
              <EscalaForm data={data} onChange={setData} calendarEvents={calendarEvents} />
            </div>
            <div className="w-full lg:flex-1">
              <div className="rounded-xl border bg-card p-2 sticky top-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pré-visualização
                </h3>
                <div className="flex justify-center overflow-x-auto">
                  <div className="inline-block min-w-full rounded-lg border shadow-sm">
                    <EscalaPreview ref={previewRef} data={data} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="escalakid">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="w-full shrink-0 lg:w-[420px] xl:w-[460px]">
              <EscalaForm data={data} onChange={setData} calendarEvents={calendarEvents} />
            </div>
            <div className="rounded-xl border bg-card p-2">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pre-visualizacao
              </h3>
              <div className="flex justify-center overflow-x-auto">
                <div className="inline-block min-w-full rounded-lg border shadow-sm">
                  <EscalaPreviewKids ref={previewRef} data={data} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}