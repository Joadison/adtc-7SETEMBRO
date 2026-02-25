"use client";

import { forwardRef } from "react";
import type { EscalaData } from "@/lib/escala-types";

interface EscalaPreviewProps {
  data: EscalaData;
}

export const EscalaPreview = forwardRef<HTMLDivElement, EscalaPreviewProps>(
  function EscalaPreview({ data }, ref) {
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

            {/* Culto entries grid - 2 columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  week.cultos.length === 1 ? "1fr" : "1fr 1fr",
                gap: "12px 24px",
                padding: "0 12px",
              }}
            >
              {week.cultos.map((culto) => (
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
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom divider */}
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
