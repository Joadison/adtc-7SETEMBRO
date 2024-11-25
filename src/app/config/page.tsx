import Config from "@/components/configuração";
import ConfigLayout from "../../layouts/ConfigLayout";

export const metadata = {
  title: "Configuração | ADTC 7 de Setembro",
};

export default function ConfigPage() {
  return (
    <ConfigLayout>
      <Config />
    </ConfigLayout>
  );
}