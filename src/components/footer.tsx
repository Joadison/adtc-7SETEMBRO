"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Instagram,
  MapPin,
  Mail,
  Calendar,
  Clock,
  Facebook,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="https://utfs.io/f/R1WGWTYNvh5qddKtRjImcd8JZLAukXKopthTfwveqr04OaE9"
                alt="AD Templo Central Logo"
                width={80}
                height={80}
                className="h-16 w-16 object-contain brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold">AD Templo Central</span>
                <span className="text-xs text-gray-400">7 DE SETEMBRO</span>
              </div>
            </div>

            <div className="p-4 border-l-2 border-orange-600 mb-4 bg-gray-800/50 rounded">
              <p className="italic text-gray-300">
                &quot;Fazer discípulos e conduzi-los a amar, acolher e
                servir.&quot;
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/adtc.7setembro1/"
                className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.facebook.com/adtc.7setembro1"
                className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.youtube.com/@ADTC7deSetembro1"
                className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-4 w-4" />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {[
                { name: "Em que cremos?", path: "/em-que-cremos" },
                { name: "Sobre nós", path: "/sobre-nos" },
                { name: "Ministérios", path: "/ministerios" },
                { name: "Culto ao Vivo", path: "/cultos" },
                /* { name: "Eventos", path: "/eventos" }, */
                { name: "Contato", path: "/contato" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-white hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Service Times */}
          <div>
            <h3 className="text-lg font-bold mb-4">Horários de Culto</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex flex-wrap items-start">
                <Calendar className="h-4 w-4 mr-2 mt-1 text-orange-500" />
                <div>
                  <p className="font-medium text-white">Cultos - Domingo</p>
                  <div className="flex flex-wrap items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                    <p>18:00h às 20:00h</p>
                  </div>
                </div>
              </li>
              <li className="flex flex-wrap items-start">
                <Calendar className="h-4 w-4 mr-2 mt-1 text-orange-500" />
                <div>
                  <p className="font-medium text-white">
                    Cultos de Doutrinas - Quinta-Feira
                  </p>
                  <div className="flex flex-wrap items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                    <p>19:00h às 21:00h</p>
                  </div>
                </div>
              </li>
              <li className="flex flex-wrap items-start">
                <Calendar className="h-4 w-4 mr-2 mt-1 text-orange-500" />
                <div>
                  <p className="font-medium text-white">
                    Escola Bíblica - Domingo
                  </p>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                    <p>08:00h às 10:00h</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex flex-wrap items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-orange-500" />
                <span>
                  Rua Santa Rita, 857 - Siqueira, Fortaleza - CE, 60544-428
                </span>
              </li>
              <li className="flex flex-wrap items-center">
                <Mail className="h-4 w-4 mr-2 text-orange-500" />
                <span className="break-all">
                  adtemplocentral7setembro1@gmail.com
                </span>
              </li>
            </ul>

            <div className="mt-6">
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/adtc.7setembro1/",
                    "_blank"
                  )
                }
              >
                <Instagram className="mr-2 h-4 w-4" />
                Siga a nossa Rede Social
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            © 2024 AD Templo Central - 7 de Setembro. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
