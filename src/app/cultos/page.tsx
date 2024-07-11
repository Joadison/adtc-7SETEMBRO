import Cultos from "@/components/cultos";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function cultos() {
  return (
    <div className="w-full">
      <Header />
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh]">
        <Cultos/>
      </div>
      <Footer/>
    </div>
  );
}
