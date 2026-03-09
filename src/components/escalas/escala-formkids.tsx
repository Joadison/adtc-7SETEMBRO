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
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface EscalaFormProps {
  data: EscalaData;
  onChange: (data: EscalaData) => void;
  calendarEvents: CalendarEvent[];
}

export function EscalaFormKids({ data, onChange, calendarEvents }: EscalaFormProps) {
  const PROFESSORAS = [
    "LIVRE",
    "Ir. Monica",
    "Ir. Victoria",
    "Ir. Daniele",
    "Ir. Rebeca",
    "Ir. Val",
    "Ir. Ruthe",
    "Ir. Raryane",
  ];

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

  const handleMonthChange = async (meses: string[]) => {

    const anoAtual = new Date().getFullYear();

    let todasSemanas: WeekEntry[] = [];

    for (const mes of meses) {

      const mesIndex = MESES.indexOf(mes.toUpperCase());
      const mesNumero = mesIndex + 1;

      const res = await fetch(
        `/api/calendar?year=${anoAtual}&month=${mesNumero}`
      );

      const json = await res.json();
      const eventos = json.events || [];

      const semanasMes = generateWeeksFromMonth(
        mes,
        anoAtual,
        eventos
      );

      todasSemanas = [...todasSemanas, ...semanasMes];

    }

    onChange({
      ...data,
      mes: meses,
      semanas: todasSemanas,
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
  
  console.log(data.mes)
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Configuracoes gerais
        </h3>
        <div className="flex flex-col gap-3">
          <label htmlFor="mes" className="text-sm font-medium text-foreground">
            Mes
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MESES.map((mes) => (
              <div key={mes} className="flex items-center space-x-2">
                <Checkbox
                  id={`mes-${mes}`}
                  checked={data.mes?.includes(mes)}
                  onCheckedChange={(checked) => {
                    const novosMeses = checked
                      ? [...(data.mes || []), mes]
                      : (data.mes || []).filter((m) => m !== mes);
                    handleMonthChange(novosMeses);
                  }}
                />
                <Label htmlFor={`mes-${mes}`} className="text-sm cursor-pointer">
                  {mes}
                </Label>
              </div>
            ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Você pode selecionar múltiplos meses (2 ou 3)
        </p>
       </div>
      </section>

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
            <div className="flex flex-col gap-2">
              {week.cultos.map((culto, cultoIndex) => {
                const ehDomingo = isDomingo(culto.dataISO);
     
                return (
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
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {/* Culto e Data */}
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
                    </div>
                      
                    
                    {/* Salinha */}
                    {ehDomingo && (
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-muted-foreground">
                            Professoras dos Maiores
                          </label>
                          <Select
                            value={culto.professoraUp}
                            onValueChange={(v) =>
                              updateCulto(week.id, culto.id, {
                                professoraUp: v,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROFESSORAS.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-muted-foreground">
                            Professoras dos Menores
                          </label>
                          <Select
                            value={culto.professoraDow}
                            onValueChange={(v) =>
                              updateCulto(week.id, culto.id, {
                                professoraDow: v,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent className="p-0 m-0">
                              {PROFESSORAS.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                  </div>
                )
              })}
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

      <Button variant="outline" onClick={addWeek} className="self-start bg-green-200 text-green-800 hover:bg-green-500">
        <Plus className="h-4 w-4" />
        Adicionar semana
      </Button>
    </div>
  );
}
