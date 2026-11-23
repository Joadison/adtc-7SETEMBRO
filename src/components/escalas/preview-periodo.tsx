"use client";

import { forwardRef } from "react";
import { calendarDate } from "@/lib/escala-utils";
import { linhasDoSlot, type ConfigEscala, type Slot } from "@/lib/escalas-periodo";
import { MESES_LABEL } from "@/lib/periodos";
import { COR, Linha, PreviewFrame } from "./preview-parts";

interface Props {
  config: ConfigEscala;
  slots: Slot[];
  titulo: string;
  subtitulo?: string;
}

/** Uma folha só com o período inteiro, agrupado por mês (Kids, EBD e Mídia usam o mesmo). */
export const PreviewPeriodo = forwardRef<HTMLDivElement, Props>(function PreviewPeriodo(
  { config, slots, titulo, subtitulo },
  ref,
) {
  const porMes = new Map<number, Slot[]>();
  for (const slot of slots) {
    const mes = calendarDate(slot.dataISO)?.getMonth();
    if (mes !== undefined) porMes.set(mes, [...(porMes.get(mes) ?? []), slot]);
  }

  return (
    <PreviewFrame ref={ref} titulo={titulo} subtitulo={subtitulo}>
      {slots.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", fontSize: 14 }}>Nenhum item neste período.</p>
      )}

      {[...porMes].map(([mes, lista]) => (
        <div key={mes} style={{ marginBottom: 16 }}>
          <div style={{ backgroundColor: COR.laranja, borderRadius: 8, padding: "8px 18px", marginBottom: 12 }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{MESES_LABEL[mes]}</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${config.colunasPreview}, 1fr)`,
              gap: "12px 24px",
              padding: "0 12px",
            }}
          >
            {lista.map((slot) => (
              <div key={slot.id} style={{ paddingBottom: 4 }}>
                <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 2px 0", lineHeight: 1.3 }}>
                  {`${slot.nome} – ${slot.data}`}
                </p>
                {linhasDoSlot(config, slot).map(([label, valor]) => (
                  <Linha key={label}>{`${label}: ${valor}`}</Linha>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </PreviewFrame>
  );
});