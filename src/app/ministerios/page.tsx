import VLibras from "@/components/Acessibilidade/Libras";
import Ministerios from "@/components/ministerios";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function page() {
  return (
    <DefaultLayout>
      <VLibras />
      <Ministerios />
    </DefaultLayout>
  );
}
