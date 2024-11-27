"use client";

import React, { useState } from "react";
import { useTheme } from "./theme/theme-context";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const SobreNos = () => {
  const { colors } = useTheme();
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const historiaContent = (
    <>
      <p className="indent-6">
        A identidade da Nossa Igreja está diretamente ligada à nossa história.
        Somos uma igreja centenária – existimos há mais de 100 anos. E, nossa
        história, é formada por “muitas histórias”: histórias de homens e de
        mulheres de Deus, das diversas gerações, em distintos lugares e
        realidades, que experimentaram o poder do Espírito Santo e realizaram a
        obra do Senhor no mundo. Temos uma história e ela conta a respeito de
        quem somos, o que cremos e o que fazemos.
      </p>
      <p className="indent-6">
        Ao longo de todos estes anos, homens e mulheres empoderados pelo fogo do
        Espírito de Deus, proclamaram as boas-novas de que Jesus salva, cura,
        batiza com o Espírito Santo e em breve voltará! Fazemos parte da
        história desta igreja – crianças, jovens, adultos e idosos, de ontem ou
        de hoje, todos – sejam como àqueles que receberam o legado do passado,
        como àqueles que a realizam no presente, como àqueles que tem a
        responsabilidade com o seu futuro.
      </p>
      <p className="indent-6">
        A história das Assembleias de Deus no Brasil, no Ceará e em Fortaleza é
        marcada pela ação atuante do Espírito Santo de Deus que, a despeito das
        fragilidades e das limitações humanas, avivou homens e mulheres sinceros
        para manifestar as grandezas do Evangelho das boas-novas do Reino de
        Deus à sociedade. Incontáveis e imensuráveis são os frutos e o legado
        deixados no mundo, ao longo de nossa história, pelos servos de Deus que
        construíram (e constroem) a Nossa Igreja.
      </p>
    </>
  );
  const igrejaContent = (
    <>
      <p className="indent-6">
        Nossa igreja, a Assembleia de Deus Templo Central é uma igreja cristã,
        evangélica e pentecostal, com mais de 100 anos de existência, localizada
        na cidade de Fortaleza, Estado do Ceará, que conta com mais de 250
        congregações distribuídas por toda a Capital. Nossa igreja tem como
        visão ser uma comunidade fiel à proclamação e vivência do Evangelho,
        buscando ser relevante no contexto em que está inserida e que busca ser
        reconhecida como um lugar de Restauração, Misericórdia e Ensino.
      </p>
      <p className="indent-6">
        Temos como missão fazer discípulos de Cristo e conduzi-los a amar,
        acolher e servir. Para cumprir nossa visão e missão, estamos
        comprometidos com os valores da comunhão com Deus, integridade,
        lealdade, excelência e serviço. Nossa Igreja é uma igreja bíblica,
        multigeracional, multilocal, que crê na experiência do Pentecostes para
        nossos dias e busca comunicar de maneira íntegra e relevante o Evangelho
        ao mundo contemporâneo.
      </p>
      <p className="indent-6">
        O Projeto Atos 2 é um projeto ministerial e de gestão eclesiástica que
        tem como objetivo proporcionar uma maior celeridade ao crescimento e à
        expansão da Igreja de nosso Senhor Jesus Cristo. O projeto tem como
        finalidade favorecer uma ação pastoral integrada, a fim de gerar
        comunhão e promover a evangelização integral, a ação social, o ensino
        bíblico, a obra missionária e a unidade da Igreja.
      </p>
    </>
  );
  const feContent = (
    <>
      <p className="indent-6">
        Nossa Igreja tem a Palavra de Deus como sua única norma de fé e prática
        para a vida cristã. Cremos em todas as verdades reveladas por Deus nas
        Escrituras Sagradas, seguindo a tradição do cristianismo evangélico e
        pentecostal ao longo dos séculos. Como uma igreja pentecostal, Nossa
        Igreja crê na experiência do batismo com o Espírito Santo e na
        atualidade dos dons espirituais na vida do crente.
      </p>
      <p className="indent-6">
        Historicamente, as Assembleias de Deus têm sintetizado a fé pentecostal
        na seguinte declaração: “Jesus salva, cura, batiza com o Espírito Santo
        e em breve voltará”.
      </p>
      <ol className="list-decimal px-6">
        <li className="indent-1">
          Na inspiração divina verbal e plenária da Bíblia Sagrada, única regra
          infalível de fé e prática para a vida e o caráter cristão (2Tm
          3.14-17);
        </li>
        <li className="indent-1">
          Em um só Deus, eternamente subsistente em três pessoas distintas que,
          embora distintas, são iguais em poder, glória e majestade: o Pai, o
          Filho e o Espírito Santo; Criador do Universo, de todas as coisas que
          há nos céus e na terra, visíveis e invisíveis, e, de maneira especial,
          os seres humanos, por um ato sobrenatural e imediato, e não por um
          processo evolutivo (Dt 6.4; Mt 28.19; Mc 12.29; Gn 1.1;2.7; Hb 11.3 e
          Ap 4.11);
        </li>
        <li className="indent-1">
          No Senhor Jesus Cristo, o Filho Unigênito de Deus, plenamente Deus,
          plenamente Homem, na concepção e no seu nascimento virginal, em sua
          morte vicária e expiatória, em sua ressurreição corporal dentre os
          mortos e em sua ascensão vitoriosa aos céus como Salvador do mundo (Jo
          3.16-18; Rm 1.3,4; Is 7.14; Mt 1.23; Hb 10.12; Rm 8.34 e At 1.9);
        </li>
        <li className="indent-1">
          No Espírito Santo, a terceira pessoa da Santíssima Trindade,
          consubstancial como o Pai e o Filho, Senhor e Vivificador; que
          convence o mundo do pecado, da justiça e do juízo; que regenera o
          pecador; que falou por meio dos profetas e continua guiando o seu povo
          (2Co 13.13; 2Co 3.6,17; Rm 8.2; Jo 16.11; Tt 3.5; 2Pe 1.21 e Jo
          16.13);
        </li>
        <li className="indent-1">
          Na pecaminosidade do homem, que o destituiu da glória de Deus e que
          somente o arrependimento e a fé na obra expiatória e redentora de
          Jesus Cristo podem restaurá-lo a Deus (Rm 3.23; At 3.19);
        </li>
        <li className="indent-1">
          Na necessidade absoluta do novo nascimento pela graça de Deus mediante
          a fé em Jesus Cristo e pelo poder atuante do Espírito Santo e da
          Palavra de Deus para tornar o homem aceito no Reino dos Céus (Jo
          3.3-8, Ef 2.8,9);
        </li>
        <li className="indent-1">
          No perdão dos pecados, na salvação plena e na justificação pela fé no
          sacrifício efetuado por Jesus Cristo em nosso favor (At 10.43; Rm
          10.13; 3.24-26; Hb 7.25; 5.9);
        </li>
        <li className="indent-1">
          Na Igreja, que é o corpo de Cristo, coluna e firmeza da verdade, una,
          santa e universal assembleia dos fieis remidos de todas as eras e
          todos os lugares, chamados do mundo pelo Espírito Santo para seguir a
          Cristo e adorar a Deus (1Co 12.27; Jo 4.23; 1Tm 3.15; Hb 12.23; Ap
          22.17);
        </li>
        <li className="indent-1">
          No batismo bíblico efetuado por imersão em águas, uma só vez, em nome
          do Pai, e do Filho, e do Espírito Santo, conforme determinou o Senhor
          Jesus Cristo (Mt 28.19; Rm 6.1-6; Cl 2.12);
        </li>
        <li className="indent-1">
          Na necessidade e na possibilidade de termos vida santa e
          irrepreensível por obra do Espírito Santo, que nos capacita a viver
          como fiéis testemunhas de Jesus Cristo (Hb 9.14; 1Pe 1.15);
        </li>
        <li className="indent-1">
          No batismo com o Espírito Santo, conforme as Escrituras, que nos é
          dado por Jesus Cristo, demonstrado pela evidência física do falar em
          outras línguas, conforme a sua vontade (At 1.5; 2.4; 10.44-46;
          19.1-7);
        </li>
        <li className="indent-1">
          Na atualidade dos dons espirituais distribuídos pelo Espírito Santo à
          Igreja para sua edificação, conforme Sua soberana vontade para o que
          for útil (1Co 12.1-12);
        </li>
        <li className="indent-1">
          Na segunda vinda de Cristo, em duas fases distintas: a primeira —
          invisível ao mundo, para arrebatar a Sua Igreja, antes da Grande
          Tribulação; a segunda — visível e corporal, com a Sua Igreja
          glorificada, para reinar sobre o mundo durante mil anos (1Ts 4.16, 17;
          1Co 15.51-54; Ap 20.4; Zc 14.5; Jd 14);
        </li>
        <li className="indent-1">
          No comparecimento ante o Tribunal de Cristo de todos os cristãos
          arrebatados, para receberem a recompensa pelos seus feitos em favor da
          causa de Cristo na Terra (2Co 5.10);
        </li>
        <li className="indent-1">
          No Juízo Final, no qual comparecerão todos os ímpios: desde a Criação
          até o fim do Milênio; os que morreram durante o período milenial e os
          que, ao final desta época, estiverem vivos. E na eternidade de
          tristeza e tormento para os infiéis e vida eterna de gozo e felicidade
          para os fiéis de todos os tempos (Mt 25.46; Is 65.20; Ap 20.11-15;
          21.1-4);
        </li>
        <li className="indent-1">
          Cremos, também, que o casamento foi instituído por Deus e ratificado
          por nosso Senhor Jesus Cristo como união entre um homem e uma mulher,
          nascidos macho e fêmea, respectivamente, em conformidade com o
          definido pelo sexo da criação geneticamente determinado (Gn 2.18; Jo
          2.1,2; Gn 2.24; 1.27).
        </li>
      </ol>
      <p className="indent-6">
        Cremos, também, que o casamento foi instituído por Deus e ratificado por
        nosso Senhor Jesus Cristo como união entre um homem e uma mulher,
        nascidos macho e fêmea, respectivamente, em conformidade com o definido
        pelo sexo da criação geneticamente determinado (Gn 2.18; Jo 2.1,2; Gn
        2.24; 1.27).
      </p>
    </>
  );
  const nossaContent = (
    <>
      <h1 className="font-bold">Nossa visão</h1>
      <p className="indent-6">
        Nossa Igreja tem como visão ser “uma comunidade que seja fiel à
        proclamação e a vivência do Evangelho de Cristo, relevante no contexto
        social, reconhecida como um lugar de Restauração, Misericórdia e
        Ensino”.
      </p>

      <h1 className="font-bold">Nossa missão</h1>
      <p className="indent-6">
        {" "}
        Nossa Igreja tem por missão “fazer discípulos e conduzi-los a Amar,
        Acolher e Servir.”
      </p>

      <h1 className="font-bold">Nossos valores</h1>
      <p className="indent-6">
        {" "}
        Nossa Igreja está estruturada em torno dos seguintes valores:
        Integridade, Lealdade, Serviço, Excelência e Comunhão com Deus.
      </p>
    </>
  );

  const renderContent = () => {
    switch (selectedContent) {
      case "historia":
        return historiaContent;
      case "igreja":
        return igrejaContent;
      case "fe":
        return feContent;
      case "nossa":
        return nossaContent;
    }
  };

  return (
    <div
      className={`flex-1 w-full overflow-auto mx-auto px-[4rem] md:px-[6rem] ${colors.fundo} ${colors.text}`}
    >
      <div
        className={`relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
      >
        <Button
          onClick={() => setSelectedContent("historia")}
          className="flex justify-center mt-4 p-6 rounded-lg relative"
        >
          <motion.p
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            Nossa História
          </motion.p>
        </Button>

        <Button
          onClick={() => setSelectedContent("igreja")}
          className="flex justify-center mt-4 p-6 rounded-lg relative"
        >
          <motion.p
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Que igreja é a Nossa Igreja?
          </motion.p>
        </Button>

        <Button
          onClick={() => setSelectedContent("fe")}
          className="flex justify-center mt-4 p-6 rounded-lg relative"
        >
          <motion.p
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Nossa Fé
          </motion.p>
        </Button>

        <Button
          onClick={() => setSelectedContent("nossa")}
          className="flex justify-center mt-4 p-6 rounded-lg relative"
        >
          <motion.p
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Nossa visão, missão e valores
          </motion.p>
        </Button>
      </div>
      {selectedContent && (
        <div className="mt-2 p-4 bg-white text-black rounded-lg mb-4">
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default SobreNos;
