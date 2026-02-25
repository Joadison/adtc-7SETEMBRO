import { ChurchCalendar } from "@/components/calendar/church-calendar";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-background px-4 py-6 sm:px-6 lg:px-8">
      <ChurchCalendar />
    </main>
  );
}
