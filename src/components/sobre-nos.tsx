"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Book, Clock, Heart, Users, Target, Award } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

const SobreNos = () => {
  const [activeTab, setActiveTab] = useState("historia")

  const tabItems = [
    {
      id: "historia",
      title: "Nossa História",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-600",
      borderColor: "border-orange-200",
    },
    {
      id: "igreja",
      title: "Que igreja é a Nossa Igreja?",
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      id: "fe",
      title: "Nossa Fé",
      icon: <Book className="h-5 w-5" />,
      color: "bg-green-100 text-green-600",
      borderColor: "border-green-200",
    },
    {
      id: "nossa",
      title: "Nossa visão, missão e valores",
      icon: <Target className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-600",
      borderColor: "border-purple-200",
    },
  ]

  const historiaContent = (
    <div className="space-y-6">
     {/*  <div className="relative h-64 md:h-80 overflow-hidden rounded-xl mb-6">
        <Image
          src="/placeholder.svg?height=600&width=1200&text=História da Igreja"
          alt="História da Igreja"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Mais de 100 anos de história</h2>
            <p className="text-white/80">Uma jornada de fé, dedicação e serviço ao Reino de Deus</p>
          </div>
        </div>
      </div> */}

      <div className="bg-gradient-to-t from-white/10 to-transparent flex items-end">
        <div className="p-6 text-black">
          <h2 className="text-2xl font-bold mb-2">Mais de 100 anos de história</h2>
          <p className="text-black/80">Uma jornada de fé, dedicação e serviço ao Reino de Deus</p>
        </div>
      </div>

      <p className="indent-6 text-gray-700 leading-relaxed">
        A identidade da Nossa Igreja está diretamente ligada à nossa história. Somos uma igreja centenária – existimos
        há mais de 100 anos. E, nossa história, é formada por "muitas histórias": histórias de homens e de mulheres de
        Deus, das diversas gerações, em distintos lugares e realidades, que experimentaram o poder do Espírito Santo e
        realizaram a obra do Senhor no mundo. Temos uma história e ela conta a respeito de quem somos, o que cremos e o
        que fazemos.
      </p>
      <p className="indent-6 text-gray-700 leading-relaxed">
        Ao longo de todos estes anos, homens e mulheres empoderados pelo fogo do Espírito de Deus, proclamaram as
        boas-novas de que Jesus salva, cura, batiza com o Espírito Santo e em breve voltará! Fazemos parte da história
        desta igreja – crianças, jovens, adultos e idosos, de ontem ou de hoje, todos – sejam como àqueles que receberam
        o legado do passado, como àqueles que a realizam no presente, como àqueles que tem a responsabilidade com o seu
        futuro.
      </p>
      <p className="indent-6 text-gray-700 leading-relaxed">
        A história das Assembleias de Deus no Brasil, no Ceará e em Fortaleza é marcada pela ação atuante do Espírito
        Santo de Deus que, a despeito das fragilidades e das limitações humanas, avivou homens e mulheres sinceros para
        manifestar as grandezas do Evangelho das boas-novas do Reino de Deus à sociedade. Incontáveis e imensuráveis são
        os frutos e o legado deixados no mundo, ao longo de nossa história, pelos servos de Deus que construíram (e
        constroem) a Nossa Igreja.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
          <div className="text-orange-600 text-xl font-bold mb-2">1911</div>
          <p className="text-gray-700">Início do movimento pentecostal no Brasil</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
          <div className="text-orange-600 text-xl font-bold mb-2">1918</div>
          <p className="text-gray-700">Chegada da Assembleia de Deus ao Ceará</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
          <div className="text-orange-600 text-xl font-bold mb-2">1921</div>
          <p className="text-gray-700">Fundação da igreja em Fortaleza</p>
        </div>
      </div>
    </div>
  )

  const igrejaContent = (
    <div className="space-y-6">
      {/* <div className="flex flex-col md:flex-row gap-8 mb-8"> */}
        {/* <div className="md:w-1/2"> */}
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Assembleia de Deus Templo Central</h2>
          <p className="indent-6 text-gray-700 leading-relaxed">
            Nossa igreja, a Assembleia de Deus Templo Central é uma igreja cristã, evangélica e pentecostal, com mais de
            100 anos de existência, localizada na cidade de Fortaleza, Estado do Ceará, que conta com mais de 250
            congregações distribuídas por toda a Capital. Nossa igreja tem como visão ser uma comunidade fiel à
            proclamação e vivência do Evangelho, buscando ser relevante no contexto em que está inserida e que busca ser
            reconhecida como um lugar de Restauração, Misericórdia e Ensino.
          </p>
          <p className="indent-6 text-gray-700 leading-relaxed mt-4">
            Temos como missão fazer discípulos de Cristo e conduzi-los a amar, acolher e servir. Para cumprir nossa
            visão e missão, estamos comprometidos com os valores da comunhão com Deus, integridade, lealdade, excelência
            e serviço. Nossa Igreja é uma igreja bíblica, multigeracional, multilocal, que crê na experiência do
            Pentecostes para nossos dias e busca comunicar de maneira íntegra e relevante o Evangelho ao mundo
            contemporâneo.
          </p>
        {/* </div> */}
        {/* <div className="md:w-1/2 relative h-64 md:h-auto rounded-xl overflow-hidden">
          <Image
            src="/placeholder.svg?height=600&width=800&text=Templo Central"
            alt="Templo Central"
            fill
            className="object-cover"
          />
        </div> */}
      {/* </div> */}

      <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
        <h3 className="text-xl font-bold mb-4 text-orange-700">Projeto Atos 2</h3>
        <p className="text-gray-700 leading-relaxed">
          O Projeto Atos 2 é um projeto ministerial e de gestão eclesiástica que tem como objetivo proporcionar uma
          maior celeridade ao crescimento e à expansão da Igreja de nosso Senhor Jesus Cristo. O projeto tem como
          finalidade favorecer uma ação pastoral integrada, a fim de gerar comunhão e promover a evangelização integral,
          a ação social, o ensino bíblico, a obra missionária e a unidade da Igreja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="border-orange-100">
          <CardContent className="pt-6">
            <div className="bg-orange-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">+250</h3>
            <p className="text-gray-600">Congregações em Fortaleza</p>
          </CardContent>
        </Card>
        <Card className="border-orange-100">
          <CardContent className="pt-6">
            <div className="bg-orange-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">+100</h3>
            <p className="text-gray-600">Anos de história</p>
          </CardContent>
        </Card>
        <Card className="border-orange-100">
          <CardContent className="pt-6">
            <div className="bg-orange-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Milhares</h3>
            <p className="text-gray-600">De vidas transformadas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const feContent = (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-800">Nossa Declaração de Fé</h2>
        <p className="text-gray-700 leading-relaxed">
          Nossa Igreja tem a Palavra de Deus como sua única norma de fé e prática para a vida cristã. Cremos em todas as
          verdades reveladas por Deus nas Escrituras Sagradas, seguindo a tradição do cristianismo evangélico e
          pentecostal ao longo dos séculos. Como uma igreja pentecostal, Nossa Igreja crê na experiência do batismo com
          o Espírito Santo e na atualidade dos dons espirituais na vida do crente.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          Historicamente, as Assembleias de Deus têm sintetizado a fé pentecostal na seguinte declaração: "Jesus salva,
          cura, batiza com o Espírito Santo e em breve voltará".
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Cremos:</h3>
        </div>
        <div className="p-6">
          <ol className="list-decimal space-y-4 pl-6">
            <li className="text-gray-700 leading-relaxed">
              Na inspiração divina verbal e plenária da Bíblia Sagrada, única regra infalível de fé e prática para a
              vida e o caráter cristão (2Tm 3.14-17);
            </li>
            <li className="text-gray-700 leading-relaxed">
              Em um só Deus, eternamente subsistente em três pessoas distintas que, embora distintas, são iguais em
              poder, glória e majestade: o Pai, o Filho e o Espírito Santo; Criador do Universo, de todas as coisas que
              há nos céus e na terra, visíveis e invisíveis, e, de maneira especial, os seres humanos, por um ato
              sobrenatural e imediato, e não por um processo evolutivo (Dt 6.4; Mt 28.19; Mc 12.29; Gn 1.1;2.7; Hb 11.3
              e Ap 4.11);
            </li>
            <li className="text-gray-700 leading-relaxed">
              No Senhor Jesus Cristo, o Filho Unigênito de Deus, plenamente Deus, plenamente Homem, na concepção e no
              seu nascimento virginal, em sua morte vicária e expiatória, em sua ressurreição corporal dentre os mortos
              e em sua ascensão vitoriosa aos céus como Salvador do mundo (Jo 3.16-18; Rm 1.3,4; Is 7.14; Mt 1.23; Hb
              10.12; Rm 8.34 e At 1.9);
            </li>
            <li className="text-gray-700 leading-relaxed">
              No Espírito Santo, a terceira pessoa da Santíssima Trindade, consubstancial como o Pai e o Filho, Senhor e
              Vivificador; que convence o mundo do pecado, da justiça e do juízo; que regenera o pecador; que falou por
              meio dos profetas e continua guiando o seu povo (2Co 13.13; 2Co 3.6,17; Rm 8.2; Jo 16.11; Tt 3.5; 2Pe 1.21
              e Jo 16.13);
            </li>
            <li className="text-gray-700 leading-relaxed">
              Na pecaminosidade do homem, que o destituiu da glória de Deus e que somente o arrependimento e a fé na
              obra expiatória e redentora de Jesus Cristo podem restaurá-lo a Deus (Rm 3.23; At 3.19);
            </li>
            <li className="text-gray-700 leading-relaxed">
              Na necessidade absoluta do novo nascimento pela graça de Deus mediante a fé em Jesus Cristo e pelo poder
              atuante do Espírito Santo e da Palavra de Deus para tornar o homem aceito no Reino dos Céus (Jo 3.3-8, Ef
              2.8,9);
            </li>
            <li className="text-gray-700 leading-relaxed">
              No perdão dos pecados, na salvação plena e na justificação pela fé no sacrifício efetuado por Jesus Cristo
              em nosso favor (At 10.43; Rm 10.13; 3.24-26; Hb 7.25; 5.9);
            </li>
            <li className="text-gray-700 leading-relaxed">
              Na Igreja, que é o corpo de Cristo, coluna e firmeza da verdade, una, santa e universal assembleia dos
              fieis remidos de todas as eras e todos os lugares, chamados do mundo pelo Espírito Santo para seguir a
              Cristo e adorar a Deus (1Co 12.27; Jo 4.23; 1Tm 3.15; Hb 12.23; Ap 22.17);
            </li>
            <li className="text-gray-700 leading-relaxed">
              No batismo bíblico efetuado por imersão em águas, uma só vez, em nome do Pai, e do Filho, e do Espírito
              Santo, conforme determinou o Senhor Jesus Cristo (Mt 28.19; Rm 6.1-6; Cl 2.12);
            </li>
            <li className="text-gray-700 leading-relaxed">
              Na necessidade e na possibilidade de termos vida santa e irrepreensível por obra do Espírito Santo, que
              nos capacita a viver como fiéis testemunhas de Jesus Cristo (Hb 9.14; 1Pe 1.15);
            </li>
            <li className="text-gray-700 leading-relaxed">
              No batismo com o Espírito Santo, conforme as Escrituras, que nos é dado por Jesus Cristo, demonstrado pela
              evidência física do falar em outras línguas, conforme a sua vontade (At 1.5; 2.4; 10.44-46; 19.1-7);
            </li>
            <li className="text-gray-700 leading-relaxed">
              Na atualidade dos dons espirituais distribuídos pelo Espírito Santo à Igreja para sua edificação, conforme
              Sua soberana vontade para o que for útil (1Co 12.1-12);
            </li>
            <li className="text-gray-700 leading-relaxed">
              Na segunda vinda de Cristo, em duas fases distintas: a primeira — invisível ao mundo, para arrebatar a Sua
              Igreja, antes da Grande Tribulação; a segunda — visível e corporal, com a Sua Igreja glorificada, para
              reinar sobre o mundo durante mil anos (1Ts 4.16, 17; 1Co 15.51-54; Ap 20.4; Zc 14.5; Jd 14);
            </li>
            <li className="text-gray-700 leading-relaxed">
              No comparecimento ante o Tribunal de Cristo de todos os cristãos arrebatados, para receberem a recompensa
              pelos seus feitos em favor da causa de Cristo na Terra (2Co 5.10);
            </li>
            <li className="text-gray-700 leading-relaxed">
              No Juízo Final, no qual comparecerão todos os ímpios: desde a Criação até o fim do Milênio; os que
              morreram durante o período milenial e os que, ao final desta época, estiverem vivos. E na eternidade de
              tristeza e tormento para os infiéis e vida eterna de gozo e felicidade para os fiéis de todos os tempos
              (Mt 25.46; Is 65.20; Ap 20.11-15; 21.1-4);
            </li>
            <li className="text-gray-700 leading-relaxed">
              Cremos, também, que o casamento foi instituído por Deus e ratificado por nosso Senhor Jesus Cristo como
              união entre um homem e uma mulher, nascidos macho e fêmea, respectivamente, em conformidade com o definido
              pelo sexo da criação geneticamente determinado (Gn 2.18; Jo 2.1,2; Gn 2.24; 1.27).
            </li>
          </ol>
        </div>
      </div>
    </div>
  )

  const nossaContent = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-orange-200 hover:border-orange-300 transition-colors">
          <CardContent className="pt-6">
            <div className="bg-orange-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Nossa Visão</h3>
            <p className="text-gray-700 leading-relaxed">
              Nossa Igreja tem como visão ser "uma comunidade que seja fiel à proclamação e a vivência do Evangelho de
              Cristo, relevante no contexto social, reconhecida como um lugar de Restauração, Misericórdia e Ensino".
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:border-orange-300 transition-colors">
          <CardContent className="pt-6">
            <div className="bg-orange-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Nossa Missão</h3>
            <p className="text-gray-700 leading-relaxed">
              Nossa Igreja tem por missão "fazer discípulos e conduzi-los a Amar, Acolher e Servir."
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:border-orange-300 transition-colors">
          <CardContent className="pt-6">
            <div className="bg-orange-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Nossos Valores</h3>
            <p className="text-gray-700 leading-relaxed">
              Nossa Igreja está estruturada em torno dos seguintes valores: Integridade, Lealdade, Serviço, Excelência e
              Comunhão com Deus.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl overflow-hidden">
        <div className="p-8 md:p-12 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            "Fazer discípulos e conduzi-los a amar, acolher e servir."
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Amar</h3>
              <p className="text-white/80">
                Amar a Deus sobre todas as coisas e ao próximo como a si mesmo, seguindo o maior mandamento de Cristo.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Acolher</h3>
              <p className="text-white/80">
                Receber a todos com o amor de Cristo, sem distinção, criando um ambiente de comunhão e pertencimento.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Servir</h3>
              <p className="text-white/80">
                Servir a Deus e ao próximo com excelência, humildade e dedicação, seguindo o exemplo de Jesus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-auto py-12 px-4 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sobre Nós</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Conheça mais sobre a Assembleia de Deus Templo Central - 7 de Setembro, nossa história, nossa fé e nossos
            valores que nos guiam há mais de um século.
          </p>
        </div>

        <Tabs defaultValue="historia" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 lg:grid-cols-4 lg:px-2 lg:pb-0 p-2 h-auto mb-6 lg:mb-0 lg:rounded-b-none">
            {tabItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 lg:py-2 p-4 data-[state=active]:rounded-b-none data-[state=active]:shadow-none"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="bg-white rounded-xl lg:rounded-t-none border lg:border-t-0 border-slate-100 p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="historia" className="mt-0">
                  {historiaContent}
                </TabsContent>
                <TabsContent value="igreja" className="mt-0">
                  {igrejaContent}
                </TabsContent>
                <TabsContent value="fe" className="mt-0">
                  {feContent}
                </TabsContent>
                <TabsContent value="nossa" className="mt-0">
                  {nossaContent}
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default SobreNos

