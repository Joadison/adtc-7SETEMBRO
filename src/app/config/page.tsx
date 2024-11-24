import Config from "@/components/configuração";

export const metadata = {
  title: "Configuração | ADTC 7 de Setembro",
};

export default function ConfigPage() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col w-screen h-screen">
      <Config />
    </div>
  );
}