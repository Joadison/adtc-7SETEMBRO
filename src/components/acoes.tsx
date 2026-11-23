"use client";

import { Calendar, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Botões de cada aba: sincronizar com o Calendar e baixar a imagem. */
export function BarraAcoes({
  onSync,
  sincronizando,
  syncDesabilitado,
  onExport,
  exportando,
}: {
  onSync: () => void;
  sincronizando: boolean;
  syncDesabilitado?: boolean;
  onExport: () => void;
  exportando: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button onClick={onSync} disabled={sincronizando || syncDesabilitado} variant="outline">
        {sincronizando ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sincronizando...
          </>
        ) : (
          <>
            <Calendar className="h-4 w-4" />
            Sincronizar com Calendário
          </>
        )}
      </Button>

      <Button onClick={onExport} disabled={exportando}>
        <Download className="h-4 w-4" />
        {exportando ? "Exportando..." : "Baixar imagem"}
      </Button>
    </div>
  );
}
