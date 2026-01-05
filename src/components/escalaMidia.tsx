"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";

interface Evento {
  data: string;
  tipo: string;
  foto: string;
  projetor: string;
  som: string;
}

interface SemanaEscala {
  periodo: string;
  tema: string;
  eventos: Evento[];
}

const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const opcoesTipoEvento = [
  "Doutrina","Santa Ceia","Missão","Família",
  "Celebração","Jovens","Mulheres","Infantil"
];

const opcoesFotos = [
  "Victoria","Rebeca","Daniele","Antonilson",
  "none"
];

const opcoesProjetor = [
  "Joadison","Victoria","Rebeca","Daniele",
  "Antonilson","Samuele"
];

const opcoesSom = [
  "Joadison","Samuele"
];

const coresPorTipo: Record<string, string> = {
  Doutrina: "text-orange-500",
  Missão: "text-green-500",
  Família: "text-blue-500",
  Celebração: "text-purple-500",
  Jovens: "text-pink-500",
  Mulheres: "text-rose-500 ",
  Infantil: "text-yellow-400",
  "Santa Ceia": "text-red-600",
};


export default function EscalaMidia() {
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("2026");
  const [escala, setEscala] = useState<SemanaEscala[]>([]);
  const [modoPreview, setModoPreview] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const toISO = (d: Date) => d.toISOString().split("T")[0];
  const ddmm = (v: string) =>
    v ? `${v.split("-")[2]}/${v.split("-")[1]}` : "";

  const formatarPeriodo = (d: Date) =>
    `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;

  const gerarSemanasDoMes = useCallback(() => {
    if (!mes) return;

    const mesIndex = meses.indexOf(mes);
    const anoNum = Number(ano);

    const primeiro = new Date(anoNum, mesIndex, 1);
    const ultimo = new Date(anoNum, mesIndex + 1, 0);

    let inicio = new Date(primeiro);
    const diaSemana = inicio.getDay();
    if (diaSemana !== 1) {
      inicio.setDate(inicio.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
    }

    const semanas: SemanaEscala[] = [];
    let atual = new Date(inicio);

    while (semanas.length < 5) {
      const fim = new Date(atual);
      fim.setDate(atual.getDate() + 6);

      const eventos: Evento[] = [];

      const quinta = new Date(atual);
      quinta.setDate(atual.getDate() + 3);
      if (quinta.getMonth() === mesIndex) {
        eventos.push({ data: toISO(quinta), tipo: "Doutrina", foto: "none", projetor: "", som: "" });
      }

      const domingo = new Date(atual);
      domingo.setDate(atual.getDate() + 6);
      if (domingo.getMonth() === mesIndex) {
        eventos.push({ data: toISO(domingo), tipo: "", foto: "", projetor: "", som: "" });
      }

      semanas.push({
        periodo: `${formatarPeriodo(atual)} a ${formatarPeriodo(fim)}`,
        tema: "",
        eventos: eventos.length ? eventos : [{ data:"",tipo:"", foto: "", projetor: "", som: ""}]
      });

      atual.setDate(atual.getDate() + 7);
      if (atual > ultimo) break;
    }

    setEscala(semanas);
  }, [mes, ano]);

  useEffect(() => {
    gerarSemanasDoMes();
  }, [gerarSemanasDoMes]);

  const removerSemana = (index: number) => {
    setEscala(prev => prev.filter((_, i) => i !== index));
  };

  const adicionarEvento = (semanaIndex: number) => {
    setEscala(prev =>
      prev.map((semana, i) =>
        i === semanaIndex
          ? {
              ...semana,
              eventos: [
                ...semana.eventos,
                { data: "", tipo: "",  foto: "", projetor: "", som: ""  }
              ]
            }
          : semana
      )
    );
  };

  const removerEvento = (semanaIndex: number, eventoIndex: number) => {
    setEscala(prev =>
      prev.map((semana, i) =>
        i === semanaIndex
          ? {
              ...semana,
              eventos: semana.eventos.filter((_, j) => j !== eventoIndex)
            }
          : semana
      )
    );
  };

  /* ================= CAPTURA ================= */

  const gerarImagem = async () => {
    setModoPreview(true);
    setTimeout(async () => {
      if (!captureRef.current) return;
      const canvas = await html2canvas(captureRef.current, { scale: 2, backgroundColor: "#fff" });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `escala-${mes}-${ano}.png`;
      link.click();
    }, 300);
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-6">Gerador de Escala Mensal</h1>

        {/* CONTROLES */}
        <div className="bg-white p-6 rounded shadow mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={mes} onChange={e=>setMes(e.target.value)} className="border rounded p-2">
              <option value="">Selecione o mês</option>
              {meses.map(m=> <option key={m}>{m}</option>)}
            </select>

            <input type="number" value={ano} onChange={e=>setAno(e.target.value)} className="border rounded p-2"/>

            <div className="flex gap-2">
              <button onClick={()=>setModoPreview(false)} className={`px-4 py-2 rounded ${!modoPreview?"bg-blue-600 text-white":"bg-gray-200"}`}>✏️ Editar</button>
              <button onClick={()=>setModoPreview(true)} className={`px-4 py-2 rounded ${modoPreview?"bg-green-600 text-white":"bg-gray-200"}`}>👁 Preview</button>
            </div>
          </div>

          <button onClick={gerarImagem} disabled={!mes} className="w-full bg-orange-700 text-white py-3 rounded">
            Gerar Imagem
          </button>
        </div>

        {/* ESCALA */}
        {mes && (
          <div ref={captureRef} className="bg-white p-8 rounded shadow">
            <h2 className="text-4xl font-bold text-center">Escala Mídia</h2>
            <h2 className="text-3xl font-extralight text-center mb-6">Mês: {mes.toUpperCase()}</h2>

            {escala.map((semana, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden 
                ${modoPreview ? "flex justify-center items-center": ""}`}>

                {!modoPreview && (
                    <button
                        onClick={() => removerSemana(i)}
                        className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                    >
                        🗑 Remover semana
                    </button>
                )}
               
                <div className="grid">
                  {semana.eventos.map((ev, j) => (
                    <div key={j} className={`rounded-xl p-3 w-[40rem]`}>

                      {/* TIPO + DATA */}
                      {!modoPreview ? (
                        <div className="flex gap-2">
                          <select value={ev.tipo} onChange={e=>{
                            const n=[...escala]; n[i].eventos[j].tipo=e.target.value; setEscala(n);
                          }} className="border rounded px-2">
                            <option value="">Tipo</option>
                            {opcoesTipoEvento.map(o=><option key={o}>{o}</option>)}
                          </select>

                          <input type="date" value={ev.data} onChange={e=>{
                            const n=[...escala]; n[i].eventos[j].data=e.target.value; setEscala(n);
                          }} className="border rounded px-2"/>
                        </div>
                      ) : (
                        <p className={`text-3xl font-bold ${modoPreview ? coresPorTipo[ev.tipo] ?? "text-black": "text-gray-50"}`}>{ev.tipo} – {ddmm(ev.data)}</p>
                      )}

                      <div className="flex gap-8">
                        {!modoPreview ? (
                            <select value={ev.foto} onChange={e=>{
                            const n=[...escala]; n[i].eventos[j].foto=e.target.value; setEscala(n);
                            }} className="border rounded px-2 w-full">
                            <option value="">Selecione</option>
                            {opcoesFotos.map(o=><option key={o}>{o}</option>)}
                            </select>
                        ) : (
                            ev.foto === "none" ? (<></>):(<p className="text-2xl">Foto: {ev.foto}</p>)
                        )}

                        {!modoPreview ? (
                            <select value={ev.projetor} onChange={e=>{
                            const n=[...escala]; n[i].eventos[j].projetor=e.target.value; setEscala(n);
                            }} className="border rounded px-2 w-full">
                            <option value="">Selecione</option>
                            {opcoesProjetor.map(o=><option key={o}>{o}</option>)}
                            </select>
                        ) : (
                            <p className="text-2xl">Projetor: {ev.projetor}</p>
                        )}
                      </div>

                      
                      {/* {!modoPreview ? (
                        <select value={ev.som} onChange={e=>{
                          const n=[...escala]; n[i].eventos[j].som=e.target.value; setEscala(n);
                        }} className="border rounded px-2 w-full">
                          {opcoesSom.map(o=><option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <p>Som: {ev.som}</p>
                      )} */}


                      {!modoPreview && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => removerEvento(i, j)}
                            className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          >
                            🗑 Remover
                          </button>
                        </div>
                      )}
                    </div>                    
                  ))}
                  {!modoPreview && (
                    <button
                        onClick={() => adicionarEvento(i)}
                        className="md:col-span-2 mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                    >
                        ➕ Adicionar evento
                    </button>
                    )}
                </div>
              </div>
            ))}
            <div className="text-center mt-12 pt-8 border-t border-orange-200">
              <p className="text-black  bg-yellow-300 italic leading-none block">
                &ldquo;OBSERVAÇÕES Nos dias que o Samuel estiver no projetor, Joadison fica no som e dá auxilio a ele também no projetor.&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
