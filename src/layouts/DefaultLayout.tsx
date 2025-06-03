import { AudioProvider } from "@/components/audio/audio-context";
import AudioPlayer from "@/components/audio/AudioPlayer";
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
        <AudioPlayer />
        <Header />
        <>{children}</>
        <Footer />
      </div>
    </AudioProvider>
  );
}
