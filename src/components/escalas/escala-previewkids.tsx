"use client";

import { forwardRef } from "react";
import type { EscalaData } from "@/lib/escala-types";
import { DIA, diaDaSemana, sortCultos } from "@/lib/escala-utils";
import { Divisor, Linha, PreviewFrame, TituloCulto } from "./preview-parts";

export const EscalaPreviewKids = forwardRef<HTMLDivElement, { data: EscalaData }>(function EscalaPreviewKids(
  { data },
  ref,
) {
  return (
    <PreviewFrame ref={ref} titulo={`Escala – ${data.mes.join(" / ")}`}>
      <div style={{ display: "grid", justifyContent: "left", gap: "12px 24px", padding: "0 12px" }}>
        {data.semanas
          .flatMap((week) => sortCultos(week.cultos))
          .map((culto) => {
            const dia = diaDaSemana(culto.dataISO);
            if (dia !== DIA.DOMINGO && dia !== DIA.QUINTA) return null;

            return (
              <div key={culto.id} style={{ paddingBottom: 4 }}>
                <TituloCulto culto={culto} />
                {dia === DIA.DOMINGO ? (
                  <>
                    <Linha>{`Professoras dos Maiores: ${culto.professoraUp}`}</Linha>
                    <Linha>{`Professoras dos Menores: ${culto.professoraDow}`}</Linha>
                  </>
                ) : (
                  <Linha>{`Professora: ${[culto.professoraUp, culto.professoraDow].filter(Boolean).join(" / ")}`}</Linha>
                )}
              </div>
            );
          })}
      </div>

      <Divisor margem="14px 0 0 0" />
    </PreviewFrame>
  );
});