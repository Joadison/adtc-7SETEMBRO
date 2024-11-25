"use client"

import Image from "next/image";
import { useTheme } from "./theme/theme-context";

const Ministerios = () => {
  const { colors } = useTheme();
  const sections = [
    {
      title: "Crianças",
      img: "/crianca.png",
      bg: "bg-yellow-200",
      description:
        "Eduque a criança no caminho em que deve andar, e mesmo quando for idoso não se desviará dele. Pv 22.6",
    },
    {
      title: "Jovens",
      img: "/jovens.png",
      bg: "bg-indigo-300",
      description:
        "Não permita que ninguém o despreze por ser jovem, mas seja exemplo para os fiéis em palavra, comportamento, amor, fé e pureza. 1Tm 4.12",
    },
    {
      title: "Casais",
      img: "/casais.png",
      bg: "bg-red-300",
      description:
        "Sozinho, o homem pode ser vencido; mas dois conseguem resistir. Um cordão de três dobras não se rompe facilmente. Ec 4.12",
    },
    {
      title: "Mulheres",
      img: "/mulheres.png",
      bg: "bg-purple-300",
      description:
        "A mulher sábia edifica a sua casa, mas com as próprias mãos a insensata derruba a sua. Pv 14.1",
    },
    {
      title: "Circulo de Oração",
      bg: "bg-sky-300",
      description:
        "E tudo o que pedirem em oração, se crerem, vocês receberão. Mt 21.22",
    },
    {
      title: "Missão",
      bg: "bg-green-400",
      description:
        "Portanto ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo; Mt 28.19",
    },
    {
      title: "EBD",
      img: "/ebd.png",
      bg: "bg-amber-300",
      description:
        "Ensinem a guardar tudo o que eu vos ordenei. E lembrem-se: estou com vocês todos os dias, até o fim dos tempos. Mt 28.20",
    },
    {
      title: "Pastoral",
      bg: "bg-emerald-300",
      description:
        "Lembrem‑se dos seus líderes, que transmitiram a palavra de Deus a vocês. Observem bem o resultado do estilo de vida deles e imitem a sua fé. Hb 13.7",
    },
  ];

  return (
    <div
      className={`flex flex-col justify-center p-9 mx-auto ${colors.fundo} ${colors.text}`}
    >
      <h1 className="text-4xl font-bold text-center mb-8">Ministérios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`${section.bg} p-6 rounded-lg shadow-lg hover:scale-105 transition-transform`}
          >
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {section.title}
              </h2>
              {section.img && (
                <div className="relative w-[16rem] h-[3rem] mb-4">
                  <Image
                    src={section.img}
                    alt={section.title}
                    layout="fill"
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
            <p className="text-gray-700">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ministerios;
