import { AudioProvider } from "@/components/audio/audio-context";
import AudioPlayer from "@/components/audio/AudioPlayer";
import { CalendarNotification } from "@/components/calendar/CalendarNotification";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AudioProvider>
      <div className="flex flex-col min-h-screen">
        <AudioPlayer/>
        <Header />
        <>{children}</>
        <Footer />
        <CalendarNotification />
      </div>
    </AudioProvider>
  );
}
