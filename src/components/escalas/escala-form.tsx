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
import { useState } from "react";

interface EscalaFormProps {
  data: EscalaData;
  onChange: (data: EscalaData) => void;
  calendarEvents: CalendarEvent[];
}

export function EscalaForm({ data, onChange, calendarEvents }: EscalaFormProps) {
  const [semanasExpandidas, setSemanasExpandidas] = useState<Record<string, boolean>>(
    data.semanas.reduce((acc, week) => ({ ...acc, [week.id]: true }), {})
  );

  const toggleSemana = (weekId: string) => {
    setSemanasExpandidas(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };
  const PORTEIROS = [
    "none",
    "LIVRE",
    "Pb. Gleidystone",
    "Dc. Cleiton",
    "Aux. Wagner",
    "Aux. Viana",
    "Aux. Joadison",
    "Aux. Davi",
    "Aux. Paulo",
    "Aux. Antonilson",
    "Aux. Vitor",
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
    "Ir. Ester,"
  ];

  const PROFESSORAS = [
    "LIVRE",
    "Ir. Monica",
    "Ir. Victoria",
    "Ir. Daniele",
    "Ir. Rebeca",
    "Ir. Val",
    "Ir. Cleuma",
    "Ir. Marilia",
    "Ir. Ruthe",
    "Ir. Raryane",
  ];

  const CONJUNTOS = ["Conjunto de Jovens","Conjunto de Senhoras","Conjunto de Crianças","Conjunto de Homens" ]

  const CORES_BG_SUAVE: Record<string, string> = {
    "Conjunto de Jovens": "bg-blue-100 border-blue-300",
    "Conjunto de Senhoras": "bg-pink-100 border-pink-300",
    "Conjunto de Crianças": "bg-yellow-100 border-yellow-300",
    "Conjunto de Homens": "bg-purple-100 border-purple-300",
  };

  const sortCultosByDate = (cultos: CultoEntry[]): CultoEntry[] => {
    return [...cultos].sort((a, b) => {
      // Converte as datas "DD/MM" para objetos Date para comparação
      const dateA = parseDate(a.data);
      const dateB = parseDate(b.data);
      
      // Se não tiver data, coloca no final
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      
      return dateA.getTime() - dateB.getTime();
    });
  };

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

  const isQuinta = (dataISO?: string): boolean => {
    if (!dataISO) return false;
    try {
      const data = new Date(dataISO);
      if (isNaN(data.getTime())) return false;
      return data.getDay() === 4;
    } catch (error) {
      console.error("Erro ao processar data:", error);
      return false;
    }
  }

  const handleMonthChange = async (v: string) => {

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
      mes: [v], 
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
  
  const formatToDateInput = (dateString: string): string => {
    if (!dateString) return "";
    
    // Se está no formato DD/MM, converte para YYYY-MM-DD
    if (dateString.includes("/") && dateString.length === 5) {
      const [day, month] = dateString.split("/");
      const year = new Date().getFullYear();
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    
    // Se já está no formato YYYY-MM-DD, retorna como está
    return dateString;
  };

  return (
    <div className="flex flex-col gap-6">
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
              value={data.mes?.[0] || ""}
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

      {data.semanas.map((week, weekIndex) => (
        <section
          key={week.id}
          className="rounded-xl border border-border bg-card p-4"
          
        >
        <div onClick={() => toggleSemana(week.id)} className={`mb-3 flex items-center justify-between ${week.conjunto ? CORES_BG_SUAVE[week.conjunto] : 'bg-muted-foreground'} `}>
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Semana {weekIndex + 1}
              </h3>
              <span className="text-xs text-muted-foreground ml-2">
                {semanasExpandidas[week.id] ? '▼' : '▶'}
              </span>
            </div>
            <Button
              size="sm"
              onClick={(e) => {e.stopPropagation(); removeWeek(week.id)}}
              disabled={data.semanas.length <= 1}
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Remover semana ${weekIndex + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {semanasExpandidas[week.id] && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Louvor
                  </label>
                  <Select
                    value={week.conjunto || ""}
                    onValueChange={(v) => {
                      updateWeek(week.id, { conjunto: v });
                      console.log("Conjunto selecionado para a semana:", v, week.cultos);
                      onChange({
                        ...data,
                        semanas: data.semanas.map((w) =>
                          w.id === week.id
                            ? {
                                ...w,
                                conjunto: v,
                                cultos: w.cultos.map((c) => ({
                                  ...c,
                                  conjunto: v,
                                })),
                              }
                            : w
                        ),
                      });
                    }}
                  >
                    <SelectTrigger className="w-64 h-10">
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
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {sortCultosByDate(week.cultos).map((culto, cultoIndex) => {
                  const ehDomingo = isDomingo(culto.dataISO);
                  const ehQuinta = isQuinta(culto.dataISO);
      
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
                            value={culto.data ? formatToDateInput(culto.data) : ""}
                            type="date"
                            onChange={(e) => {
                              const [year, month, day] = e.target.value.split("-");
                              updateCulto(week.id, culto.id, {
                                data: e.target.value ? `${day}/${month}` : "",
                              });
                            }}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 my-2">
                        <label className="text-xs text-muted-foreground">
                          Pregador
                        </label>
                        <Input
                          value={culto.pregador || ""}
                          onChange={(e) =>
                            updateCulto(week.id, culto.id, {
                              pregador: e.target.value,
                            })
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                        
                      {/* Porteiro e Recepção */}
                      <div className={`grid ${!ehQuinta ? "grid-cols-1" : "grid-cols-2"} gap-2 mb-2`}>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-muted-foreground">
                            Porteiro 1
                          </label>
                          <Select
                              value={culto.porteiro1 === "none" ? undefined : culto.porteiro1}
                              onValueChange={(v) =>
                                updateCulto(week.id, culto.id, {
                                  porteiro1: v === "none" ? undefined : v,
                                })
                              }
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Vazio</SelectItem>
                              {PORTEIROS.filter(p => p !== "none").map((p) => (
                                <SelectItem key={p} value={p}>
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {!ehQuinta && (
                          <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">
                              Porteiro 2
                            </label>
                            <Select
                              value={culto.porteiro2 === "none" ? undefined : culto.porteiro2}
                              onValueChange={(v) =>
                                updateCulto(week.id, culto.id, {
                                  porteiro2: v === "none" ? undefined : v,
                                })
                              }
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Vazio</SelectItem>
                                {PORTEIROS.filter(p => p !== "none").map((p) => (
                                  <SelectItem key={p} value={p}>
                                    {p}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          )}

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
                            <SelectTrigger className="h-8 text-sm">
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

                      <div className="flex flex-col gap-1 mb-2">
                        <label className="text-xs text-muted-foreground">
                          Acomodadores
                        </label>
                        <Input
                          value={culto.acomodadores || ""}
                          onChange={(e) =>
                            updateCulto(week.id, culto.id, {
                              acomodadores: e.target.value,
                            })
                          }
                          className="h-8 text-sm"
                        />
                      </div>

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
          )}
        </section>
      ))}

      <Button variant="outline" onClick={addWeek} className="self-start bg-green-200 text-green-800 hover:bg-green-500">
        <Plus className="h-4 w-4" />
        Adicionar semana
      </Button>
    </div>
  );
}
