import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <Header />
      <div className="relative w-[1903px] h-[803px] mx-auto">
        <Image
          src={
            "https://static.wixstatic.com/media/a29ff5_9e3b8e112cc349b5938a737abaca03ed~mv2.jpg/v1/fill/w_1903,h_803,al_t,q_85,usm_0.66_1.00_0.01,enc_auto/a29ff5_9e3b8e112cc349b5938a737abaca03ed~mv2.jpg"
          }
          alt="7Setembro"
          layout="fill"
          objectFit="cover"
          objectPosition="50% 0%"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start text-[#fff] pl-10">
          <h1 className="text-6xl font-bold">Amar</h1>
          <h1 className="text-6xl font-bold">Acolher</h1>
          <h1 className="text-6xl font-bold">Servir</h1>
          <p className="text-xl mt-4">
            um lugar de Restauração, Misericórdia e Ensino.
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
