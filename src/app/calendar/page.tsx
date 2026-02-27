import { ChurchCalendar } from "@/components/calendar/church-calendar";
import DefaultLayout from "@/layouts/DefaultLayout";

export const metadata = {
  title: "Calendário  | ADTC 7 de Setembro",
};

export default function CalendarPage() {
  return (
    <DefaultLayout>
      <div className="flex-1 overflow-auto">
        <div className="relative w-full h-full px-4 py-14">
          <ChurchCalendar />
        </div>
      </div>
    </DefaultLayout>
  );
}