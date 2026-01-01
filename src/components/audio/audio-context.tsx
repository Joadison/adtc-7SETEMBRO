'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlayPause: () => void;
  toggleMute: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used dentro do AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const [isHydrated, setIsHydrated] = useState(false);

  // ✅ 1️⃣ Ler localStorage UMA vez
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('audioState');
    if (saved) {
      const state = JSON.parse(saved);
      setIsPlaying(state.isPlaying ?? false);
      setIsMuted(state.isMuted ?? false);
      setVolume(state.volume ?? 1);
    }

    setIsHydrated(true);
  }, []);

  // ✅ 2️⃣ Aplicar estado ao áudio
  useEffect(() => {
    if (!isHydrated) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    if (isPlaying) {
      audio.play().catch(() => {
        // autoplay pode ser bloqueado
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isMuted, volume, isHydrated]);

  // ✅ 3️⃣ Persistir SOMENTE depois de hidratado
  useEffect(() => {
    if (!isHydrated) return;

    localStorage.setItem(
      'audioState',
      JSON.stringify({
        isPlaying,
        isMuted,
        volume,
      })
    );
  }, [isPlaying, isMuted, volume, isHydrated]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        isPlaying,
        isMuted,
        volume,
        togglePlayPause,
        toggleMute,
        handleVolumeChange,
      }}
    >
      <audio
        ref={audioRef}
        src="https://r16.ciclano.io/proxy/rdoassembleia/stream"
        preload="none"
        className="hidden"
      />
      {children}
    </AudioContext.Provider>
  );
};
