'use client'

import { Instagram } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './theme/theme-context';
import Image from 'next/image';

const Footer = () => {
  const { colors } = useTheme();
  return (
    <div className={`flex flex-col justify-center items-center text-center p-2 md:p-4  ${colors.background} border-t-4 ${colors.text}`}>
      <Image 
      src={"https://utfs.io/f/R1WGWTYNvh5qddKtRjImcd8JZLAukXKopthTfwveqr04OaE9"}
      alt='ADTCFOOTER'
      width={120}
      height={30}
      className="object-cover object-center mb-4"
      />
      {/* <div className="p-8 md:p-12 lg:p-16 mb-4 md:mb-6 lg:mb-8 border-y-2 border-[#ed6b0e]">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          “Fazer discípulos e conduzí-los a, amar, acolher e servir.”
        </h1>
      </div> */}

      <div className="space-y-1 md:space-y-2">
        <h2 className="text-sm md:text-base lg:text-lg text-white">
          Rua Santa Rita, 857 - Siqueira, Fortaleza - CE, 60544-428
          {/* | contato@adtemplocentral.com | Tel: (85) 4008 5200 */}
        </h2>

        <h2 className="text-sm md:text-base lg:text-lg  text-white">
        Cultos - Domingo: 18:00h às 20:00h | Cultos de Doutrinas - Quinta-Feira: 19:00h às 21:00h |​ Escola Bíblica - Domingo: 08:00h às 10:00h
        </h2>
      </div>

      <div className="flex justify-center my-1">
        <Button
          className="flex items-center space-x-2"
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
