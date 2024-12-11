import Snowfall from "@/components/Snowfall";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function Test() {
  return (
    <DefaultLayout>
      <div className="bg-black w-full h-full">
         <Snowfall />

      </div>
    </DefaultLayout>
  );
}
