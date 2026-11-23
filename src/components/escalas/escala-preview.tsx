"use client";

import { forwardRef } from "react";
import type { EscalaData } from "@/lib/escala-types";
import { sortCultos } from "@/lib/escala-utils";
import { COR, Divisor, Linha, PreviewFrame, TituloCulto, Versiculo } from "./preview-parts";

export const EscalaPreview = forwardRef<HTMLDivElement, { data: EscalaData }>(function EscalaPreview({ data }, ref) {
  return (
    <PreviewFrame ref={ref} titulo={`Escala – ${data.mes.join(" / ")}`}>
      <Versiculo texto={data.versiculoTopo} referencia={data.referenciaTopo} tamanho={13} margemBaixo={10} />
      <Divisor />

      {data.semanas.map((week) => {
        const conjunto = week.cultos[0]?.conjunto || week.conjunto;

        return (
          <div key={week.id} style={{ marginBottom: 20 }}>
            <div
              style={{
                backgroundColor: conjunto === "Conjunto de Jovens" ? COR.laranja : COR.rosa,
                borderRadius: 8,
                padding: "10px 18px",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
                {`Semana ${week.inicio} a ${week.fim} - `}
              </span>
              <span style={{ color: "#fff", fontSize: 14 }}>{conjunto}</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: week.cultos.length === 1 ? "1fr" : "1fr 1fr",
                gap: "12px 24px",
                padding: "0 12px",
              }}
            >
              {sortCultos(week.cultos).map((culto) => (
                <div key={culto.id} style={{ paddingBottom: 4 }}>
                  <TituloCulto culto={culto} />
                  {[
                    { label: "Porteiro Externo", valor: culto.porteiro1, sempre: true },
                    { label: "Porteiro Interno", valor: culto.porteiro2 },
                    { label: "Recepção", valor: culto.recepcao, sempre: true },
                    { label: "Acomodadores", valor: culto.acomodadores },
                  ]
                    .filter((l) => l.sempre || l.valor)
                    .map((l) => (
                      <Linha key={l.label}>{`${l.label}: ${l.valor}`}</Linha>
                    ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <Divisor cor="#e5e5e5" altura={2} margem="16px 0" />
      <Versiculo texto={data.versiculoRodape} referencia={data.referenciaRodape} tamanho={12} />
    </PreviewFrame>
  );
});