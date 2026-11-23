"use client";

import { useState, type RefObject } from "react";
import { fetchEventsOfMonths, fetchMonthEvents } from "@/lib/calendar-client";
import { createDefaultEscala, type EscalaData } from "@/lib/escala-types";
import { generateWeeksFromMonth } from "@/lib/generate-weeks";
import { syncCalendar, type SyncResult } from "@/lib/sync-calendar";
import { BarraAcoes } from "./acoes";
import { useExportar } from "@/lib/use-exportar";
import { EscalaForm } from "./escalas/escala-form";
import { EscalaPreview } from "./escalas/escala-preview";

function resumoSync(r: SyncResult) {
  const partes =
    [
      [r.created.length, "criado(s)"],
      [r.updated.length, "atualizado(s)"],
      [r.deleted.length, "removido(s)"],
    ]
      .filter(([n]) => n)
      .map(([n, texto]) => `${n} ${texto}`)
      .join(", ") || "nada a fazer";

  if (!r.errors.length) return `Calendário sincronizado: ${partes}.`;
  return (
    `Sincronização parcial: ${partes}\n\nErros: ${r.errors.length}\n` +
    r.errors.map((e) => `- ${e.op} (${e.target}): ${e.error}`).join("\n")
  );
}

/** Escala principal (cultos). Mesma lógica de antes — só mudou de lugar para dentro da aba. */
export function TabCultos({ previewRef }: { previewRef: RefObject<HTMLDivElement | null> }) {
  const [data, setData] = useState<EscalaData>(createDefaultEscala);
  const [isSyncing, setIsSyncing] = useState(false);
  const { exportando, exportar } = useExportar(previewRef, `Escala-${data.mes.join("-")}.png`);

  // Ao trocar o mês: busca os eventos e monta as semanas a partir deles.
  const handleMonthChange = async (mes: string) => {
    const events = await fetchMonthEvents(mes);
    setData((d) => ({ ...d, mes: [mes], semanas: generateWeeksFromMonth(mes, new Date().getFullYear(), events) }));
  };

  // Sync (create + update + delete) sempre contra os eventos mais recentes.
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const events = await fetchEventsOfMonths(data.mes);
      const result = await syncCalendar(data, events, {
        // SEGURANÇA: só mexe em eventos que contenham "culto" no título
        scopeFilter: (e) => e.title.toLowerCase().includes("culto"),
      });
      alert(resumoSync(result));
    } catch (e: any) {
      console.error(e);
      alert("Erro ao sincronizar: " + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <BarraAcoes
        onSync={handleSync}
        sincronizando={isSyncing}
        syncDesabilitado={!data.mes?.[0]}
        onExport={exportar}
        exportando={exportando}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full shrink-0 lg:w-105 xl:w-115">
          <EscalaForm data={data} onChange={setData} onMonthChange={handleMonthChange} />
        </div>

        <div className="w-full lg:flex-1">
          <div className="sticky top-6 rounded-xl border bg-card p-2">
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
    </div>
  );
}
