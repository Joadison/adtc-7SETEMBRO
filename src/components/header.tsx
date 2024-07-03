"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import adtcImage from '../../public/adtc.png';

const Header = () => {
  const router = useRouter();

  const home = () => {
    router.push('/')
  };
  return (
    <div className="flex justify-between p-12 bg-[#f18c44c7] border-b-4">
      <Image
          src={adtcImage}
          alt="7Setembro"
          width={180} 
          height={30}
          onClick={home}
        />
      <div className=" gap-2 text-[#fff] ">
        <Button type="button" variant={"ghost"}>Em que cremos?</Button>
        <Button type="button" variant={"ghost"}>Sobre nós</Button>
        <Button type="button" variant={"ghost"}>Ministérios</Button>
        <Button type="button" variant={"ghost"}>Culto ao Vivo</Button>
        <Button type="button" variant={"ghost"}>Rádio Templo Central</Button>
        <Button type="button" variant={"ghost"}>Contato</Button>
        <Button type="button" variant={"ghost"}>Solicitação para Orações</Button>
        <Button type="button" variant={"ghost"} onClick={() => {router.push('/config')}}>Configuração</Button>
      </div>
    </div>
  );
};

export default Header;
