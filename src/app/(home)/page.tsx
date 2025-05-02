import Snowfall from "@/components/Snowfall";
import DefaultLayout from "@/layouts/DefaultLayout";
import Main from "@/components/main";

export default function Home() {
  return (
    <DefaultLayout>
    <div className="flex-1 overflow-auto">
      <div className="relative w-full h-full">
        <Main/>
      </div>
    </div>
    </DefaultLayout>
  );
}
