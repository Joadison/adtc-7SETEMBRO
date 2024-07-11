import Footer from "@/components/footer";
import Header from "@/components/header";

export default function RadioPlayer () {
  return (
    <div className="w-full">
      <Header />
      <div className="flex flex-col w-full h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh] justify-center items-center p-12 bg-[#0F2D43] text-[#fff] mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">Ouça a nossa Rádio</h2>
        <audio controls className="w-full max-w-md">
        <source src="https://r16.ciclano.io:15045/stream" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      </div>
      <Footer/>
    </div>
  );
}
