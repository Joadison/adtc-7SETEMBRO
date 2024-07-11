"use client"

import React from "react";
import { motion } from "framer-motion";

const Fe = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 items-center">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8"
      >
        Em que cremos?
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold">Na Bíblia Sagrada</h2>
        <p className="mt-2">
          Cremos na Bíblia Sagrada como única regra infalível de fé e prática para a vida e o caráter cristão.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold">Na Trindade</h2>
        <p className="mt-2">
          Cremos em um só Deus, eternamente subsistente em três pessoas distintas que, embora distintas, são iguais em poder, glória e majestade: o Pai, o Filho e o Espírito Santo.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold">Que Jesus Cristo salva.</h2>
        <p className="mt-2">
          Cremos na pecaminosidade do homem, que o destituiu da glória de Deus e que somente o arrependimento e a fé na obra expiatória e redentora de Jesus Cristo podem restaurá-lo a Deus.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold">Na Igreja</h2>
        <p className="mt-2">
          Cremos na Igreja como corpo de Cristo, coluna e firmeza da verdade, assembleia dos fieis remidos de todas as eras e todos os lugares.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold">No Batismo com o Espírito Santo.</h2>
        <p className="mt-2">
          Cremos no batismo no Espírito Santo, que nos é dado por Jesus Cristo, demonstrado pela evidência física do falar em outras línguas, e na atualidade dos dons espirituais distribuídos pelo Espírito Santo à Igreja para sua edificação.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold">Que Jesus voltará.</h2>
        <p className="mt-2">
          Cremos na segunda vinda de Cristo, em duas fases distintas e na eternidade de tristeza e tormento para os infiéis e vida eterna de gozo e felicidade para os fiéis de todos os tempos.
        </p>
      </motion.div>
    </div>
  );
};

export default Fe;
