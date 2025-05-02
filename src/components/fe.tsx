"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  BookOpen,
  Users,
  Heart,
  Church,
  ArrowDownCircle,
  Quote,
  Flame,
} from "lucide-react";

const Fe = () => {
  const beliefs = [
    {
      title: "Na Bíblia Sagrada",
      description:
        "Cremos na Bíblia Sagrada como única regra infalível de fé e prática para a vida e o caráter cristão.",
      icon: <BookOpen className="h-10 w-10 text-orange-600" />,
      reference: "2 Timóteo 3:16-17",
    },
    {
      title: "Na Trindade",
      description:
        "Cremos em um só Deus, eternamente subsistente em três pessoas distintas que, embora distintas, são iguais em poder, glória e majestade: o Pai, o Filho e o Espírito Santo.",
      icon: <Users className="h-10 w-10 text-orange-600" />,
      reference: "Mateus 28:19",
    },
    {
      title: "Que Jesus Cristo salva",
      description:
        "Cremos na pecaminosidade do homem, que o destituiu da glória de Deus e que somente o arrependimento e a fé na obra expiatória e redentora de Jesus Cristo podem restaurá-lo a Deus.",
      icon: <Heart className="h-10 w-10 text-orange-600" />,
      reference: "João 3:16",
    },
    {
      title: "Na Igreja",
      description:
        "Cremos na Igreja como corpo de Cristo, coluna e firmeza da verdade, assembleia dos fieis remidos de todas as eras e todos os lugares.",
      icon: <Church className="h-10 w-10 text-orange-600" />,
      reference: "1 Timóteo 3:15",
    },
    {
      title: "No Batismo com o Espírito Santo",
      description:
        "Cremos no batismo no Espírito Santo, que nos é dado por Jesus Cristo, demonstrado pela evidência física do falar em outras línguas, e na atualidade dos dons espirituais distribuídos pelo Espírito Santo à Igreja para sua edificação.",
      icon: <Flame className="h-10 w-10 text-orange-600" />,
      reference: "Atos 2:4",
    },
    {
      title: "Que Jesus voltará",
      description:
        "Cremos na segunda vinda de Cristo, em duas fases distintas e na eternidade de tristeza e tormento para os infiéis e vida eterna de gozo e felicidade para os fiéis de todos os tempos.",
      icon: <ArrowDownCircle className="h-10 w-10 text-orange-600" />,
      reference: "1 Tessalonicenses 4:16-17",
    },
  ];

  return (
    <div className="flex-1 overflow-auto py-16 px-4">
      {/* Hero Section */}
      <div className="relative py-12 mb-16 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-orange-200 blur-md"></div>
              <div className="relative">
                <Image
                  src="https://utfs.io/f/b05fb922-f9a8-47ef-8834-dbed170256c5-1d.png"
                  width={120}
                  height={120}
                  alt="Símbolo de Fé"
                  className="rounded-full shadow-sm"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Em que cremos?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa fé é fundamentada nas Escrituras Sagradas e em princípios
              que têm guiado a Igreja através dos séculos.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Beliefs Section */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beliefs.map((belief, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 flex flex-col h-full"
            >
              <div className="mb-4">{belief.icon}</div>
              <h2 className="text-xl font-bold mb-3 text-gray-900">
                {belief.title}
              </h2>
              <p className="text-gray-600 mb-4 flex-grow">
                {belief.description}
              </p>
              <div className="text-sm text-orange-600 font-medium italic mt-auto">
                {belief.reference}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scripture Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <blockquote className="max-w-3xl mx-auto p-6 md:p-8 bg-orange-500 text-white rounded-2xl shadow-lg relative">
            <Quote
              className="absolute -top-4 -left-4 h-10 w-10 text-orange-300 opacity-40 rotate-180"
              fill="currentColor"
            />
            <p className="text-lg md:text-2xl font-medium leading-relaxed italic text-center">
              "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus.  
              Não vem das obras, para que ninguém se glorie."
            </p>
            <footer className="mt-4 text-right font-semibold text-lg">— Efésios 2:8-9</footer>
            <Quote
              className="absolute -bottom-4 -right-4 h-10 w-10 text-orange-300 opacity-40"
              fill="currentColor"
            />
          </blockquote>

        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Quer saber mais sobre nossa fé?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Convidamos você a participar de nossos cultos e estudos bíblicos
            para aprofundar seu conhecimento sobre as verdades que cremos e
            professamos.
          </p>
          {/* <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
              Fale com um Pastor
            </button>
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Horários de Culto
            </button>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Fe;
