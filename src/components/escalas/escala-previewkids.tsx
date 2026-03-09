"use client";

import { forwardRef } from "react";
import type { EscalaData } from "@/lib/escala-types";

interface EscalaPreviewProps {
  data: EscalaData;
}

export const EscalaPreviewKids = forwardRef<HTMLDivElement, EscalaPreviewProps>(
  function EscalaPreview({ data }, ref) {
    const isDomingo = (dataISO?: string) => {
      if (!dataISO) return false;
      const d = new Date(dataISO);
      if (isNaN(d.getTime())) return false;
      return d.getDay() === 0;
    };

    return (
      <div
        ref={ref}
        className="w-[700px] bg-white color-[#1a1a1a] px-10 py-9"
        style={{
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: "0.02em",
            margin: 0,
            paddingBottom: 12,
          }}
        >
          {"Escala \u2013 " + data.mes?.join(" / ")}
        </h1>

        {/* Orange divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "#EA580C",
            borderRadius: 2,
            margin: "0 0 14px 0",
          }}
        />

        {/* Weeks */}
        {data.semanas.map((week) => (
          <div key={week.id} style={{ marginBottom: 5 }}>
            <div
              style={{
                display: "grid",
                justifyContent:"left",
                gap: "12px 24px",
                padding: "0 12px",
              }}
            >
              {week.cultos.map((culto) => {
                const ehDomingo = isDomingo(culto.dataISO);

                return (
                 ehDomingo && (
                  <div key={culto.id} style={{ paddingBottom: 4 }}>
                    <p
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        margin: "0 0 2px 0",
                        lineHeight: 1.3,
                      }}
                    >
                      {culto.nome + " \u2013 " + culto.data}
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        margin: "0 0 1px 0",
                        color: "#333",
                        lineHeight: 1.5,
                      }}
                    >
                      {"Professoras dos Maiores: " + culto.professoraUp }
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        margin: "0 0 1px 0",
                        color: "#333",
                        lineHeight: 1.5,
                      }}
                    >
                      {"Professoras dos Menores: " + culto.professoraDow}
                    </p>
                  
                  </div>
                  )
                )
              })}
            </div>
          </div>
        ))}

        <div
          style={{
            height: 1,
            backgroundColor: "#EA580C",
            borderRadius: 2,
            margin: "0 0 14px 0",
          }}
        />       
      </div>
    );
  },
);
