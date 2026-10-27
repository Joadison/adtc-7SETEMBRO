"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarDays,
  HandHeart,
  Image as ImageIcon,
  Images,
  MonitorPlay,
  ArrowRight,
} from "lucide-react";

import EscalaWork from "./escalaWork";
import EscalaMensal from "./escalaMensal";
import EscalaOp from "./escalaOp";
import EscalaMidia from "./escalaMidia";
import Img from "./img";

import { Button } from "../ui/button";

type ComponentKey =
  | "EscalaWork"
  | "EscalaOp"
  | "Story"
  | "Midia"
  | "Imagem";

const Config = () => {
  const [activeComponent, setActiveComponent] =
    useState<ComponentKey>("EscalaWork");

  const router = useRouter();

  const menuItems = [
    {
      id: "EscalaWork",
      label: "Trabalhos",
      icon: BriefcaseBusiness,
    },
    {
      id: "EscalaOp",
      label: "Oportunidades",
      icon: HandHeart,
    },
    {
      id: "Story",
      label: "Escala Mensal",
      icon: CalendarDays,
    },
    {
      id: "Midia",
      label: "Mídia",
      icon: MonitorPlay,
    },
    {
      id: "Imagem",
      label: "Imagens",
      icon: ImageIcon,
    },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              Painel de Escalas
            </h1>
            <p className="mt-1 text-sm text-orange-50">
              Gerencie trabalhos, oportunidades e mídias.
            </p>
          </div>

          <Button
            onClick={() => router.push("/escala")}
            className="w-full gap-2 bg-white text-orange-700 hover:bg-orange-50 md:w-auto"
          >
            <Images className="h-4 w-4" />
            Visualizar escalas
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Navegação */}
      <nav
        aria-label="Seções do painel"
        className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur"
      >
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeComponent === item.id;

              return (
                <Button
                  key={item.id}
                  variant="default"
                  aria-pressed={isActive}
                  onClick={() => setActiveComponent(item.id)}
                  className={`min-h-11 shrink-0 gap-2 rounded-xl px-3 sm:px-4 ${
                    isActive
                      ? "bg-orange-100 font-semibold text-orange-700 hover:bg-orange-100"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <section className="mx-auto w-full max-w-7xl p-3 sm:p-6 lg:p-8">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 lg:p-6">
          {activeComponent === "EscalaWork" && <EscalaWork />}
          {activeComponent === "EscalaOp" && <EscalaOp />}
          {activeComponent === "Story" && <EscalaMensal />}
          {activeComponent === "Midia" && <EscalaMidia />}
          {activeComponent === "Imagem" && <Img />}
        </div>
      </section>
    </main>
  );
};

export default Config;