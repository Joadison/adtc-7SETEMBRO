import SobreNos from "@/components/sobre-nos";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function Sobrenos() {
  return (
    <DefaultLayout>
      <div className="flex-1 overflow-auto">
        <SobreNos />
      </div>
    </DefaultLayout>
  );
}
