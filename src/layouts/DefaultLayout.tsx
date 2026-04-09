"use client"
import { AudioProvider } from "@/components/audio/audio-context";
import AudioPlayer from "@/components/audio/AudioPlayer";
import { CalendarNotification } from "@/components/calendar/CalendarNotification";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useEffect } from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("Service Worker registrado"))
      .catch(err => console.error("Erro SW:", err));
  }
}, []);

  return (
    <AudioProvider>
      <div className="flex flex-col min-h-screen">
        <AudioPlayer/>
        <Header />
        <>{children}</>
        <Footer />
        {/* <CalendarNotification /> */}
      </div>
    </AudioProvider>
  );
}
