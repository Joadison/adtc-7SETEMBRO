"use client"

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";

interface LinhaTabela {
    data?: string;
    culto: string;
    hinos: string;
    op: string;
    oppalava: string;
    acao?: string;
  }

  interface DiaTabela {
    diaSemana: string;
    data: string;
    linhas: LinhaTabela[];
  }

const EscalaOp = () => {
  const [date, setDate] = useState("");
  const [tabela, setTabela] = useState<DiaTabela[]>([]);
  const [mostrarAcoes, setMostrarAcoes] = useState(true);
  const captureRef = useRef(null);

  const handleCaptureClick = async () => {
    setMostrarAcoes(false)
  
    setTimeout( async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
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

      linhas = [{ culto:'', hinos:'', op:'', oppalava:'' }];

      novaTabela.push({
        diaSemana,
        data: `${dia} de ${mes} de ${ano}`,
        linhas,
      });
    }

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
      <div className="sm:w-[39rem] md:w-[48rem] lg:w-[61rem] xl:w-[79rem] 2xl:w-full h-auto overflow-x-auto">
      <div ref={captureRef} className="w-[115rem] h-full flex flex-col justify-center items-center p-4">  
        <div className="relative z-0 flex flex-col my-6 mx-4 items-center text-center justify-center border-double border-8 border-orange-500 rounded-lg">
        <Image
            src={
              "https://utfs.io/f/c281d545-e49e-478e-ac64-7aa1327160e2-fqjls5.png"
            }
            alt="7Setembro"
            width={150}
            height={80}
            sizes="100vw"
            style={{
              width: "40%",
              height: "auto",
            }}
            className="mb-8 mt-4 relative z-10 mx-auto"
          />
        <h1 className="font-semibold text-5xl relative z-10">
          ESCALA SEMANAL DE TRABALHOS DA IGREJA
        </h1>
        <table className="mx-16 my-6 border-collapse border border-black text-3xl relative z-10 bg-white/70 backdrop-blur-sm">
          <thead className="border-collapse border border-black ">
            <tr className=" bg-orange-500 border-collapse border border-black">
              <th className="py-4 border-collapse border border-black px-10">
                Data
              </th>
              <th className="py-4 border-collapse border border-black">
                Culto
              </th>
              <th className="py-4 border-collapse border border-black px-2">
                Hinos
              </th>
              <th className="py-4 border-collapse border border-black">
                Oportunidades Louvor
              </th>
              <th className="py-4 border-collapse border border-black">
                Oportunidades Saudação
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
                        className="py-3 text-center font-semibold border-collapse border border-black"
                      >
                        {dia.diaSemana} <br /> {dia.data}
                      </td>
                    )}
                    <td className="p-2 border-collapse border border-black ">
                      <textarea
                        rows={1}
                        defaultValue={linha.culto}
                        className="text-center text-black bg-transparent "
                      />
                    </td>
                    <td className="p-2 border-collapse border border-black ">
                      <textarea
                        rows={1}
                        defaultValue={linha.hinos}
                        className="text-center text-black bg-transparent "
                      />
                    </td>
                    <td className="p-2 border-collapse border border-black ">
                      <textarea
                        rows={1}
                        defaultValue={linha.op}
                        className="text-center text-black bg-transparent "
                      />
                    </td>
                    <td className="p-2 border-collapse border border-black ">
                      <textarea
                        rows={1}
                        defaultValue={linha.oppalava}
                        className="text-center text-black bg-transparent "
                      />
                    </td>
                    {mostrarAcoes && ( 
                    <td className="p-2 border-collapse border border-black">
                        <button
                          onClick={() => deletarLinha(index, linhaIndex)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Deletar
                        </button>
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

export default EscalaOp;
