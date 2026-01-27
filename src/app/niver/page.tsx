"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";

interface Aniversariante {
  nome: string;
  data: string;
  mes: number;
  dia: number;
  dataCompleta: string;
}

interface ApiResponse {
  aniversariantes: Aniversariante[];
  meses: number[];
  total: number;
}

export default function Niver() {
  const captureRef = useRef<HTMLDivElement>(null);
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [mesesSelecionados, setMesesSelecionados] = useState<number[]>([
    new Date().getMonth() + 1,
    (new Date().getMonth() + 1) % 12 + 1,
    (new Date().getMonth() + 2) % 12 + 1
  ]);
  const [loading, setLoading] = useState(false);
  const [modoPreview, setModoPreview] = useState(false);
  const [totalAniversariantes, setTotalAniversariantes] = useState(0);

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const buscarAniversariantes = useCallback(async () => {
    setLoading(true);
    
    try {
      const mesesParam = mesesSelecionados.join(',');
      const response = await fetch(`/api?meses=${mesesParam}`);
      
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setAniversariantes(data.aniversariantes);
        setTotalAniversariantes(data.total);
      
        if (data.meses.length > 0) {
          setMesesSelecionados(data.meses);
        }
      } else {
        throw new Error('Erro ao buscar aniversariantes');
      }
    } catch (apiError) {
      console.error('Erro:', apiError);
    } finally {
      setLoading(false);
    }
  }, [mesesSelecionados]);

  const toggleMes = (mes: number) => {
    setMesesSelecionados(prev => {
      if (prev.includes(mes)) {
        if (prev.length <= 3) {
          return prev.filter(m => m !== mes);
        }
        return prev.filter(m => m !== mes);
      } else {
        if (prev.length >= 3) {
          const novosMeses = [...prev.slice(1), mes];
          return novosMeses.sort((a, b) => a - b);
        }
        const novosMeses = [...prev, mes].sort((a, b) => a - b);
        return novosMeses;
      }
    });
  };

  const selecionarTrimestre = (mesInicio: number) => {
    const trimestre = [];
    for (let i = 0; i < 3; i++) {
      const mes = (mesInicio + i - 1) % 12 + 1;
      trimestre.push(mes);
    }
    setMesesSelecionados(trimestre.sort((a, b) => a - b));
  };

  const gerarImagem = async () => {
    setModoPreview(true);
    setTimeout(async () => {
      if (!captureRef.current) return;
      const canvas = await html2canvas(captureRef.current, { 
        scale: 2, 
        backgroundColor: "#fff",
        width: 1240,
        height: 1754,
        useCORS: true
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      const mesesNomes = mesesSelecionados.map(m => meses[m-1]).join('-');
      link.download = `aniversariantes-${mesesNomes}.png`;
      link.click();
      setModoPreview(false);
    }, 500);
  };

  const aniversariantesPorMes = mesesSelecionados.reduce((acc, mes) => {
    acc[mes] = aniversariantes.filter(a => a.mes === mes);
    return acc;
  }, {} as Record<number, Aniversariante[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Aniversariantes
          </h1>
          
          <div className="mb-6 md:mb-8">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Trimestres Rápidos:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 4, 7, 10].map(mesInicio => (
                  <button
                    key={mesInicio}
                    onClick={() => selecionarTrimestre(mesInicio)}
                    className="px-3 py-1 md:px-4 md:py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-lg transition"
                  >
                    {meses[mesInicio-1]} a {meses[(mesInicio+1)%12]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-4">
              {meses.map((mes, index) => {
                const mesNumero = index + 1;
                const isSelecionado = mesesSelecionados.includes(mesNumero);
                return (
                  <button
                    key={mesNumero}
                    onClick={() => toggleMes(mesNumero)}
                    className={`
                      p-2 md:p-3 rounded-lg text-center transition-all duration-200
                      ${isSelecionado 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                        : 'bg-white hover:bg-gray-100 text-gray-700 shadow'
                      }
                    `}
                  >
                    <div className="text-xs md:text-sm font-semibold">{mes.substring(0, 3)}</div>
                  </button>
                );
              })}
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Meses Selecionados:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {mesesSelecionados.map(mes => (
                  <div 
                    key={mes}
                    className="px-3 py-1 bg-blue-100 text-blue-800 font-semibold rounded-full flex items-center gap-2"
                  >
                    <span>{meses[mes-1]}</span>
                    <button 
                      onClick={() => toggleMes(mes)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selecione exatamente 3 meses
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={buscarAniversariantes}
                disabled={loading}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition shadow-md text-white
                  ${loading ? 'bg-gray-400 cursor-not-allowed'
                    :'bg-blue-600 hover:bg-blue-700 '
                  }`}
                  >
                {loading ? 'Carregando...' : 'Atualizar Lista'}
              </button>
              
              <button
                onClick={gerarImagem}
                className="px-6 py-2 rounded-lg font-semibold transition shadow-md bg-green-600 hover:bg-green-700 text-white">
                Gerar Imagem
              </button>
            </div>
          </div>
          
          {loading && (
            <div className="text-blue-600 font-semibold">
              Buscando aniversariantes...
            </div>
          )}
        </header>

        {/* Preview para Captura */}
        {modoPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-2xl">
              <p className="text-gray-800">
                Gerando imagem dos meses {mesesSelecionados.map(m => meses[m-1]).join(', ')}...
              </p>
            </div>
          </div>
        )}

        {/* Conteúdo para Captura */}
        <div 
          ref={captureRef} 
          className={`bg-white shadow-2xl rounded-2xl overflow-hidden ${modoPreview ? '' : 'p-4 md:p-8'}`}
        >
          {/* Título do Período */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              Aniversariantes
            </h2>
            <p className="text-xl md:text-2xl opacity-90">
              {mesesSelecionados.map(m => meses[m-1]).join(' • ')}
            </p>
            <p className="text-lg mt-4 opacity-80">
              {totalAniversariantes} {totalAniversariantes === 1 ? 'aniversariante' : 'aniversariantes'} encontrados
            </p>
          </div>

          {/* Lista de Aniversariantes por Mês */}
          <div className="px-4 md:px-12 mb-12">
            {aniversariantes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-500">
                  Nenhum aniversariante encontrado para os meses selecionados
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {mesesSelecionados.map(mes => {
                  const aniversariantesDoMes = aniversariantesPorMes[mes];
                  if (!aniversariantesDoMes || aniversariantesDoMes.length === 0) return null;
                  
                  return (
                    <div key={mes} className="mb-8">
                      <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 py-4 px-6 rounded-xl mb-6 shadow-md z-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                          {meses[mes-1]}
                          <span className="ml-4 text-lg text-gray-600 font-normal">
                            ({aniversariantesDoMes.length} {aniversariantesDoMes.length === 1 ? 'aniversariante' : 'aniversariantes'})
                          </span>
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        {aniversariantesDoMes.map((pessoa, index) => (
                          <div 
                            key={`${mes}-${index}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-200 hover:bg-blue-50 px-4 rounded-lg transition"
                          >
                            <div className="flex items-center mb-2 sm:mb-0">
                              <div>
                                <h4 className="text-xl md:text-2xl font-bold text-gray-800">
                                  {pessoa.nome}
                                </h4>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg md:text-xl font-semibold text-purple-600">
                                {pessoa.dia} de {meses[pessoa.mes - 1]}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

         <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 text-center">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">
              O Senhor te abençoe e te guarde; 
              o Senhor faça resplandecer o seu rosto sobre ti e te conceda graça; 
              o Senhor volte para ti o seu rosto e te dê paz.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">Números 6:24-26</p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 bg-white rounded-xl p-4 md:p-6 shadow-lg">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Estatísticas do Período
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl md:text-4xl font-bold text-blue-600">{totalAniversariantes}</p>
              <p className="text-gray-600 text-sm">Total</p>
            </div>
            {mesesSelecionados.map(mes => {
              const count = aniversariantesPorMes[mes]?.length || 0;
              return (
                <div key={mes} className="text-center p-3 md:p-4 bg-purple-50 rounded-lg">
                  <p className="text-xl md:text-3xl font-bold text-purple-600">{count}</p>
                  <p className="text-gray-600 text-sm">{meses[mes-1]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}