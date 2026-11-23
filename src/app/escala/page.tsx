"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EscalaPeriodoTab } from "@/components/escalas/escala-periodo-tab";
import { ESCALAS } from "@/lib/escalas-periodo";
import { TabCultos } from "@/components/tab-cultos";

const ABAS = [
  { value: "escala", label: "Escala" },
  { value: "kids", label: "Escala Kids" },
  { value: "ebd", label: "Escala EBD" },
  { value: "midia", label: "Escala Mídia" },
] as const;

// forceMount: as abas continuam montadas (edições não se perdem ao trocar); cada uma tem a sua pré-visualização.
const MANTER = "data-[state=inactive]:hidden";

export default function EscalaPage() {
  const [aba, setAba] = useState<string>("escala");
  const refs = {
    escala: useRef<HTMLDivElement>(null),
    kids: useRef<HTMLDivElement>(null),
    ebd: useRef<HTMLDivElement>(null),
    midia: useRef<HTMLDivElement>(null),
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center gap-3">
        <Link href="/editor">
          <Button size="icon" aria-label="Voltar ao calendario">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">Gerar Escala</h1>
          <p className="text-sm text-muted-foreground">Monte as escalas, sincronize com o Calendário e exporte como imagem</p>
        </div>
      </header>

      <Tabs value={aba} onValueChange={setAba}>
        <TabsList>
          {ABAS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="escala" forceMount className={MANTER}>
          <TabCultos previewRef={refs.escala} />
        </TabsContent>

        {(["kids", "ebd", "midia"] as const).map((tipo) => (
          <TabsContent key={tipo} value={tipo} forceMount className={MANTER}>
            <EscalaPeriodoTab config={ESCALAS[tipo]} ativo={aba === tipo} previewRef={refs[tipo]} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}