"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";

interface Aniversariante {
  nome: string;
  data: string;
  mes: number;
  dia: number;
}

interface MesRange {
  mesInicio: number;
  mesFim: number;
}

export default function Niver() {
  const captureRef = useRef<HTMLDivElement>(null);
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>([]);
  const [loading, setLoading] = useState(false);
  const [modoPreview, setModoPreview] = useState(false);
  const [mesRange, setMesRange] = useState<MesRange>({
    mesInicio: new Date().getMonth() + 1,
    mesFim: (new Date().getMonth() + 3) % 12 || 12
  });
  const [passagensBiblicas, setPassagensBiblicas] = useState<string[]>([
    "Salmos 118:24 - Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.",
    "Jeremias 29:11 - Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
    "Salmos 20:4 - Que ele te conceda o desejo do teu coração e leve a efeito todos os teus planos.",
    "Números 6:24-26 - O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e te conceda graça; o Senhor volte para ti o seu rosto e te dê paz.",
    "Filipenses 1:3 - Dou graças ao meu Deus todas as vezes que me lembro de vocês."
  ]);

  /* ================= BUSCAR CALENDÁRIO ICS ================= */
  const buscarAniversariantes = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api');
      
      if (response.ok) {
        const icsData = await response.text();
        processarICSData(icsData);
      } else {
        throw new Error('API route não disponível');
      }
    } catch (apiError) {
      console.log('Usando fallback para dados de exemplo:', apiError);
    } finally {
      setLoading(false);
    }
  }, [mesRange]);

  const processarICSData = (icsData: string) => {
    const aniversariantesEncontrados: Aniversariante[] = [];
    const lines = icsData.split('\n');
    
    let currentEvent: { summary?: string; dtstart?: string } = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === 'BEGIN:VEVENT') {
        currentEvent = {};
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8);
      } else if (line.startsWith('DTSTART;VALUE=DATE:') || line.startsWith('DTSTART:')) {
        const dateLine = line.startsWith('DTSTART;VALUE=DATE:') 
          ? line.substring(19) 
          : line.substring(8);
        currentEvent.dtstart = dateLine;
      } else if (line === 'END:VEVENT') {
        if (currentEvent.summary && currentEvent.dtstart) {
          const nome = currentEvent.summary
            .replace(/\\/g, '')
            .trim();
          
        if (nome.toUpperCase().startsWith('SEDE')) {
          currentEvent = {};
          continue;
        }

        const isAniversario = 
            nome.toLowerCase().includes('aniversário') ||
            nome.toLowerCase().includes('aniversario')

        if (isAniversario) {
          let nomeLimpo = nome
            .replace(/Aniversário de /i, '')
            .replace(/Aniversário /i, '')
            .replace(/\s*\d{1,2}\/\d{1,2}$/, '')
            .replace(/\s*-\s*\d{1,2}\/\d{1,2}$/, '')
            .trim();
          
          if (!nomeLimpo) {
            nomeLimpo = nome.replace(/\s*\d{1,2}\/\d{1,2}$/, '').trim();
          }
        
            const dataStr = currentEvent.dtstart;
            const ano = parseInt(dataStr.substring(0, 4));
            const mes = parseInt(dataStr.substring(4, 6));
            const dia = parseInt(dataStr.substring(6, 8));
            
          // Verificar se está no range de meses
          if (mes >= mesRange.mesInicio && mes <= mesRange.mesFim) {
            aniversariantesEncontrados.push({
              nome,
              data: `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}`,
              mes,
              dia
            });
          }
        }}
        currentEvent = {};
      }
    }
    
    // Ordenar por mês e dia
    aniversariantesEncontrados.sort((a, b) => {
      if (a.mes === b.mes) {
        return a.dia - b.dia;
      }
      return a.mes - b.mes;
    });
    
    setAniversariantes(aniversariantesEncontrados);
  };


  useEffect(() => {
    buscarAniversariantes();
  }, [buscarAniversariantes]);

  /* ================= GERAR IMAGEM ================= */
  const gerarImagem = async () => {
    setModoPreview(true);
    setTimeout(async () => {
      if (!captureRef.current) return;
      const canvas = await html2canvas(captureRef.current, { 
        scale: 2, 
        backgroundColor: "#fff",
        width: 1240, // A4 em pixels (3508x2480 em 300 DPI, ajustado para tela)
        height: 1754,
        useCORS: true
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `aniversariantes-${mesRange.mesInicio}-a-${mesRange.mesFim}.png`;
      link.click();
      setModoPreview(false);
    }, 500);
  };

  /* ================= RENDERIZAÇÃO ================= */
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-900">
          Aniversariantes do Trimestre
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Gere uma bela imagem com os aniversariantes do período selecionado
        </p>

        {/* Controles */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês Inicial
              </label>
              <select
                value={mesRange.mesInicio}
                onChange={(e) => setMesRange(prev => ({ ...prev, mesInicio: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {meses.map((mes, index) => (
                  <option key={index} value={index + 1}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês Final
              </label>
              <select
                value={mesRange.mesFim}
                onChange={(e) => setMesRange(prev => ({ ...prev, mesFim: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {meses.map((mes, index) => (
                  <option key={index} value={index + 1}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={buscarAniversariantes}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Buscando...
                </>
              ) : (
                '↻ Atualizar Lista'
              )}
            </button>

            <button
              onClick={gerarImagem}
              disabled={aniversariantes.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              📸 Gerar Imagem A4
            </button>
          </div>
        </div>

        {/* Preview da Imagem A4 */}
        {modoPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Preview da Imagem</h3>
                <button
                  onClick={() => setModoPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <div className="border-2 border-dashed border-gray-300 p-2">
                  <div ref={captureRef} className="bg-white">
                    {/* Layout A4 - 210x297mm proporção */}
                    <div 
                      className="relative bg-gradient-to-br from-blue-50 to-orange-50 p-12"
                      style={{
                        width: '1240px',
                        height: '1754px',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Decoração */}
                      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-500 to-orange-500"></div>
                      <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-orange-500 to-blue-500"></div>
                      
                      {/* Conteúdo Principal */}
                      <div className="flex flex-col items-center justify-center h-full">
                        {/* Título Principal */}
                        <div className="text-center mb-12">
                          <h1 className="text-6xl font-bold text-blue-900 mb-4">
                            🎉 PARABÉNS! 🎂
                          </h1>
                          <div className="text-4xl font-semibold text-orange-600 mb-2">
                            Aniversariantes de
                          </div>
                          <div className="text-5xl font-bold text-blue-800">
                            {meses[mesRange.mesInicio - 1]} a {meses[mesRange.mesFim - 1]}
                          </div>
                        </div>

                        {/* Lista de Aniversariantes */}
                        <div className="w-full max-w-4xl mb-16">
                          <div className="grid grid-cols-2 gap-8">
                            {aniversariantes.map((pessoa, index) => (
                              <div 
                                key={index} 
                                className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 border-l-4 border-blue-500"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {pessoa.dia}
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">{meses[pessoa.mes - 1]}</div>
                                    <div className="text-2xl font-bold text-gray-800">{pessoa.nome}</div>
                                    <div className="text-lg text-blue-600 font-semibold">Data: {pessoa.data}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Passagens Bíblicas */}
                        <div className="w-full max-w-5xl">
                          <h2 className="text-4xl font-bold text-center text-blue-900 mb-8">
                            🕊️ Bênçãos para Você
                          </h2>
                          <div className="space-y-6">
                            {passagensBiblicas.map((passagem, index) => (
                              <div 
                                key={index} 
                                className="bg-gradient-to-r from-blue-100 to-orange-100 p-6 rounded-2xl border border-blue-200"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="text-3xl text-blue-600 mt-1">✝️</div>
                                  <div>
                                    <div className="text-lg italic text-gray-700 leading-relaxed">
                                      "{passagem.split(' - ')[1]}"
                                    </div>
                                    <div className="text-right mt-2 text-blue-800 font-semibold">
                                      {passagem.split(' - ')[0]}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rodapé */}
                        <div className="mt-16 text-center text-gray-600">
                          <div className="text-2xl font-semibold mb-2">
                            Que Deus abençoe cada aniversariante!
                          </div>
                          <div className="text-lg">
                            🎈 Que este novo ano de vida seja repleto de alegrias e conquistas! 🎈
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista Normal (não capturada) */}
        {!modoPreview && aniversariantes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {aniversariantes.length} Aniversariantes Encontrados
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aniversariantes.map((pessoa, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {pessoa.dia}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{pessoa.nome}</div>
                      <div className="text-sm text-gray-600">
                        {meses[pessoa.mes - 1]} - {pessoa.data}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!modoPreview && aniversariantes.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum aniversariante encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os meses ou verifique o calendário
            </p>
          </div>
        )}
      </div>
    </div>
  );
}