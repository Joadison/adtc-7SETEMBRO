"use client";

import { useState, type ReactNode } from "react";
import { GripVertical, Loader2, Plus, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EscalaFields, FieldKey } from "@/lib/calendar-description";
import { CONJUNTOS, CORES_CONJUNTO, PESSOAS } from "@/lib/escala-people";
import {
  createEmptyCulto,
  createEmptyWeek,
  MESES,
  type CultoEntry,
  type EscalaData,
  type WeekEntry,
} from "@/lib/escala-types";
import {
  applyAtribuicoes,
  cultoDateToInput,
  dateFromInput,
  DIA,
  diaDaSemana,
  sortCultos,
  type AtribuicoesIA,
} from "@/lib/escala-utils";

interface EscalaFormProps {
  data: EscalaData;
  onChange: (data: EscalaData) => void;
  /** Busca os eventos do mês e monta as semanas (feito pela página). */
  onMonthChange: (mes: string) => Promise<void>;
}

// ---------- peças pequenas ----------

function Campo({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const NENHUM = "__none__";

function PessoaSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <Campo label={label}>
      <Select value={value || ""} onValueChange={(v) => onChange(v === NENHUM ? "" : v)}>
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NENHUM}>Vazio</SelectItem>
          {["LIVRE", ...options].map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Campo>
  );
}

function CultoCard({
  culto,
  index,
  canRemove,
  onChange,
  onRemove,
}: {
  culto: CultoEntry;
  index: number;
  canRemove: boolean;
  onChange: (updates: Partial<CultoEntry>) => void;
  onRemove: () => void;
}) {
  const dia = diaDaSemana(culto.dataISO);
  const quinta = dia === DIA.QUINTA;
  const domingo = dia === DIA.DOMINGO;
  const set = (campo: FieldKey) => (v: string) => onChange({ [campo]: v } as Partial<EscalaFields>);

  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">Culto {index + 1}</span>
        <Button
          size="sm"
          onClick={onRemove}
          disabled={!canRemove}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          aria-label={`Remover culto ${index + 1}`}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-2">
        <Campo label="Culto">
          <Input
            value={culto.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
            placeholder="Culto"
            className="h-8 text-sm"
          />
        </Campo>
        <Campo label="Data">
          <Input
            type="date"
            value={cultoDateToInput(culto)}
            onChange={(e) => onChange(dateFromInput(e.target.value))}
            className="h-8 text-sm"
          />
        </Campo>
      </div>

      <Campo label="Pregador" className="mb-2">
        <Input value={culto.pregador} onChange={(e) => onChange({ pregador: e.target.value })} className="h-8 text-sm" />
      </Campo>

      <div className="mb-2 grid grid-cols-2 gap-2">
        <PessoaSelect label="Porteiro 1" value={culto.porteiro1} options={PESSOAS.porteiros} onChange={set("porteiro1")} />
        {!quinta && (
          <PessoaSelect label="Porteiro 2" value={culto.porteiro2} options={PESSOAS.porteiros} onChange={set("porteiro2")} />
        )}
        <PessoaSelect label="Recepcao" value={culto.recepcao} options={PESSOAS.recepcao} onChange={set("recepcao")} />
      </div>

      {(domingo || quinta) && (
        <div className="mb-2 grid grid-cols-2 gap-2">
          <PessoaSelect
            label={domingo ? "Professoras dos Maiores" : "Professoras 1"}
            value={culto.professoraUp}
            options={PESSOAS.professoras}
            onChange={set("professoraUp")}
          />
          <PessoaSelect
            label={domingo ? "Professoras dos Menores" : "Professoras 2"}
            value={culto.professoraDow}
            options={PESSOAS.professoras}
            onChange={set("professoraDow")}
          />
        </div>
      )}

      <Campo label="Acomodadores" className="mb-2">
        <Input
          value={culto.acomodadores}
          onChange={(e) => onChange({ acomodadores: e.target.value })}
          className="h-8 text-sm"
        />
      </Campo>
    </div>
  );
}

// ---------- formulário ----------

export function EscalaForm({ data, onChange, onMonthChange }: EscalaFormProps) {
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [fechadas, setFechadas] = useState<Set<string>>(new Set()); // semanas recolhidas

  const semanas = data.semanas ?? [];
  const setSemanas = (fn: (s: WeekEntry[]) => WeekEntry[]) => onChange({ ...data, semanas: fn(semanas) });
  const updateWeek = (weekId: string, fn: (w: WeekEntry) => WeekEntry) =>
    setSemanas((s) => s.map((w) => (w.id === weekId ? fn(w) : w)));
  const updateCulto = (weekId: string, cultoId: string, updates: Partial<CultoEntry>) =>
    updateWeek(weekId, (w) => ({ ...w, cultos: w.cultos.map((c) => (c.id === cultoId ? { ...c, ...updates } : c)) }));

  const toggleSemana = (id: string) =>
    setFechadas((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const handleMonth = async (mes: string) => {
    setErro(null);
    try {
      await onMonthChange(mes);
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const handleGerar = async () => {
    setGerando(true);
    setErro(null);
    try {
      const res = await fetch("/api/calendar/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mes: data.mes[0],
          ano: new Date().getFullYear(),
          semanas: semanas.map((w) => ({
            id: w.id,
            cultos: w.cultos.map((c) => ({ id: c.id, data: c.data, dataISO: c.dataISO, nome: c.nome, pregador: c.pregador })),
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao gerar");

      onChange(applyAtribuicoes(data, json.atribuicoes as AtribuicoesIA));
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Button
        onClick={handleGerar}
        disabled={gerando || !data.mes?.[0]}
        className="mt-3 bg-purple-600 text-white hover:bg-purple-700"
      >
        {gerando ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Gerando escala...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            Preencher escala com IA
          </>
        )}
      </Button>

      {erro && <p className="mt-2 text-xs text-destructive">{erro}</p>}

      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Configuracoes gerais
        </h3>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mes" className="text-sm font-medium text-foreground">
            Mes
          </label>
          <Select value={data.mes?.[0] || ""} onValueChange={handleMonth}>
            <SelectTrigger id="mes">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {semanas.map((week, weekIndex) => {
        const aberta = !fechadas.has(week.id);
        const conjunto = week.cultos[0]?.conjunto || week.conjunto;

        return (
          <section key={week.id} className="rounded-xl border border-border bg-card p-4">
            <div
              onClick={() => toggleSemana(week.id)}
              className={`mb-3 flex cursor-pointer items-center justify-between ${CORES_CONJUNTO[conjunto] ?? "bg-muted"}`}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Semana {weekIndex + 1}</h3>
                <span className="ml-2 text-xs text-muted-foreground">{aberta ? "▼" : "▶"}</span>
              </div>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSemanas((s) => s.filter((w) => w.id !== week.id));
                }}
                disabled={semanas.length <= 1}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remover semana ${weekIndex + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {aberta && (
              <div className="flex flex-col gap-3">
                <Campo label="Louvor">
                  <Select
                    value={conjunto}
                    onValueChange={(v) =>
                      updateWeek(week.id, (w) => ({ ...w, conjunto: v, cultos: w.cultos.map((c) => ({ ...c, conjunto: v })) }))
                    }
                  >
                    <SelectTrigger className="h-10 w-64">
                      <SelectValue placeholder="Selecione o conjunto" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONJUNTOS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Campo>

                <div className="flex flex-col gap-2">
                  {sortCultos(week.cultos).map((culto, i) => (
                    <CultoCard
                      key={culto.id}
                      culto={culto}
                      index={i}
                      canRemove={week.cultos.length > 1}
                      onChange={(updates) => updateCulto(week.id, culto.id, updates)}
                      onRemove={() =>
                        updateWeek(week.id, (w) => ({ ...w, cultos: w.cultos.filter((c) => c.id !== culto.id) }))
                      }
                    />
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start bg-blue-200 text-blue-800 hover:bg-blue-400"
                    onClick={() => updateWeek(week.id, (w) => ({ ...w, cultos: [...w.cultos, createEmptyCulto()] }))}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar culto
                  </Button>
                </div>
              </div>
            )}
          </section>
        );
      })}

      <Button
        variant="outline"
        onClick={() => setSemanas((s) => [...s, createEmptyWeek()])}
        className="self-start bg-green-200 text-green-800 hover:bg-green-500"
      >
        <Plus className="h-4 w-4" />
        Adicionar semana
      </Button>
    </div>
  );
}