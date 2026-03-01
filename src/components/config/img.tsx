"use client"

import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

interface TextoPosicao {
  id: string;
  texto: string;
  x: number;
  y: number;
  tamanhoFonte?: number;
  cor?: string;
  tipoFonte?: string;
  negrito?: boolean;
  italico?: boolean;
}

const Img = () => {
  const [mostrarAcoes, setMostrarAcoes] = useState(true);
  const [imagemSelecionada, setImagemSelecionada] = useState<string>("");
  const [textos, setTextos] = useState<TextoPosicao[]>([]);
  const [pregador, setPregador] = useState<string>("");
  const [imagensDisponiveis, setImagensDisponiveis] = useState<string[]>([]);
  const [escalaVisualizacao, setEscalaVisualizacao] = useState<number>(0.5);
  const [imagemDimensoes, setImagemDimensoes] = useState({ width: 0, height: 0 });
  const captureRef = useRef(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Carregar imagens disponíveis
  useEffect(() => {
    const imagens = [
      "2.png",
      "3.png",
      "4.png",
      "5.png",
      "6.png",
    ];
    setImagensDisponiveis(imagens);
    if (imagens.length > 0) {
      setImagemSelecionada(imagens[0]);
    }
  }, []);

  // Carregar dimensões da imagem quando ela carregar
  useEffect(() => {
    if (imgRef.current) {
      const img = imgRef.current;
      const handleLoad = () => {
        setImagemDimensoes({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      
      img.addEventListener('load', handleLoad);
      
      // Se a imagem já está carregada
      if (img.complete) {
        handleLoad();
      }
      
      return () => {
        img.removeEventListener('load', handleLoad);
      };
    }
  }, [imagemSelecionada]);

  // Inicializar posições de texto com base na imagem selecionada
  useEffect(() => {
    if (imagemSelecionada === '2.png') {
      console.log(imagemSelecionada, 'Imagem 2 selecionada');
      const posicoesPadrao: TextoPosicao[] = [
        { 
          id: "pregador", 
          texto: pregador, 
          x: 700, 
          y: 1707, 
          tamanhoFonte: 46, 
          cor: "#FFFFFF",
          tipoFonte: "Oswald",
          negrito: true,
          italico: false
        },
      ];
      setTextos(posicoesPadrao);
    }

    if (imagemSelecionada === '3.png' || imagemSelecionada === '4.png' || imagemSelecionada === '5.png') {
      console.log(imagemSelecionada, 'Imagem 2 selecionada');
      const posicoesPadrao: TextoPosicao[] = [
        { 
          id: "pregador", 
          texto: pregador, 
          x: 450, 
          y: 1660, 
          tamanhoFonte: 46, 
          cor: "#FFFFFF",
          tipoFonte: "Oswald",
          negrito: true,
          italico: false
        },
        
      ];
      setTextos(posicoesPadrao);
    }
  }, [imagemSelecionada, pregador]);

  const handleCaptureClick = async () => {
    setMostrarAcoes(false);
  
    setTimeout(async () => {
      if (captureRef.current) {
        // Remover transformação de escala antes de capturar
        const elemento = captureRef.current as HTMLElement;
        const transformOriginal = elemento.style.transform;
        elemento.style.transform = 'scale(1)';
        
        try {
          const canvas = await html2canvas(elemento, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
          });
          
          const imgData = canvas.toDataURL("image/png", 1.0);
          const link = document.createElement("a");
          link.href = imgData;
          link.download = `img-culto-${new Date().getTime()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } finally {
          // Restaurar transformação
          elemento.style.transform = transformOriginal;
        }
      }
    }, 500);
    
    setTimeout(() => {
      setMostrarAcoes(true);
    }, 1000);
  };

  const handleTextoChange = (id: string, campo: string, valor: any) => {
    setTextos(prev => prev.map(texto => 
      texto.id === id ? { ...texto, [campo]: valor } : texto
    ));
  };

  const handleAdicionarTexto = () => {
    const novoTexto: TextoPosicao = {
      id: `texto-${Date.now()}`,
      texto: "Novo Texto",
      x: 100,
      y: 300,
      tamanhoFonte: 24,
      cor: "#FFFFFF",
      tipoFonte: "Oswald",
      negrito: true,
      italico: false
    };
    setTextos([...textos, novoTexto]);
  };

  const handleRemoverTexto = (id: string) => {
    setTextos(prev => prev.filter(texto => texto.id !== id));
  };

  const tiposFonteDisponiveis = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Oswald",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Poppins"
  ];

  return (
    <div className="flex flex-col justify-center items-center gap-4 m-2 font-oswald">
      {/* Controles */}
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-center">
        <div>
          <label className="block text-sm font-medium mb-1">Nome do Pregador:</label>
          <input
            type="text"
            value={pregador}
            onChange={(e) => setPregador(e.target.value)}
            placeholder="Digite o nome do pregador"
            className="bg-gray-100 border border-gray-300 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f00] w-64"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fundo:</label>
          <select
            value={imagemSelecionada}
            onChange={(e) => setImagemSelecionada(e.target.value)}
            className="bg-gray-100 border border-gray-300 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f00] w-40"
          >
            {imagensDisponiveis.map((img) => (
              <option key={img} value={img}>
                {img.replace('.png', '')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tamanho da Visualização:</label>
          <select
            value={escalaVisualizacao}
            onChange={(e) => setEscalaVisualizacao(parseFloat(e.target.value))}
            className="bg-gray-100 border border-gray-300 py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f00] w-40"
          >
            <option value="0.25">25%</option>
            <option value="0.33">33%</option>
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
          </select>
        </div>
      </div>

      {/* Editor de Textos */}
      {mostrarAcoes && (
        <div className="w-full max-w-6xl mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Editar Textos na Imagem</h3>
            <button
              onClick={handleAdicionarTexto}
              className="bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600 transition-colors"
            >
              + Adicionar Texto
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {textos.map((texto) => (
              <div key={texto.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium">
                    {texto.id.charAt(0).toUpperCase() + texto.id.slice(1)}:
                  </label>
                  {texto.id !== "pregador" && (
                    <button
                      onClick={() => handleRemoverTexto(texto.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕ Remover
                    </button>
                  )}
                </div>
                
                <input
                  type="text"
                  value={texto.texto}
                  onChange={(e) => handleTextoChange(texto.id, 'texto', e.target.value)}
                  className="w-full border border-gray-300 py-2 px-3 rounded mb-3"
                  placeholder="Digite o texto"
                />
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Posição X:</label>
                    <input
                      type="number"
                      value={texto.x}
                      onChange={(e) => handleTextoChange(texto.id, 'x', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 py-1 px-2 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Posição Y:</label>
                    <input
                      type="number"
                      value={texto.y}
                      onChange={(e) => handleTextoChange(texto.id, 'y', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 py-1 px-2 rounded text-sm"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Tamanho da Fonte:</label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={texto.tamanhoFonte || 24}
                    onChange={(e) => handleTextoChange(texto.id, 'tamanhoFonte', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-600 text-center">
                    {texto.tamanhoFonte || 24}px
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Cor do Texto:</label>
                  <input
                    type="color"
                    value={texto.cor || "#FFFFFF"}
                    onChange={(e) => handleTextoChange(texto.id, 'cor', e.target.value)}
                    className="w-full h-8 cursor-pointer"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Tipo de Fonte:</label>
                  <select
                    value={texto.tipoFonte || "Oswald"}
                    onChange={(e) => handleTextoChange(texto.id, 'tipoFonte', e.target.value)}
                    className="w-full border border-gray-300 py-1 px-2 rounded text-sm"
                  >
                    {tiposFonteDisponiveis.map((fonte) => (
                      <option key={fonte} value={fonte} style={{ fontFamily: fonte }}>
                        {fonte}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={texto.negrito || false}
                      onChange={(e) => handleTextoChange(texto.id, 'negrito', e.target.checked)}
                      className="rounded"
                    />
                    <span className="font-bold">Negrito</span>
                  </label>
                  
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={texto.italico || false}
                      onChange={(e) => handleTextoChange(texto.id, 'italico', e.target.checked)}
                      className="rounded"
                    />
                    <span className="italic">Itálico</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visualização */}
      <div className="flex flex-col items-center w-full">
        <div className="text-sm text-gray-600 mb-2">
          Visualização ({escalaVisualizacao * 100}% do tamanho original)
          {imagemDimensoes.width > 0 && (
            <span className="ml-4 text-gray-500">
              Original: {imagemDimensoes.width} × {imagemDimensoes.height}px
            </span>
          )}
        </div>
        
        <div className="relative border-4 border-gray-300 rounded-xl overflow-hidden shadow-xl bg-gray-100">
          <div 
            ref={captureRef}
            className="relative"
            style={{
              width: imagemDimensoes.width > 0 ? `${imagemDimensoes.width}px` : 'auto',
              height: imagemDimensoes.height > 0 ? `${imagemDimensoes.height}px` : 'auto',
              transform: `scale(${escalaVisualizacao})`,
              transformOrigin: 'top left',
            }}
          >
            {/* Imagem de Fundo */}
            {imagemSelecionada && (
              <div className="relative">
                <img
                  ref={imgRef}
                  src={`/fundo/${imagemSelecionada}`}
                  alt="Fundo selecionado"
                  className="block"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
                
                {/* Textos sobrepostos */}
                {textos.map((texto) => (
                  texto.texto.trim() && (
                    <div
                      key={texto.id}
                      style={{
                        position: 'absolute',
                        left: `${texto.x}px`,
                        top: `${texto.y}px`,
                        fontSize: `${texto.tamanhoFonte || 46}px`,
                        color: texto.cor || '#FFFFFF',
                        fontFamily: texto.tipoFonte || 'Oswald',
                        fontWeight: texto.negrito ? 'bold' : 'normal',
                        fontStyle: texto.italico ? 'italic' : 'normal',
                        textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                        whiteSpace: 'nowrap',
                        lineHeight: 1,
                      }}
                    >
                      {texto.texto}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
          
          {/* Grid de referência (opcional) */}
          {mostrarAcoes && (
            <div className="absolute inset-0 pointer-events-none" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${50 * escalaVisualizacao}px ${50 * escalaVisualizacao}px`,
              }}
            />
          )}
        </div>

        {/* Indicador de Tamanho */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>
            Tamanho da visualização:{" "}
            <span className="font-semibold">
              {imagemDimensoes.width > 0 ? Math.round(imagemDimensoes.width * escalaVisualizacao) : '...'} ×{" "}
              {imagemDimensoes.height > 0 ? Math.round(imagemDimensoes.height * escalaVisualizacao) : '...'}px
            </span>
          </p>
          <p>A imagem capturada será em tamanho original ({imagemDimensoes.width} × {imagemDimensoes.height}px)</p>
        </div>
      </div>

      {/* Botão de Captura */}
      {mostrarAcoes && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <button
            onClick={handleCaptureClick}
            className="bg-gradient-to-r from-[#f18933] to-[#ff7f00] border-none text-white py-3 px-10 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#ff7f00] hover:from-[#e07a2b] hover:to-[#e67300] transition-all text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            📥 Capturar e Baixar Imagem
          </button>
          <div className="text-sm text-gray-600 text-center space-y-1">
            <p>⏱️ Aguarde 1 segundo após clicar</p>
            <p>💾 A imagem será salva automaticamente</p>
            <p>🎨 Qualidade máxima preservada</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Img;