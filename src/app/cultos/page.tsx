import Cultos from "@/components/cultos";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function cultos() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden ">
      <Header />
      <main className="flex-1 overflow-auto">
        <Cultos />
      </main>
      <Footer />
    </div>
  );
}
