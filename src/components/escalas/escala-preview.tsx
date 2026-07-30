"use client";

import { forwardRef } from "react";
import type { CultoEntry, EscalaData } from "@/lib/escala-types";

interface EscalaPreviewProps {
  data: EscalaData;
}

export const EscalaPreview = forwardRef<HTMLDivElement, EscalaPreviewProps>(
  function EscalaPreview({ data }, ref) {
    const isDomingo = (dataISO?: string): boolean => {
      if (!dataISO) return false;
      try {
        const data = new Date(dataISO);
        if (isNaN(data.getTime())) return false;
        return data.getDay() === 0;
      } catch (error) {
        console.error("Erro ao processar data:", error);
        return false;
      }
    }

    const parseDate = (dateString: string): Date | null => {
      if (!dateString) return null;
      
      // Se está no formato DD/MM
      if (dateString.includes("/") && dateString.length === 5) {
        const [day, month] = dateString.split("/");
        const year = new Date().getFullYear();
        return new Date(year, parseInt(month) - 1, parseInt(day));
      }
      
      // Se está no formato YYYY-MM-DD
      if (dateString.includes("-") && dateString.length === 10) {
        return new Date(dateString);
      }
      
      return null;
    };

    const sortCultosByDate = (cultos: CultoEntry[]): CultoEntry[] => {
      return [...cultos].sort((a, b) => {
        const dateA = parseDate(a.data);
        const dateB = parseDate(b.data);
        
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return dateA.getTime() - dateB.getTime();
      });
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
          {"Escala \u2013 " + data.mes}
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

        {/* Top verse */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <p
            style={{
              fontSize: 13,
              fontStyle: "italic",
              color: "#EA580C",
              margin: "0 0 2px 0",
              lineHeight: 1.5,
            }}
          >
            {data.versiculoTopo}
          </p>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1a1a1a",
              margin: 0,
            }}
          >
            {data.referenciaTopo}
          </p>
        </div>

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
          <div key={week.id} style={{ marginBottom: 20 }}>
            {/* Orange header bar */}
            <div
              style={{
                backgroundColor: "#EA580C",
                borderRadius: "8px",
                padding: "10px 18px",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                {"Semana " + week.inicio + " a " + week.fim + " - "}
              </span>
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: 400,
                  fontSize: 14,
                }}
              >
                {week.conjunto}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  week.cultos.length === 1 ? "1fr" : "1fr 1fr",
                gap: "12px 24px",
                padding: "0 12px",
              }}
            >
              {sortCultosByDate(week.cultos).map((culto) => {
                const ehDomingo = isDomingo(culto.dataISO);

                return (
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
                      {"Porteiro: " + culto.porteiro}
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        margin: 0,
                        color: "#333",
                        lineHeight: 1.5,
                      }}
                    >
                      {"Recep\u00e7\u00e3o: " + culto.recepcao}
                    </p>
                    {culto.acomodadores && (<p
                      style={{
                        fontSize: 14,
                        margin: 0,
                        color: "#333",
                        lineHeight: 1.5,
                      }}
                    >
                      {"Acomodadores: " + culto.acomodadores}
                    </p>)}
                   {/*  {ehDomingo && (
                      <>
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
                    </>
                  )} */}
                  </div>

                )
              })}
            </div>
          </div>
        ))}

        <div
          style={{
            height: 2,
            backgroundColor: "#e5e5e5",
            margin: "16px 0",
          }}
        />

        {/* Bottom verse */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              fontStyle: "italic",
              color: "#EA580C",
              margin: "0 0 2px 0",
              lineHeight: 1.5,
            }}
          >
            {data.versiculoRodape}
          </p>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#1a1a1a",
              margin: 0,
            }}
          >
            {data.referenciaRodape}
          </p>
        </div>
      </div>
    );
  },
);
