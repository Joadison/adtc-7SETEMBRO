import Ministerios from "@/components/ministerios";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function page() {
  return (
    <DefaultLayout>
      <div className="flex-1 overflow-auto">
        <Ministerios />
      </div>
    </DefaultLayout>
  );
}
