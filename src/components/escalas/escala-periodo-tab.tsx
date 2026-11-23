"use client";

import type { RefObject } from "react";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ConfigEscala } from "@/lib/escalas-periodo";
import { useEscalaPeriodo } from "@/lib/use-escala-periodo";
import { useExportar } from "@/lib/use-exportar";
import { BarraAcoes } from "../acoes";
import { Campo, PapelInput } from "../campos";
import { PreviewPeriodo } from "./preview-periodo";

const NOME_DIA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const NOME_PERIODO = { mes: "Mês", bimestre: "Bimestre", trimestre: "Trimestre" };

interface Props {
  config: ConfigEscala;
  /** aba visível — a escala só carrega do Calendar na primeira vez que é aberta */
  ativo: boolean;
  previewRef: RefObject<HTMLDivElement | null>;
}

/** Aba completa de uma escala por período: formulário + pré-visualização própria + sync/exportar. */
export function EscalaPeriodoTab({ config, ativo, previewRef }: Props) {
  const e = useEscalaPeriodo(config, ativo);
  const { exportando, exportar } = useExportar(previewRef, e.arquivo);
  const anoAtual = new Date().getFullYear();

  return (
    <div className="flex flex-col gap-4">
      <BarraAcoes
        onSync={e.sincronizar}
        sincronizando={e.sincronizando}
        syncDesabilitado={e.carregando || !e.temAlteracao}
        onExport={exportar}
        exportando={exportando}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ---------- formulário ---------- */}
        <div className="flex w-full shrink-0 flex-col gap-6 lg:w-105 xl:w-115">
          <section className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Período</h3>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Ano">
                <Select value={String(e.ano)} onValueChange={(v) => e.setAno(Number(v))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[anoAtual - 1, anoAtual, anoAtual + 1].map((a) => (
                      <SelectItem key={a} value={String(a)}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Campo>

              <Campo label={NOME_PERIODO[config.periodo]}>
                <Select value={e.periodo} onValueChange={e.setPeriodo}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {e.opcoes.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Campo>
            </div>
          </section>

          {e.erro && <p className="text-xs text-destructive">{e.erro}</p>}

          {e.carregando ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando do Calendário...
            </p>
          ) : e.slots.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              Nenhum culto de domingo ou quinta neste período. Crie os cultos na aba Escala e sincronize com o
              Calendário.
            </p>
          ) : (
            <section className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {config.titulo} ({e.slots.length})
              </h3>

              {e.slots.map((slot) => (
                <div key={slot.id} className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {slot.nome} – {slot.data} · {NOME_DIA[slot.dia]}
                    </span>
                    <span className="text-[10px] font-medium">
                      {!slot.eventId && <span className="text-amber-700">novo · será criado no Calendário</span>}
                      {slot.eventId && e.alterado(slot) && <span className="text-blue-700">● alterado</span>}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {config.papeis(slot.dia).map((p) => (
                      <PapelInput
                        key={p.campo}
                        label={p.label}
                        value={slot.campos[p.campo]}
                        opcoes={p.opcoes}
                        onChange={(v) => e.setCampo(slot.id, p.campo, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* ---------- pré-visualização (só desta escala) ---------- */}
        <div className="w-full lg:flex-1">
          <div className="sticky top-6 rounded-xl border bg-card p-2">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pré-visualização
            </h3>
            <div className="flex justify-center overflow-x-auto">
              <div className="inline-block min-w-full rounded-lg border shadow-sm">
                <PreviewPeriodo ref={previewRef} config={config} slots={e.slots} titulo={e.titulo} subtitulo={e.subtitulo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}