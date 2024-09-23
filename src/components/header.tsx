"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (route: string) => {
    router.push(route);
    setIsMenuOpen(false);
  };

  return (
    <header className="flex justify-between items-center p-4 md:p-6 lg:p-10 bg-[#ed6b0e] border-b-4">
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

      <div className="hidden md:flex flex-wrap justify-center text-[#fff] text-sm md:text-md">
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
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigateTo("/radio")}
        >
          Rádio Templo Central
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigateTo("/config")}
        >
          Configuração
        </Button>
      </div>

      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-8 w-8 text-white" /> : <Menu className="h-8 w-8 text-white" />}
        </button>
      </div>

      {/* Menu Mobile */}
      <div className={`fixed top-20 right-0 w-[10rem] bg-[#ed6b0e] z-50 overflow-hidden ${isMenuOpen ? "flex" : "hidden"} md:hidden`}>
        <div className="flex flex-col items-center justify-center h-full  text-[#fff]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/em-que-cremos")}
            className="my-2 text-center"
          >
            Em que cremos?
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/sobre-nos")}
            className="my-2 text-center"
          >
            Sobre nós
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/ministerios")} 
            className="my-2 text-center"
          >
            Ministérios
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/cultos")}
            className="my-2 text-center"
          >
            Culto ao Vivo
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/radio")}
            className="my-2 text-center"
          >
            Rádio Templo Central
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigateTo("/config")}
            className="my-2 text-center"
          >
            Configuração
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
