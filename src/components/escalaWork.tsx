"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
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

  const isMonday = (dateString: string) => {
    const date = new Date(dateString);
    console.log(date.getDay())
    return date.getDay() === 0;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (isMonday(selectedDate)) {
      setDate(selectedDate);
      gerarTabela(selectedDate);
    } else {
      alert("Por favor, selecione uma segunda-feira.");
    }
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

    let novaTabela: DiaTabela[] = [];

    for (let i = 0; i < 7; i++) {
      const data = new Date(dataSelecionada);
      data.setDate(dataSelecionada.getDate() + i);

      const diaSemana = diasSemana[data.getDay()];
      const dia = data.getDate();
      const mes = meses[data.getMonth()];
      const ano = data.getFullYear();
     
      let linhas: LinhaTabela[] = [];

      if (diaSemana === "Segunda") {
        linhas = [
          { trabalho: "Círculo de Oração", horario: "19hs", direcao: "Ir. Liduida e Ir. Mônica F.", recepcao: "", porteiro: "" },
        ];
      } else if (diaSemana === "Terça") {
        linhas = [
          { trabalho: "Ensaio ", horario: "19hs", direcao: "", recepcao: "", porteiro: "" },
        ];
      } else if (diaSemana === "Quarta") {
        linhas = [
          { trabalho: "Consagração", horario: "7hs", direcao: "Ir. Liduida e Ir. Mônica F.", recepcao: "", porteiro: "" },
        ];
      } else if (diaSemana === "Quinta") {
        linhas = [
          { trabalho: "Culto de Doutrina", horario: "19hs", direcao: "Pr. Eloi", recepcao: "", porteiro: "" },
        ];
      } else if (diaSemana === "Domingo") {
        linhas = [
          { trabalho: "EBD", horario: "8hs", direcao: "Aux. Wagner", recepcao: "", porteiro: "" },
          { trabalho: "Culto de", horario: "18hs", direcao: "Pr. Eloi", recepcao: "", porteiro: "" },
        ];
      } else {
        linhas = [{ trabalho: "LIVRE", horario: "LIVRE", direcao: "", recepcao: "", porteiro: "" }];
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
    <div className="flex flex-col justify-center items-center gap-4 m-2 font-oswald">
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        className="bg-[#f18933] border-none text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
      />  
      <div className="w-full overflow-auto">
      <div ref={captureRef} className="w-[120rem] p-0 flex flex-col justify-center items-center">  
        <div className="relative z-0 flex flex-col my-6 mx-2 items-center text-center justify-center border-double border-8 border-orange-500 rounded-lg">
          <Image
            src={
              "https://utfs.io/f/c281d545-e49e-478e-ac64-7aa1327160e2-fqjls5.png"
            }
            alt="7Setembro"
            width={90}
            height={80}
            sizes="50vw"
            style={{
              width: "40%",
              height: "auto",
            }}
            className="mb-8 mt-4 relative z-10 mx-auto"
          />
          <h1 className="font-semibold text-5xl relative z-10">
            ESCALA SEMANAL DE TRABALHOS DA IGREJA
          </h1>
          <table className="mx-16 my-6 border border-black text-3xl relative z-10 bg-white/70 backdrop-blur-sm">
            <thead className="border border-black ">
              <tr className=" w-auto bg-orange-500  border border-black text-center h-auto">
                <th className="py-[1rem]  border border-black h-auto">
                  Data
                </th>
                <th className="py-[1rem]  border border-black h-auto">
                  Trabalho
                </th>
                <th className="py-[1rem]  border border-black w-40 h-auto">
                  Horário
                </th>
                <th className="py-[1rem]  border border-black h-auto">
                  Direção
                </th>
                <th className="py-[1rem]  border border-black h-auto">
                  Recepção
                </th>
                <th className="py-[1rem]  border border-black h-auto">
                  Porteiro
                </th>
                {mostrarAcoes && (
                  <th className="py-[1rem]  border border-black h-auto">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="p-2 py-4">
              {tabela.map((dia, index) => (
                <React.Fragment key={index}>
                  {dia.linhas.map((linha, linhaIndex) => (
                    <tr key={linhaIndex}>
                      {linhaIndex === 0 && (
                        <td
                          rowSpan={dia.linhas.length}
                          className="p-4 text-center font-semibold  border border-black"
                        >
                          {dia.diaSemana} <br /> {dia.data}
                        </td>
                      )}
                      <td className="p-4  border border-black ">
                        <textarea
                          rows={1}
                          defaultValue={linha.trabalho}
                          className="text-center text-black bg-transparent w-full"
                        />
                      </td>
                      <td className="p-4 border border-black text-center">
                        <Input
                          type="text"
                          defaultValue={linha.horario}
                          required
                          className="text-center appearance-none border-none outline-none bg-transparent text-3xl w-full"
                        />
                      </td>
                      <td className="p-4 mt-2 border border-black ">
                        <select
                          required
                          className="text-center text-black bg-transparent w-full"
                          value={linha.direcao || "LIVRE"} 
                        >
                          <option>LIVRE</option>
                          <option>Pr. Eloi</option>
                          <option>Pb. Gleidystone</option>
                          <option>Dc. Cleiton</option>
                          <option>Dc. Alípio</option>
                          <option>Aux. Wagner</option>
                          <option>Aux. Viana</option>
                          <option>Aux. Joadison</option>
                          <option>Aux. Vitor</option>
                          <option>Aux. Davi</option>
                          <option>Ir. Ruth</option>
                          <option>Ir. Liduida</option>
                          <option>Ir. Mônica Lima</option>
                          <option>Ir. Liduida e Ir. Mônica F.</option>
                          <option>Ir. Mônica F. e Ir. Ruth</option>
                          <option>Ir. Monique e Ir. Monalisa</option>
                        </select>
                      </td>
                      <td className="p-4 mt-2 border border-black">
                        <select className="text-center text-black bg-transparent w-full">
                          <option>LIVRE</option>
                          <option>Ir. Natalia</option>
                          <option>Ir. Victoria</option>
                          <option>Ir. Ester</option>
                          <option>Ir. Rebeca</option>
                          <option>Ir. Iris</option>
                        </select>
                      </td>
                      <td className="p-4 mt-2 border border-black">
                        <select className="text-center text-black bg-transparent w-full">
                          <option>LIVRE</option>
                          <option>Pb. Gleidystone</option>
                          <option>Dc. Cleiton</option>
                          <option>Dc. Alípio</option>
                          <option>Aux. Wagner</option>
                          <option>Aux. Viana</option>
                          <option>Aux. Joadison</option>
                          <option>Aux. Vitor</option>
                          <option>Aux. Davi</option>
                        </select>
                      </td>
                      {mostrarAcoes && ( // Renderiza botões de ação apenas se mostrarAcoes for true
                        <td className="p-4 mt-2 border border-black">
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
            className="mt-[10rem] ml-[30rem]"
          />
        </div>
        </div>
      </div>
      </div>
      <button
        onClick={handleCaptureClick}
        className="bg-[#f18933] border-none text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#ff7f00]"
      >
        Capturar e Baixar
      </button>
    </div>
  );
};

export default EscalaWork;
