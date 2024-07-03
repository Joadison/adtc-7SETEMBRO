"use client";

import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";
import Image from "next/image";
import adtcImage from "../../public/adtc.png";
import { Input } from "./ui/input";

interface LinhaTabela {
  data?: string;
  trabalho: string;
  horario: string;
  direcao: string;
  recepcao: string;
  porteiro: string;
  acao?: string;
}

interface DiaTabela {
  diaSemana: string;
  data: string;
  linhas: LinhaTabela[];
}

const EscalaWork = () => {
  const [date, setDate] = useState("");
  const [tabela, setTabela] = useState<DiaTabela[]>([]);
  const [mostrarAcoes, setMostrarAcoes] = useState(true);
  const captureRef = useRef(null);

  const handleCaptureClick = async () => {
    setMostrarAcoes(false);

    setTimeout(async () => {
      if (captureRef.current) {
        const canvas = await html2canvas(captureRef.current, {
          useCORS: true,
          logging: true,
          allowTaint: false,
          scale: window.devicePixelRatio,
          scrollY: -window.scrollY,
        });

        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "screenshot.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 500);
    setTimeout(() => {
      setMostrarAcoes(true);
    }, 5000);
  };

  const handleDateChange = (e: any) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    gerarTabela(selectedDate);
  };

  const gerarTabela = (inputData: any) => {
    const parts = inputData.split("-");
    const dataSelecionada = new Date(parts[0], parts[1] - 1, parts[2]);

    const diasSemana = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
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

    let novaTabela = [];

    for (let i = 0; i < 7; i++) {
      const data = new Date(dataSelecionada);
      data.setDate(dataSelecionada.getDate() + i);

      const diaSemana = diasSemana[data.getDay()];
      const dia = data.getDate();
      const mes = meses[data.getMonth()];
      const ano = data.getFullYear();

      let linhas = [];

      if (diaSemana === "Terça") {
        linhas = [
          { trabalho: "Círculo de Oração", horario: "18hs" },
          { trabalho: "Ensaio de senhoras", horario: "20hs" },
          { trabalho: "Ensaio de jovens", horario: "20hs" },
        ];
      } else if (diaSemana === "Domingo") {
        linhas = [
          { trabalho: "EBD", horario: "8hs" },
          { trabalho: "Culto", horario: "18hs" },
        ];
      } else {
        linhas = [{ trabalho: "LIVRE", horario: "LIVRE" }];
      }

      novaTabela.push({
        diaSemana,
        data: `${dia} de ${mes} de ${ano}`,
        linhas,
      });
    }

    setTabela(novaTabela);
  };

  const adicionarLinha = (index: number) => {
    const novaLinha: LinhaTabela = {
      trabalho: "LIVRE",
      horario: "LIVRE",
      direcao: "",
      recepcao: "",
      porteiro: "",
      acao: "",
    };
    const novaTabela = [...tabela];
    novaTabela[index].linhas.push(novaLinha);
    setTabela(novaTabela);
  };

  const deletarLinha = (diaIndex: any, linhaIndex: any) => {
    const novaTabela = [...tabela];
    novaTabela[diaIndex].linhas.splice(linhaIndex, 1);
    setTabela(novaTabela);
  };

  return (
    <div className="flex flex-col items-center gap-4 m-4 font-oswald">
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        className="bg-[#f18933] border-none text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
      />
      <div ref={captureRef}>
        <div className="relative z-10 flex flex-col gap-4 m-6 items-center text-center justify-center border-double border-8 border-orange-500 rounded-lg p-4">
          <Image
            src={
              "https://utfs.io/f/e04d67ae-b098-4ff3-95fb-829bf46f171c-1s2qa.png"
            }
            alt="7Setembro"
            width={150}
            height={80}
            sizes="100vw"
            style={{
              width: "40%",
              height: "auto",
            }}
            className="mb-8 relative z-10 mx-auto"
          />
          <h1 className="font-semibold text-5xl relative z-10">
            ESCALA SEMANAL DE TRABALHOS DA IGREJA
          </h1>
          <table className="mx-16 my-6 w-full border-collapse border border-black text-3xl relative z-10 bg-white/70 backdrop-blur-sm">
            <thead className="borde-collapse border border-black ">
              <tr className=" bg-orange-500 border-collapse border border-black">
                <th className="py-4 borde-collapse border border-black px-10">
                  Data
                </th>
                <th className="py-4 borde-collapse border border-black">
                  Trabalho
                </th>
                <th className="py-4 borde-collapse border border-black px-2">
                  Horário
                </th>
                <th className="py-4 borde-collapse border border-black">
                  Direção
                </th>
                <th className="py-4 borde-collapse border border-black">
                  Recepção
                </th>
                <th className="py-4 borde-collapse border border-black">
                  Porteiro
                </th>
                {mostrarAcoes && (
                  <th className="py-4 border-collapse border border-black">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="p-2 py-4 ">
              {tabela.map((dia, index) => (
                <React.Fragment key={index}>
                  {dia.linhas.map((linha, linhaIndex) => (
                    <tr key={linhaIndex}>
                      {linhaIndex === 0 && (
                        <td
                          rowSpan={dia.linhas.length}
                          className="py-3 text-center font-semibold borde-collapse border border-black"
                        >
                          {dia.diaSemana} <br /> {dia.data}
                        </td>
                      )}
                      <td className="p-2 borde-collapse border border-black ">
                        <textarea
                          rows="1"
                          defaultValue={linha.trabalho}
                          className="text-center text-black bg-transparent "
                        />
                      </td>
                      <td className="p-2 borde-collapse border border-black ">
                        <Input
                          type="text"
                          defaultValue={linha.horario}
                          required
                          className="text-center appearance-none border-none outline-none w-24 bg-transparent text-3xl"
                        />
                      </td>
                      <td className="p-2 borde-collapse border border-black ">
                        <select
                          required
                          className="text-center text-black  bg-transparent "
                        >
                          <option>LIVRE</option>
                          <option>Pr. Eloi</option>
                          <option>Diá. Cleiton</option>
                          <option>Diá. Gleidystone</option>
                          <option>Diá. Alípio</option>
                          <option>Aux. Wagner</option>
                          <option>Aux. Viana</option>
                          <option>Aux. Joadison</option>
                          <option>Aux. Vitor</option>
                          <option>Ir. Liduida e Ir. Mônica F.</option>
                          <option>Ir. Mônica F. e Ir. Ruth</option>
                          <option>Ir. Monique e Ir. Monalisa</option>
                        </select>
                      </td>
                      <td className="p-2 borde-collapse border border-black">
                        <select className="text-center text-black bg-transparent ">
                          <option>LIVRE</option>
                          <option>Ir. Natalia</option>
                          <option>Ir. Victoria</option>
                          <option>Ir. Ester</option>
                          <option>Ir. Rebeca</option>
                          <option>Ir. Iris</option>
                        </select>
                      </td>
                      <td className="p-2 borde-collapse border border-black">
                        <select className="text-center text-black bg-transparent ">
                          <option>LIVRE</option>
                          <option>Dia. Cleiton</option>
                          <option>Dia. Gleidystone</option>
                          <option>Aux. Wagner</option>
                          <option>Aux. Viana</option>
                          <option>Aux. Joadison</option>
                          <option>Aux. Vitor</option>
                          <option>Aux. Alípio</option>
                        </select>
                      </td>
                      {mostrarAcoes && ( // Renderiza botões de ação apenas se mostrarAcoes for true
                        <td className="p-2 border-collapse border border-black">
                          {linhaIndex === 0 ? (
                            <button
                              onClick={() => adicionarLinha(index)}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Adicionar
                            </button>
                          ) : (
                            <button
                              onClick={() => deletarLinha(index, linhaIndex)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Deletar
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={
              "https://utfs.io/f/b05fb922-f9a8-47ef-8834-dbed170256c5-1d.png"
            }
            alt="logo"
            fill
            style={{
              objectFit: 'fill',
            }}
            objectFit="cover"
            quality={100}
            className="mt-[19rem] ml-[30rem]"
          />
        </div>
        </div>
      </div>
      <Button
        onClick={handleCaptureClick}
        className="bg-[#f18933] text-white py-2 px-4 rounded hover:bg-[#ff7f00] focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
      >
        Capturar e Baixar
      </Button>
    </div>
  );
};

export default EscalaWork;
