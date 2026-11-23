"use client";

import { useCallback, useState, type RefObject } from "react";

/** Exporta o elemento de pré-visualização como PNG (mesma lógica usada na escala principal). */
export function useExportar(ref: RefObject<HTMLDivElement | null>, nomeArquivo: string) {
  const [exportando, setExportando] = useState(false);

  const exportar = useCallback(async () => {
    setExportando(true);
    await new Promise((r) => setTimeout(r, 200));
    try {
      const el = ref.current;
      if (!el) return;

      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(el, { scale: 3, backgroundColor: "#ffffff", useCORS: true, logging: false });

      const link = document.createElement("a");
      link.download = nomeArquivo;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportando(false);
    }
  }, [ref, nomeArquivo]);

  return { exportando, exportar };
}
