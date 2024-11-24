"use client";

import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";
import { useTheme } from "./theme/theme-context";

const AudioPlayer = () => {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div
      className={`w-full px-12 py-2 m-0  ${colors.background} flex items-center justify-between border-b-4 shadow-lg`}
    >
      {/* Player de Áudio */}
      <audio
        ref={audioRef}
        src="https://r16.ciclano.io:15045/stream"
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden" // Oculta os controles padrão
      />

      {/* Botão Play/Pause */}
      <button
        onClick={togglePlayPause}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
      >
        {isPlaying ? (
          <Pause className="h-2 w-2" />
        ) : (
          <Play className="h-2 w-2" />
        )}
      </button>

      {/* Título ou Informações do Áudio */}
      <div className="flex-grow mx-4 text-center text-white font-semibold text-sm">
        Rádio Templo Central - Ao Vivo
      </div>

      {/* Controle de Volume */}
      <div className="flex items-center space-x-2 relative group px-20">
        {/* Botão Mute */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
        >
          {isMuted ? (
            <VolumeX className="h-2 w-2" />
          ) : (
            <Volume2 className="h-2 w-2" />
          )}
        </button>

        {/* Slider de Volume */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="absolute left-24 w-28 h-1 bg-blue-300 rounded-xl cursor-pointer focus:outline-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          disabled={isMuted} // Desativa o controle se estiver no mudo
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
