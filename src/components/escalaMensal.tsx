"use client";

import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";

interface SemanaEscala {
  periodo: string;
  tema: string;
  eventos: {
    data: string;
    tipo: string;
    porteiro: string;
    recepcao: string;
  }[];
}

const EscalaMensal = () => {
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("2026");
  const [escala, setEscala] = useState<SemanaEscala[]>([]);
  const [ocult, setOcult] = useState(false);

  const captureRef = useRef(null);

  // Gerar semanas automaticamente quando o mês ou ano mudar
  useEffect(() => {
    if (mes) {
      gerarSemanasDoMes();
    }
  }, [mes]);

  const gerarSemanasDoMes = () => {
    if (!mes) return;

    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    
    const mesIndex = meses.indexOf(mes);
    const anoNum = parseInt(ano);
    
    // Primeiro dia do mês
    const primeiroDia = new Date(anoNum, mesIndex, 1);
    
    // Último dia do mês
    const ultimoDia = new Date(anoNum, mesIndex + 1, 0);
    
    // Ajustar para começar na segunda-feira
    let dataInicio = new Date(primeiroDia);
    const diaSemana = dataInicio.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    
    // Se não for segunda-feira, voltar para a segunda-feira anterior
    if (diaSemana !== 1) {
      const diasParaVoltar = diaSemana === 0 ? 6 : diaSemana - 1;
      dataInicio.setDate(dataInicio.getDate() - diasParaVoltar);
    }
    
    const semanas: SemanaEscala[] = [];
    let dataAtual = new Date(dataInicio);
    
    // Gerar semanas até cobrir todo o mês
    while (dataAtual <= ultimoDia || semanas.length < 4) {
      // Data final da semana (domingo)
      const dataFim = new Date(dataAtual);
      dataFim.setDate(dataAtual.getDate() + 6);
      
      // Formatar período
      const periodo = `${formatarData(dataAtual)} a ${formatarData(dataFim)}`;
      
      // Criar eventos padrão
      const eventos = [];
      
      // Adicionar evento de quinta-feira (Doutrina)
      const dataQuinta = new Date(dataAtual);
      dataQuinta.setDate(dataAtual.getDate() + 3); // Quinta é 3 dias após segunda
      
      if (dataQuinta.getMonth() === mesIndex) {
        eventos.push({
          data: formatarDataDDMM(dataQuinta),
          tipo: "",
          porteiro: "",
          recepcao: "",
        });
      }
      
      // Adicionar evento de domingo (Culto)
      const dataDomingo = new Date(dataAtual);
      dataDomingo.setDate(dataAtual.getDate() + 6); // Domingo é 6 dias após segunda
      
      if (dataDomingo.getMonth() === mesIndex) {
        eventos.push({
          data: formatarDataDDMM(dataDomingo),
          tipo: "",
          porteiro: "",
          recepcao: "",
        });
      }
      
      semanas.push({
        periodo,
        tema: "",
        eventos: eventos.length > 0 ? eventos : [{
          data: "",
          tipo: "",
          porteiro: "",
          recepcao: "",
        }]
      });
      
      // Ir para próxima semana (próxima segunda)
      dataAtual.setDate(dataAtual.getDate() + 7);
      
      // Limitar a 5 semanas
      if (semanas.length >= 5) break;
    }
    
    setEscala(semanas);
  };

  const formatarData = (data: Date): string => {
    const dia = data.getDate();
    const mesNum = data.getMonth() + 1;
    return `${dia.toString().padStart(2, '0')}/${mesNum.toString().padStart(2, '0')}`;
  };

  const formatarDataDDMM = (data: Date): string => {
    const dia = data.getDate();
    const mesNum = data.getMonth() + 1;
    return `${dia.toString().padStart(2, '0')}/${mesNum.toString().padStart(2, '0')}`;
  };

  const handleCaptureClick = async () => {
    setOcult(true); // Oculta os botões
    
    // Aguarda um pouco para garantir que o DOM foi atualizado
    setTimeout(async () => {
      if (captureRef.current) {
        try {
          await document.fonts.ready;

          const canvas = await html2canvas(captureRef.current, {
            backgroundColor: "#ffffff",
            scale: 2
          });

          const imgData = canvas.toDataURL("image/png", 1.0);
          const link = document.createElement("a");
          link.href = imgData;
          link.download = `escala-${mes.toLowerCase()}-${ano}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          
        } catch (error) {
          console.error("Erro ao baixar imagem:", error);
        }
      }
      
      // Opcional: Reexibir os botões após o download
      setTimeout(() => {
        setOcult(false);
      }, 1000);
      
    }, 100); // 100ms para garantir que o DOM foi atualizado
  };

  const adicionarSemana = () => {
    const novaSemana: SemanaEscala = {
      periodo: "",
      tema: "",
      eventos: [
        {
          data: "",
          tipo: "",
          porteiro: "",
          recepcao: "",
        },
      ],
    };
    setEscala([...escala, novaSemana]);
  };

  const adicionarEvento = (semanaIndex: number) => {
    const novaEscala = [...escala];
    novaEscala[semanaIndex].eventos.push({
      data: "",
      tipo: "",
      porteiro: "",
      recepcao: "",
    });
    setEscala(novaEscala);
  };

  const removerSemana = (semanaIndex: number) => {
    const novaEscala = escala.filter((_, index) => index !== semanaIndex);
    setEscala(novaEscala);
  };

  const removerEvento = (semanaIndex: number, eventoIndex: number) => {
    const novaEscala = [...escala];
    novaEscala[semanaIndex].eventos = novaEscala[semanaIndex].eventos.filter(
      (_, index) => index !== eventoIndex
    );
    setEscala(novaEscala);
  };

  const atualizarCampo = (
    semanaIndex: number,
    campo: keyof SemanaEscala,
    valor: string
  ) => {
    const novaEscala = [...escala];
    if (campo === "periodo" || campo === "tema") {
      novaEscala[semanaIndex][campo] = valor;
    }
    setEscala(novaEscala);
  };

  const atualizarEvento = (
    semanaIndex: number,
    eventoIndex: number,
    campo: keyof SemanaEscala["eventos"][0],
    valor: string
  ) => {
    const novaEscala = [...escala];
    novaEscala[semanaIndex].eventos[eventoIndex][campo] = valor;
    setEscala(novaEscala);
  };

  const opcoesPorteiro = [
    "LIVRE",
    "Pb. Gleidystone",
    "Dc. Cleiton",
    "Aux. Wagner",
    "Aux. Viana",
    "Aux. Joadison",
    "Aux. Vitor",
    "Aux. Davi",
  ];

  const opcoesRecepcao = [
    "LIVRE",
    "Ir. Natalia",
    "Ir. Victoria",
    "Ir. Ester",
    "Ir. Rebeca",
    "Ir. Iris",
  ];

  const opcoesTipoEvento = [
    "Doutrina",
    "Santa Ceia",
    "Missão",
    "Família",
    "Celebração",
    "Jovens",
    "Mulheres",
    "Infantil"
  ];

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  function ajustarLargura(el:any) {
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.whiteSpace = "pre";
    span.style.fontSize = getComputedStyle(el).fontSize;
    span.style.fontFamily = getComputedStyle(el).fontFamily;
    span.style.fontWeight = getComputedStyle(el).fontWeight;
    span.innerText = el.value || el.placeholder || "";
    document.body.appendChild(span);

    el.style.width = `${span.offsetWidth + 16}px`;
    document.body.removeChild(span);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-orange-800 mb-8">
          GERADOR DE ESCALA MENSAL
        </h1>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês
              </label>
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione um mês</option>
                {meses.map((mesOption) => (
                  <option key={mesOption} value={mesOption}>
                    {mesOption}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano
              </label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                min="2025"
                max="2100"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={adicionarSemana}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + Adicionar Mês
              </button>
            </div>
          </div>

          <button
            onClick={handleCaptureClick}
            disabled={!mes}
            className={`w-full py-3 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              mes ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {mes ? "GERAR IMAGEM DA ESCALA" : "SELECIONE UM MÊS"}
          </button>
        </div>

        {/* Preview da Escala - Só mostra se tiver mês selecionado */}
        {mes && (
          <div ref={captureRef} className="bg-white rounded-xl shadow-2xl p-8 leading-none block">
            {/* Cabeçalho com Versículo */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-black uppercase mb-6 leading-none block">
                Escala Mensal
              </h2>
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
            
            {/* Título do Mês */}
            <div className="flex text-center my-6 items-center justify-center">
              <div className="py-2 w-1/3 border-2 border-black rounded-md text-center leading-none block">
                <p className="text-2xl font-bold text-black leading-none block h-[42px]">
                  MÊS: {mes.toUpperCase()}  
                </p>
              </div>
            </div>

            {/* Tabela de Escalas */}
            <div className="space-y-4">
              {escala.map((semana, semanaIndex) => (
                <div key={semanaIndex} className="rounded-2xl overflow-hidden">
                  {/* Cabeçalho da Semana */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2 min-h-[40px]">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-white leading-tight h-[59px]">
                            Semana {semana.periodo}:
                          </span>
                          <input
                            type="text"
                            value={semana.tema}
                            onChange={(e) => atualizarCampo(semanaIndex, "tema", e.target.value)}
                            className="text-3xl min-w-[300px] max-w-[450px] font-bold text-white bg-transparent text-left uppercase placeholder-white/70 leading-tight outline-none border-0 h-[30px] pt-1"
                            placeholder="Conjunto da Semana"
                            style={{ lineHeight: '1.2' }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <button
                          onClick={() => removerSemana(semanaIndex)}
                          className={`px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm ${ocult ? 'hidden' : ''}`}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Eventos da Semana */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-white">
                    <div className="grid grid-cols-2 gap-3">
                      {semana.eventos.map((evento, eventoIndex) => (
                        <div key={eventoIndex} className="bg-white rounded-xl p-3 shadow-lg">
                          <div>
                            <div className="mb-6 inline-flex items-center gap-1">
                               <select
                                value={evento.tipo}
                                onChange={(e) => {
                                  atualizarEvento(semanaIndex, eventoIndex, "tipo", e.target.value);
                                  ajustarLargura(e.target);
                                }}
                                onLoad={(e) => ajustarLargura(e.target)}
                                className="h-10 w-auto text-2xl text-left font-semibold text-black appearance-none leading-none block"
                              >
                                <option value="">Selecione</option>
                                {opcoesTipoEvento.map((opcao) => (
                                  <option key={opcao} value={opcao} className="w-auto">
                                    {opcao}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={evento.data}
                                onChange={(e) => atualizarEvento(semanaIndex, eventoIndex, "data", e.target.value)}
                                className="text-2xl font-semibold text-left text-black appearance-none leading-none block"
                                placeholder="DD/MM"
                              />
                            </div>
                            <div className="mb-3 flex items-center gap-1">
                              <div className="ml-1 flex">
                                <label className="text-xl font-semibold text-black leading-none block">
                                  Porteiro:
                                </label>
                                <select
                                  value={evento.porteiro}
                                  onChange={(e) => {
                                    atualizarEvento(semanaIndex, eventoIndex, "porteiro", e.target.value);
                                    ajustarLargura(e.target);
                                  }}
                                  onLoad={(e) => ajustarLargura(e.target)}
                                  className="h-7 text-xl text-left pl-2 font-light text-black appearance-none leading-none block"
                                >
                                  {opcoesPorteiro.map((opcao) => (
                                    <option key={opcao} value={opcao}>
                                      {opcao}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            
                              <div className="ml-4 flex">
                                <label className="text-xl font-semibold text-black leading-none block">
                                  Recepção:
                                </label>
                                <select
                                  value={evento.recepcao}
                                  //onChange={(e) => atualizarEvento(semanaIndex, eventoIndex, "recepcao", e.target.value)}
                                  onChange={(e) => {
                                    atualizarEvento(semanaIndex, eventoIndex, "recepcao", e.target.value);
                                    ajustarLargura(e.target);
                                  }}
                                  className="h-7 text-xl text-left font-light pl-2 text-black appearance-none leading-none block"
                                >
                                  {opcoesRecepcao.map((opcao) => (
                                    <option key={opcao} value={opcao}>
                                      {opcao}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>                      
                          </div>

                          {/* Botões de Ação do Evento */}
                          <div className={`flex justify-end items-center mt-2 pt-4 ${ocult ? 'hidden' : ''}`}>
                            <div className="flex gap-2">
                              <button
                                onClick={() => adicionarEvento(semanaIndex)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              >
                                + Novo Evento
                              </button>
                              {semana.eventos.length > 1 && (
                                <button
                                  onClick={() => removerEvento(semanaIndex, eventoIndex)}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                >
                                  Remover
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 italic leading-none block">
                &ldquo;Tudo quanto fizerdes, fazei-o de todo o coração, como para o Senhor e não para homens.&rdquo;
              </p>
              <p className="text-gray-700 font-semibold mt-2 leading-none block">Colossenses 3:23</p>
            </div>
          </div>
        )}       
      </div>
    </div>
  );
};

export default EscalaMensal;