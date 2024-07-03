import Config from "@/components/configuração";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="w-full">
      <Header />
      <div className="relative w-[1903px] h-[803px] mx-auto">
        <Config/>
      </div>
      {/* <Footer/> */}
    </div>
  );
}
