// eslint-disable-next-line react-hooks/exhaustive-deps
"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EscalaData,
  WeekEntry,
  CultoEntry,
} from "@/lib/escala-types";
import {
  MESES,
  createEmptyWeek,
  createEmptyCulto,
} from "@/lib/escala-types";
import { CalendarEvent } from "@/lib/ics-parser";
import { generateWeeksFromMonth } from "@/lib/generate-weeks";
import { useEffect } from "react";


interface EscalaFormProps {
  data: EscalaData;
  onChange: (data: EscalaData) => void;
  calendarEvents: CalendarEvent[];
}

export function EscalaForm({ data, onChange, calendarEvents }: EscalaFormProps) {

  const PORTEIROS = [
    "LIVRE",
    "Pb. Gleidystone",
    "Dc. Cleiton",
    "Aux. Wagner",
    "Aux. Viana",
    "Aux. Joadison",
    "Aux. Davi",
    "Aux. Paulo",
    "Aux. Antonilson",
  ];

  const RECEPCOES = [
    "LIVRE",
    "Ir. Natalia",
    "Ir. Victoria",
    "Ir. Daniele",
    "Ir. Rebeca",
    "Ir. Iris",
    "Ir. Ruthe",
    "Ir. Eloisa",
  ];

  const handleMonthChange = async (v: string) => {
    onChange({
      ...data,
      mes: v,
      semanas: [],
    });

    const anoAtual = new Date().getFullYear();
    const mesIndex = MESES.indexOf(v.toUpperCase());
    const mesNumero = mesIndex + 1;

    const res = await fetch(
      `/api/calendar?year=${anoAtual}&month=${mesNumero}`
    );

    const json = await res.json();
    const eventos = json.events || [];
    const novasSemanas = generateWeeksFromMonth(
      v,
      anoAtual,
      eventos
    );

    onChange({
      ...data,
      mes: v,
      semanas: novasSemanas,
    });
  };

  const updateWeek = (weekId: string, updates: Partial<WeekEntry>) => {
    onChange({
      ...data,
      semanas: data.semanas.map((w) =>
        w.id === weekId ? { ...w, ...updates } : w,
      ),
    });
  };

  const updateCulto = (
    weekId: string,
    cultoId: string,
    updates: Partial<CultoEntry>,
  ) => {
    onChange({
      ...data,
      semanas: data.semanas.map((w) =>
        w.id === weekId
          ? {
              ...w,
              cultos: w.cultos.map((c) =>
                c.id === cultoId ? { ...c, ...updates } : c,
              ),
            }
          : w,
      ),
    });
  };

  const addWeek = () => {
    onChange({ ...data, semanas: [...data.semanas, createEmptyWeek()] });
  };

  const removeWeek = (weekId: string) => {
    if (data.semanas.length <= 1) return;
    onChange({
      ...data,
      semanas: data.semanas.filter((w) => w.id !== weekId),
    });
  };

  const addCulto = (weekId: string) => {
    onChange({
      ...data,
      semanas: data.semanas.map((w) =>
        w.id === weekId
          ? { ...w, cultos: [...w.cultos, createEmptyCulto()] }
          : w,
      ),
    });
  };

  const removeCulto = (weekId: string, cultoId: string) => {
    const week = data.semanas.find((w) => w.id === weekId);
    if (!week || week.cultos.length <= 1) return;
    onChange({
      ...data,
      semanas: data.semanas.map((w) =>
        w.id === weekId
          ? { ...w, cultos: w.cultos.filter((c) => c.id !== cultoId) }
          : w,
      ),
    });
  };
  
  return (
    <div className="flex flex-col gap-6">
      {/* Header settings */}
      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Configuracoes gerais
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mes" className="text-sm font-medium text-foreground">
              Mes
            </label>
            <Select
              value={data.mes || undefined}
              onValueChange={handleMonthChange}
            >
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

       </div>
      </section>

      {/* Weeks */}
      {data.semanas.map((week, weekIndex) => (
        <section
          key={week.id}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Semana {weekIndex + 1}
              </h3>
            </div>
            <Button
              size="sm"
              onClick={() => removeWeek(week.id)}
              disabled={data.semanas.length <= 1}
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Remover semana ${weekIndex + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {/* Week period and conjunto */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Louvor
                </label>
                <Select
                  value={week.conjunto}
                  onValueChange={(v) =>
                    updateWeek(week.id, {
                      conjunto: v as WeekEntry["conjunto"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conjunto de Jovens">
                      Conjunto de Jovens
                    </SelectItem>
                    <SelectItem value="Conjunto de Senhoras">
                      Conjunto de Senhoras
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cultos in this week */}
            <div className="flex flex-col gap-2">
              {week.cultos.map((culto, cultoIndex) => (
                <div
                  key={culto.id}
                  className="rounded-lg border border-border/60 bg-muted/30 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Culto {cultoIndex + 1}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => removeCulto(week.id, culto.id)}
                      disabled={week.cultos.length <= 1}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      aria-label={`Remover culto ${cultoIndex + 1}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">
                        Culto
                      </label>
                      <Input
                        value={culto.nome}
                        onChange={(e) =>
                          updateCulto(week.id, culto.id, {
                            nome: e.target.value,
                          })
                        }
                        placeholder="Culto"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">
                        Data
                      </label>
                      <Input
                        value={culto.data}
                        onChange={(e) =>
                          updateCulto(week.id, culto.id, {
                            data: e.target.value,
                          })
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">
                        Porteiro
                      </label>
                      <Select
                        value={culto.porteiro}
                        onValueChange={(v) =>
                          updateCulto(week.id, culto.id, {
                            porteiro: v,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 text-sm px-0">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {PORTEIROS.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">
                        Recepcao
                      </label>
                      <Select
                        value={culto.recepcao}
                        onValueChange={(v) =>
                          updateCulto(week.id, culto.id, {
                            recepcao: v,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 text-sm px-0">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {RECEPCOES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="self-start bg-blue-200 text-blue-800 hover:bg-blue-400"
                onClick={() => addCulto(week.id)}
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar culto
              </Button>
            </div>
          </div>
        </section>
      ))}

      {/* Add week */}
      <Button variant="outline" onClick={addWeek} className="self-start bg-green-200 text-green-800 hover:bg-green-500">
        <Plus className="h-4 w-4" />
        Adicionar semana
      </Button>
    </div>
  );
}
