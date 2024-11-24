import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full h-full">

        <Image
          src={"https://utfs.io/f/R1WGWTYNvh5qwMto4pfFRC86z4nvx7NU9MfBo2qJwuyjepWc"}
          alt="7Setembro"
          layout="fill"
          objectFit="cover"
          objectPosition="20% 52%"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center md:items-start text-white px-4 md:px-10 lg:px-20 bg-white/20 backdrop-blur-sm shadow-lg">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-2xl">Amar</h1>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-2xl">Acolher</h1>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-2xl">Servir</h1>
          <p className="text-lg md:text-xl mt-4 text-center md:text-left drop-shadow-md">
            um lugar de Restauração, Misericórdia e Ensino.
          </p>
        </div>
      </div>
  );
}
