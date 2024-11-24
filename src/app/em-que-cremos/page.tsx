import Fe from "@/components/fe";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function emquecremos() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden ">
      <Header />
      <main className="flex-1 overflow-auto">
        <Fe />
      </main>
      <Footer />
    </div>
  );
}
