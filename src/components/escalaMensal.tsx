"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";

interface Evento {
  data: string;
  tipo: string;
  porteiro: string;
  recepcao: string;
}

interface SemanaEscala {
  periodo: string;
  tema: string;
  eventos: Evento[];
}

const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const opcoesTipoEvento = [
  "Doutrina","Santa Ceia","Missão","Família","Celebração","Jovens","Mulheres","Infantil"
];

const opcoesPorteiro = [
  "LIVRE","Pb. Gleidystone","Dc. Cleiton","Aux. Wagner","Aux. Viana","Aux. Joadison","Aux. Davi","Aux. Paulo","Aux. Antonilson"
];

const opcoesRecepcao = [
  "LIVRE","Ir. Natalia","Ir. Victoria","Ir. Daniele","Ir. Rebeca","Ir. Iris","Ir.Ruthe","Ir. Eloisa"
];

export default function EscalaMensal() {
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
        eventos.push({ data: toISO(quinta), tipo: "Doutrina", porteiro: "", recepcao: "" });
      }

      const domingo = new Date(atual);
      domingo.setDate(atual.getDate() + 6);
      if (domingo.getMonth() === mesIndex) {
        eventos.push({ data: toISO(domingo), tipo: "", porteiro: "", recepcao: "" });
      }

      semanas.push({
        periodo: `${formatarPeriodo(atual)} a ${formatarPeriodo(fim)}`,
        tema: "",
        eventos: eventos.length ? eventos : [{ data:"",tipo:"",porteiro:"",recepcao:"" }]
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
                { data: "", tipo: "", porteiro: "", recepcao: "" }
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
          <div ref={captureRef} className="bg-white p-8 rounded shadow space-y-6">
            <h2 className="text-3xl font-bold text-center">Escala – {mes.toUpperCase()}</h2>

            {/* Cabeçalho com Versículo */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-orange-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-2xl text-orange-400"></span>
                </div>
              </div>
              
              <p className="text-lg italic text-gray-700 mb-2 leading-none block">
                &ldquo;Não se esqueçam da hospitalidade; foi praticando-a que, sem o saber, alguns acolheram anjos.&rdquo;
              </p>
              <p className="text-xl text-gray-900 font-semibold leading-none block">Hebreus 13:2</p>
              
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-orange-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-6 text-3xl text-orange-600"></span>
                </div>
              </div>
            </div>

            {escala.map((semana, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="flex bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 text-3xl font-bold">
                  Semana {semana.periodo}
                  {!modoPreview ? (
                    <select
                      value={semana.tema}
                      onChange={(e) => {
                        const novaEscala = [...escala];
                        novaEscala[i].tema = e.target.value;
                        setEscala(novaEscala);
                      }}
                      className="ml-2 text-3xl min-w-[300px] max-w-[450px] font-bold text-white bg-transparent text-left border-0 leading-tight appearance-none focus:outline-none cursor-pointer"
                    >
                      <option className="text-black" value="">
                        Selecione o tema
                      </option>
                      <option className="text-black" value="Conjunto de Senhoras">
                        Conjunto de Senhoras
                      </option>
                      <option className="text-black" value="Conjunto de Jovens">
                        Conjunto de Jovens
                      </option>
                    </select>
                  ) : (
                    <div className="ml-2 text-2xl font-bold">
                      {semana.tema || "—"}
                    </div>
                  )}

                  {!modoPreview && (
                    <button
                      onClick={() => removerSemana(i)}
                      className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                    >
                      🗑 Remover semana
                    </button>
                  )}
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-orange-50 to-white">
                  {semana.eventos.map((ev, j) => (
                    <div key={j} className="rounded-xl p-3 space-y-2 border border-orange-100">

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
                        <p className="text-4xl font-semibold">{ev.tipo} – {ddmm(ev.data)}</p>
                      )}

                      {/* PORTEIRO */}
                      {!modoPreview ? (
                        <select value={ev.porteiro} onChange={e=>{
                          const n=[...escala]; n[i].eventos[j].porteiro=e.target.value; setEscala(n);
                        }} className="border rounded px-2 w-full">
                          {opcoesPorteiro.map(o=><option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <p className="text-3xl">Porteiro: {ev.porteiro}</p>
                      )}

                      {/* RECEPÇÃO */}
                      {!modoPreview ? (
                        <select value={ev.recepcao} onChange={e=>{
                          const n=[...escala]; n[i].eventos[j].recepcao=e.target.value; setEscala(n);
                        }} className="border rounded px-2 w-full">
                          {opcoesRecepcao.map(o=><option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <p className="text-3xl">Recepção: {ev.recepcao}</p>
                      )}

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
              <p className="text-black italic leading-none block">
                &ldquo;Tudo quanto fizerdes, fazei-o de todo o coração, como para o Senhor e não para homens.&rdquo;
              </p>
              <p className="text-black font-semibold mt-2 leading-none block">Colossenses 3:23</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
