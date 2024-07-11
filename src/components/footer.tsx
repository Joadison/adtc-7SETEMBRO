'use client'

import { Instagram } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  return (
    <div className="flex flex-col justify-center text-center p-4 md:p-8 lg:p-12 bg-[#0F2D43] border-t-4 text-[#fff]">
      <div className="p-8 md:p-12 lg:p-16 mb-4 md:mb-6 lg:mb-8 border-y-2 border-[#ed6b0e]">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          “Fazer discípulos e conduzí-los a, amar, acolher e servir.”
        </h1>
      </div>

      <div className="space-y-2 md:space-y-4">
        <h2 className="text-sm md:text-base lg:text-lg">
          Rua Santa Rita, 857 - Siqueira, Fortaleza - CE, 60544-428
          {/* | contato@adtemplocentral.com | Tel: (85) 4008 5200 */}
        </h2>

        <h2 className="text-sm md:text-base lg:text-lg">
          Cultos de Doutrinas - Quinta-Feira: 19:00h às 21:00h | Cultos - Domingo: 18:00h às 20:00h |​ Escola Bíblica - Domingo: 08:00h às 10:00h
        </h2>
      </div>

      <div className="flex justify-center my-2">
        <Button
          className="hover:bg-white hover:text-black flex items-center space-x-2"
          onClick={() => { window.location.href = 'https://www.instagram.com/adtc.7setembro1/'; }}
        >
          <span>Siga a nossa Rede Social</span>
          <Instagram className="text-2xl cursor-pointer" />
        </Button>
      </div>
    </div>
  );
};

export default Footer;
