import Config from "@/components/configuração";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex-1 relative">
        <Config />
      </div>
      <Footer />
    </div>
  );
}
