"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Campo({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const NENHUM = "__none__";

/** Lista de pessoas quando há opções; campo de texto livre quando a lista está vazia. */
export function PapelInput({
  label,
  value,
  opcoes,
  onChange,
}: {
  label: string;
  value: string;
  opcoes?: readonly string[];
  onChange: (v: string) => void;
}) {
  if (!opcoes?.length) {
    return (
      <Campo label={label}>
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
      </Campo>
    );
  }

  return (
    <Campo label={label}>
      <Select value={value || ""} onValueChange={(v) => onChange(v === NENHUM ? "" : v)}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NENHUM}>Vazio</SelectItem>
          {["LIVRE", ...opcoes].map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Campo>
  );
}
