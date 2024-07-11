import Fe from "@/components/fe";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function emquecremos() {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 xl:p-20 bg-[#1c4f74] text-[#fff] mx-auto">
        <Fe/>
      </div>
      <Footer/>
    </div>
  );
}
