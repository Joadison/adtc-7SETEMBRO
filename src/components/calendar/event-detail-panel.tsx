"use client";

import React, { useState } from "react";

import {
  DoorOpen,
  HandHelping,
  Mic2,
  MapPin,
  Clock,
  CalendarDays,
  X,
  Cake,
  Church,
  ToyBrick,
  Balloon,
  AArrowDown,
  AArrowUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarEvent, EventCategory } from "@/lib/ics-parser";
import { cn } from "@/lib/utils";
import { TIPOS_CULTO } from "@/lib/escala-types";
import { TipoCulto } from '../../lib/escala-types';

interface EventDetailPanelProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

function getCategoryHeaderStyle(title: EventCategory) {
  switch (title) {
    case "Aniversário":
      return "bg-orange-400 text-orange-800 border-orange-200";
    case "SEDE":
      return "bg-blue-900 text-blue-50 border-blue-800";
    case "Culto de Missão":
      return "bg-green-800 text-green-800 border-green-200";
    case "Culto da Família":
      return "bg-red-800 text-red-800 border-red-200";
    case "Culto de Santa Ceia":
      return "bg-red-900 text-red-800 border-red-200";
    case "Culto de Louvor e Adoração":
      return "bg-indigo-900 text-indigo-800 border-indigo-200";
    case "Culto de Mulheres":
      return "bg-pink-900 text-pink-800 border-pink-200";
    case "Culto de Doutrina":
      return "bg-purple-800 text-purple-800 border-purple-200";
    case "Círculo de Oração":
      return "bg-yellow-500 text-yellow-800 border-yellow-200";
    case "Consagração":
      return "bg-emerald-400 text-emerald-800 border-emerald-200";
    case "Culto de Jovens":
      return "bg-cyan-900 text-cyan-800 border-cyan-200";
    case "Culto de Crianças":
      return "bg-lime-600 text-lime-95 border-lime-25";
    case "Reunião de Liderança":
      return "bg-violet-600 text-violet-95 border-violet-25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function getCategoryIcon(title: EventCategory) {
  switch (title) {
    case "Aniversário":
      return Cake;
    case "SEDE":
      return Church;
    case "EBD":
      return MapPin;
    default:
      return CalendarDays;
  }
}

function getCategoryLabel(title: EventCategory) {
  switch (title) {
    case "Aniversário":
      return "Aniversário";
    case "SEDE":
      return "Culto na Sede";
    case "EBD":
      return "Escola Bíblica";
    case "Culto da Família":
      return "Culto da Família";
    case "Círculo de Oração":
      return "Círculo de Oração";
    case "Consagração":
      return "Consagração";
    case "Culto de Jovens":
      return "Culto de Jovens";
    case "Culto de Crianças":
      return "Culto de Crianças";
    case "Reunião de Liderança":
      return "Reunião de Liderança";
    case "Culto de Santa Ceia":
      return "Culto de Santa Ceia";
    case "Culto de Louvor e Adoração":
      return "Culto de Louvor e Adoração";
    case "Culto de Doutrina":
      return "Culto de Doutrina";
    case "Culto de Missão":
      return "Culto de Missão";
    default:
      return "Evento";
  }
}

export function cleanEventDescription(description: string): string {
  if (!description) return "";

  return description
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/\r?\n/)
    .filter(line => !/^\s*(Porteiro|Recepção|Pregador|professoraMaiores|professoraMenores)\s*[:\-]/i.test(line))
    .join("<br />")
    .trim();
}

function RoleCard({
  icon: Icon,
  label,
  name,
  colorClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  name: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          colorClass,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
      </div>
    </div>
  );
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  if (!event) return null;

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const sameDay = isSameDay(startDate, endDate);
  const CategoryIcon = getCategoryIcon(event.category);

  const isCultoRegular = event.title === "culto";

  const rawDescription = event.description || "";
  const cleanDescription = cleanEventDescription(rawDescription);
  const hasMeaningfulContent = cleanDescription.trim().length > 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div
        className={cn(
          "flex items-start justify-between gap-2 p-4",
          getCategoryHeaderStyle(event.category),
        )}
      >
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <CategoryIcon className="h-4 w-4 text-white/80" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
              {getCategoryLabel(event.category)}
            </span>
          </div>
          <h2 className="text-balance font-serif text-lg font-bold text-white">
            {event.title === "aniversario" && "🎂 "}
            {event.title}
          </h2>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
            <span className="capitalize">
              {format(startDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
        </div>
        <Button
          size="icon"
          onClick={onClose}
          className="shrink-0 text-white hover:bg-white/10 hover:text-white"
          aria-label="Fechar detalhes"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Time & Location */}
        <div className="flex flex-col gap-2">
          {!event.allDay && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                {format(startDate, "HH:mm", { locale: ptBR })}
                {" - "}
                {sameDay
                  ? format(endDate, "HH:mm", { locale: ptBR })
                  : format(endDate, "HH:mm '('d MMM')'", { locale: ptBR })}
              </span>
            </div>
          )}
          {event.allDay && (
            <Badge variant="secondary" className="w-fit">
              Dia inteiro
            </Badge>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {TIPOS_CULTO.includes(event.category as TipoCulto) && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Escala de Pregação
              </h3>
              {isCultoRegular ? (
                <p className="text-sm text-foreground">
                  Consulte a escala completa no grupo de WhatsApp.
                </p>
              ) : event.pregador ? (
                <div className="flex gap-2">                 
                  {event.pregador && (
                    <RoleCard
                      icon={Mic2}
                      label="Pregador(a)"
                      name={event.pregador}
                      colorClass="bg-emerald-100 text-emerald-700"
                    />
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Nenhuma escala definida na descricao.
                </p>
              )}
            </div>
          </>
        )}

        {/* Roles section: show for all cultos */}
        {TIPOS_CULTO.includes(event.category as TipoCulto) && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Escala do Dia
              </h3>
              {isCultoRegular ? (
                <p className="text-sm text-foreground">
                  Consulte a escala completa no grupo de WhatsApp.
                </p>
              ) : event.porteiro || event.recepcao ? (
                <div className="flex gap-2">
                  {event.porteiro && (
                    <RoleCard
                      icon={DoorOpen}
                      label="Porteiro"
                      name={event.porteiro}
                      colorClass="bg-primary/10 text-primary"
                    />
                  )}
                  {event.recepcao && (
                    <RoleCard
                      icon={HandHelping}
                      label="Recepção"
                      name={event.recepcao}
                      colorClass="bg-amber-100 text-amber-700"
                    />
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Nenhuma escala definida na descricao.
                </p>
              )}
            </div>
          </>
        )}

        {TIPOS_CULTO.includes(event.category as TipoCulto) && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Escala Infantil do Dia
              </h3>
              {isCultoRegular ? (
                <p className="text-sm text-foreground">
                  Consulte a escala completa no grupo de WhatsApp.
                </p>
              ) : event.professoraDow || event.professoraUp ? (
                <div className="flex gap-2">
                  {event.professoraDow && (
                    <RoleCard
                      icon={ArrowDown}
                      label="Professora Menores"
                      name={event.professoraDow}
                      colorClass="bg-blue-100 text-blue-700"
                    />
                  )}
                  {event.professoraUp && (
                    <RoleCard
                      icon={ArrowUp}
                      label="Professora Maiores"
                      name={event.professoraUp}
                      colorClass="bg-blue-100 text-blue-700"
                    />
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Nenhuma escala definida na descricao.
                </p>
              )}
            </div>
          </>
        )}

        {/* Birthday special message */}
        {event.title.startsWith("Aniversário") && (
          <>
            <Separator className="my-4" />
            <div className="rounded-lg bg-orange-50 p-4 text-center">
              <Cake className="mx-auto h-8 w-8  text-orange-600" />
              <p className="mt-2 font-serif text-sm font-bold text-orange-800">
                Feliz Aniversario!
              </p>
              <p className="mt-0.5 text-xs text-orange-600">
                Que Deus abencoe mais este ano de vida.
              </p>
            </div>
          </>
        )}

        {/* Description */}
        {hasMeaningfulContent && (
          <>
            <Separator className="my-4" />
            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: cleanDescription }}
            />
          </>
        )}
      </div>
    </div>
  );
}
