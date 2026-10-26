"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Users,
  Heart,
  BookOpen,
  Clock,
  UserPlus,
  Compass,
  BookMarked,
  Users2,
  Mic2,
  Music2,
  Headphones,
  ListMusic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Ministerios = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ministries = [
    {
      title: "Crianças TC",
      img: "/crianca.png",
      bg: "bg-gradient-to-br from-yellow-100 to-yellow-200",
      borderColor: "border-yellow-300",
      iconBg: "bg-yellow-200",
      icon: <Users className="h-5 w-5 text-yellow-600" />,
      description:
        "Eduque a criança no caminho em que deve andar, e mesmo quando for idoso não se desviará dele.",
      reference: "Provérbios 22:6",
      activities: [
        "Escola Bíblica Infantil",
        "Culto Infantil",
        "Eventos Especiais",
      ],
      leaders: [""],
    },
    {
      title: "Juventude TC",
      img: "/jovens.png",
      bg: "bg-gradient-to-br from-indigo-100 to-indigo-200",
      borderColor: "border-indigo-300",
      iconBg: "bg-indigo-200",
      icon: <UserPlus className="h-5 w-5 text-indigo-600" />,
      description:
        "Não permita que ninguém o despreze por ser jovem, mas seja exemplo para os fiéis em palavra, comportamento, amor, fé e pureza.",
      reference: "1 Timóteo 4:12",
      activities: ["Culto de Jovens", "Grupos Pequenos", "Retiros"],
      leaders: [""],
    },
    {
      title: "Casais TC",
      img: "/casais.png",
      bg: "bg-gradient-to-br from-red-100 to-red-200",
      borderColor: "border-red-300",
      iconBg: "bg-red-200",
      icon: <Heart className="h-5 w-5 text-red-600" />,
      description:
        "Sozinho, o homem pode ser vencido; mas dois conseguem resistir. Um cordão de três dobras não se rompe facilmente.",
      reference: "Eclesiastes 4:12",
      activities: ["Encontro de Casais", "Aconselhamento", "Estudos Bíblicos"],
      leaders: [""],
    },
    {
      title: "Mulheres TC",
      img: "/mulheres.png",
      bg: "bg-gradient-to-br from-purple-100 to-purple-200",
      borderColor: "border-purple-300",
      iconBg: "bg-purple-200",
      icon: <Users2 className="h-5 w-5 text-purple-600" />,
      description:
        "A mulher sábia edifica a sua casa, mas com as próprias mãos a insensata derruba a sua.",
      reference: "Provérbios 14:1",
      activities: ["Círculo de Oração", "Chá de Mulheres", "Estudos Bíblicos"],
      leaders: [""],
    },
    {
      title: "Círculo de Oração & Consagração",
      bg: "bg-gradient-to-br from-sky-100 to-sky-200",
      borderColor: "border-sky-300",
      iconBg: "bg-sky-200",
      icon: <Clock className="h-5 w-5 text-sky-600" />,
      description:
        "E tudo o que pedirem em oração, se crerem, vocês receberão.",
      reference: "Mateus 21:22",
      activities: ["Vigílias", "Correntes de Oração", "Intercessão"],
      leaders: [""],
    },
    {
      title: "Secretaria de Missões",
      bg: "bg-gradient-to-br from-green-100 to-green-200",
      borderColor: "border-green-300",
      iconBg: "bg-green-200",
      icon: <Compass className="h-5 w-5 text-green-600" />,
      description:
        "Portanto ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo.",
      reference: "Mateus 28:19",
      activities: [
        "Viagens Missionárias",
        "Apoio a Missionários",
        "Evangelismo",
      ],
      leaders: [""],
    },
    {
      title: "EBD",
      img: "/ebd.png",
      bg: "bg-gradient-to-br from-amber-100 to-amber-200",
      borderColor: "border-amber-300",
      iconBg: "bg-amber-200",
      icon: <BookMarked className="h-5 w-5 text-amber-600" />,
      description:
        "Ensinem a guardar tudo o que eu vos ordenei. E lembrem-se: estou com vocês todos os dias, até o fim dos tempos.",
      reference: "Mateus 28:20",
      activities: [
        "Classes por Faixa Etária",
        "Formação de Professores",
        "Material Didático",
      ],
      leaders: [""],
    },
    {
      title: "Pastoral",
      bg: "bg-gradient-to-br from-emerald-100 to-emerald-200",
      borderColor: "border-emerald-300",
      iconBg: "bg-emerald-200",
      icon: <BookOpen className="h-5 w-5 text-emerald-600" />,
      description:
        "Lembrem‑se dos seus líderes, que transmitiram a palavra de Deus a vocês. Observem bem o resultado do estilo de vida deles e imitem a sua fé.",
      reference: "Hebreus 13:7",
      activities: ["Aconselhamento", "Visitação", "Pregação"],
      leaders: [""],
    },
    {
      title: "Louvor",
      // img: "/louvor.png", // opcional, como nos outros cards
      bg: "bg-gradient-to-br from-rose-100 to-rose-200",
      borderColor: "border-rose-300",
      iconBg: "bg-rose-200",
      icon: <Mic2 className="h-5 w-5 text-rose-600" />,
      description:
        "Tehillah: o Senhor habita, reina, mora, governa e se manifesta entre nós com poder quando o adoramos em espírito e verdade.",
      reference: "João 4:24",
      activities: ["Louvor nos Cultos", "Ensaios", "Vigílias de Adoração"],
      leaders: [""],
    },
    {
      title: "Banda",
      // img: "/banda.png",
      bg: "bg-gradient-to-br from-orange-100 to-orange-200",
      borderColor: "border-orange-300",
      iconBg: "bg-orange-200",
      icon: <Music2 className="h-5 w-5 text-orange-600" />,
      description:
        "A nossa banda se chama Lemuel, nome de origem bíblica que significa “consagrado a Deus”.",
      reference: "Salmos 33:3",
      activities: ["Banda Lemuel", "Ensaios", "Acompanhamento dos Cultos"],
      leaders: [""],
    },
    {
      title: "Mídia / Som",
      // img: "/midia.png",
      bg: "bg-gradient-to-br from-cyan-100 to-cyan-200",
      borderColor: "border-cyan-300",
      iconBg: "bg-cyan-200",
      icon: <Headphones className="h-5 w-5 text-cyan-600" />,
      description:
        "Quer vocês comam, bebam ou façam qualquer outra coisa, façam tudo para a glória de Deus.",
      reference: "1 Coríntios 10:31",
      activities: ["Sonorização", "Transmissão ao Vivo", "Fotos e Vídeos"],
      leaders: [""],
    },
    {
      title: "Regência",
      // img: "/regencia.png",
      bg: "bg-gradient-to-br from-slate-100 to-slate-200",
      borderColor: "border-slate-300",
      iconBg: "bg-slate-200",
      icon: <ListMusic className="h-5 w-5 text-slate-600" />,
      description:
        "Tudo, porém, seja feito com decência e ordem.",
      reference: "1 Coríntios 14:40",
      activities: ["Condução do Louvor", "Preparação dos Cânticos", "Formação de Vozes"],
      leaders: [""],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex-1 overflow-auto py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Ministérios
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Conheça as diversas áreas de atuação da nossa igreja e descubra como
            você pode se envolver e servir ao Reino de Deus.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {ministries.map((ministry, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="h-full"
            >
              <Card
                className={`md:h-[340px] h-[400px] flex flex-col justify-between overflow-hidden border ${ministry.borderColor} hover:shadow-lg transition-shadow`}
              >

                <CardContent className={`p-6 ${ministry.bg} h-full`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${ministry.iconBg} p-2 rounded-full`}>
                      {ministry.icon}
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Ministério
                      </Badge>
                      <h3 className="text-xl font-bold">{ministry.title}</h3>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 italic mb-1">
                    &quot;{ministry.description}&quot;
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      {ministry.reference}
                    </p>
                  </div>

                  {/* {hoveredIndex === index && ( */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-3"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          Atividades:
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {ministry.activities.map((activity, i) => (
                            <li key={i} className="flex items-center">
                              <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          Liderança:
                        </h4>
                        <ul className="text-sm text-gray-700">
                          {ministry.leaders.map((leader, i) => (
                            <li key={i}>{leader}</li>
                          ))}
                        </ul>
                      </div> */}
                    </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Quer participar de algum ministério?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Deus deu a cada um de nós dons e talentos para serem usados na
              edificação da Sua igreja. Descubra como você pode servir e fazer
              parte de um dos nossos ministérios.
            </p>
            {/* <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Fale com um Pastor
              </Button>
              <Button variant="outline">Conheça Nossos Horários</Button>
            </div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Ministerios;
