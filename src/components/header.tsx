"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTheme } from "./theme/theme-context";
import AudioPlayer from "./audio/AudioPlayer";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { colors } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (route: string) => {
    router.push(route);
    setIsMenuOpen(false);
  };

  return (
    <>
    <AudioPlayer/>
    <header
      className={`flex justify-between items-center px-4 pt-4 pb-8 md:px-6 md:pb-6 lg:px-10  ${colors.background} border-b-4`}
    >
      <div
        className="w-56 h-16 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src="https://utfs.io/f/4e99fe31-7f29-4994-80fe-ebd9fd09130e-leijnu.png"
          alt="7Setembro"
          width={1000}
          height={20}
          className="object-cover"
        />
      </div>

      <div className="hidden md:flex flex-wrap justify-center text-sm md:text-md">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigateTo("/em-que-cremos")}
        >
          Em que cremos?
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigateTo("/sobre-nos")}
        >
          Sobre nós
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigateTo("/ministerios")}
        >
          Ministérios
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigateTo("/cultos")}
        >
          Culto ao Vivo
        </Button>
        {/* <Button
          type="button"
          variant="ghost"
          onClick={() => navigateTo("/config")}
        >
          Configuração
        </Button> */}
      </div>

      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-8 w-8 text-white" />
          ) : (
            <Menu className="h-8 w-8 text-white" />
          )}
        </button>
      </div>

      {/* Menu Mobile */}
      <div
        className={`fixed top-[7rem] left-0 w-full h-full ${
          colors.background_mobiel
        } z-50 overflow-hidden ${isMenuOpen ? "flex" : "hidden"} md:hidden`}
      >
        <div className="flex flex-col items-center justify-start w-full">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/em-que-cremos")}
            className="my-1 text-center p-10 text-2xl" 
          >
            Em que cremos?
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/sobre-nos")}
            className="my-1 text-center p-10 text-2xl"
          >
            Sobre nós
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/ministerios")}
            className="my-1 text-center p-10 text-2xl"
          >
            Ministérios
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/cultos")}
            className="my-1 text-center p-10 text-2xl"
          >
            Culto ao Vivo
          </Button>
          {/* <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/config")}
            className="my-2 text-center"
          >
            Configuração
          </Button> */}
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
