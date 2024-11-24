import Footer from "@/components/footer";
import Header from "@/components/header";
import SobreNos from "@/components/sobre-nos";

export default function Sobrenos() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden ">
      <Header />
      <main className="flex-1 overflow-auto">
        <SobreNos />
      </main>
      <Footer />
    </div>
  );
}
