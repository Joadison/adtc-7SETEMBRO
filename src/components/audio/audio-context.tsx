'use client';

import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  togglePlayPause: () => void;
  toggleMute: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('audioState');
      return saved ? JSON.parse(saved).isPlaying : false;
    }
    return false;
  });
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('audioState');
      return saved ? JSON.parse(saved).isMuted : false;
    }
    return false;
  });
  
  const [volume, setVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('audioState');
      return saved ? JSON.parse(saved).volume : 1;
    }
    return 1;
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioState', JSON.stringify({
        isPlaying,
        isMuted,
        volume
      }));
    }
  }, [isPlaying, isMuted, volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Erro ao reproduzir áudio:", error);
      });
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Erro ao retomar reprodução:", error);
      });
    }
  }, []);

  return (
    <AudioContext.Provider value={{audioRef, isPlaying, volume, isMuted, togglePlayPause, toggleMute, handleVolumeChange }}>
      <audio ref={audioRef} src="https://r16.ciclano.io/proxy/rdoassembleia/stream" autoPlay={isPlaying} className="hidden" />
      {children}
    </AudioContext.Provider>
  );
};
