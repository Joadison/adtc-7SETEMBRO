"use client";

import { forwardRef, type ReactNode } from "react";
import type { CultoEntry } from "@/lib/escala-types";

// html2canvas não entende as cores modernas do Tailwind (oklch): por isso estilos inline com hex.
export const COR = { laranja: "#EA580C", rosa: "#ea0c7b", texto: "#1a1a1a", suave: "#333" };

export const Linha = ({ children }: { children: ReactNode }) => (
  <p style={{ fontSize: 14, margin: "0 0 1px 0", color: COR.suave, lineHeight: 1.5 }}>{children}</p>
);

export const TituloCulto = ({ culto }: { culto: CultoEntry }) => (
  <p style={{ fontSize: 17, fontWeight: 800, margin: "0 0 2px 0", lineHeight: 1.3 }}>
    {`${culto.nome} – ${culto.data}`}
  </p>
);

export const Divisor = ({ cor = COR.laranja, altura = 1, margem = "0 0 14px 0" }) => (
  <div style={{ height: altura, backgroundColor: cor, borderRadius: 2, margin: margem }} />
);

export const Versiculo = ({
  texto,
  referencia,
  tamanho,
  margemBaixo = 0,
}: {
  texto: string;
  referencia: string;
  tamanho: number;
  margemBaixo?: number;
}) => (
  <div style={{ textAlign: "center", marginBottom: margemBaixo }}>
    <p style={{ fontSize: tamanho, fontStyle: "italic", color: COR.laranja, margin: "0 0 2px 0", lineHeight: 1.5 }}>
      {texto}
    </p>
    <p style={{ fontSize: tamanho, fontWeight: 700, color: COR.texto, margin: 0 }}>{referencia}</p>
  </div>
);

export const PreviewFrame = forwardRef<HTMLDivElement, { titulo: string; subtitulo?: string; children: ReactNode }>(
  function PreviewFrame({ titulo, subtitulo, children }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: 700,
          background: "#fff",
          color: COR.texto,
          padding: "36px 40px",
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", letterSpacing: "0.02em", margin: 0, paddingBottom: 12 }}>
          {titulo}
        </h1>
        {subtitulo && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#666", margin: "-4px 0 12px 0" }}>{subtitulo}</p>
        )}
        <Divisor />
        {children}
      </div>
    );
  },
);
