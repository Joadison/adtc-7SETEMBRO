import Cultos from "@/components/cultos";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function cultos() {
  return (
    <DefaultLayout>
      <div className="flex-1 overflow-auto">
        <Cultos />
      </div>
    </DefaultLayout>
  );
}
