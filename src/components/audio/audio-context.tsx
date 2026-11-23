
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  ReactNode,
  RefObject,
} from "react";

interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
}

interface AudioContextType {
  audioRef: RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlayPause: () => void;
  toggleMute: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DEFAULT_AUDIO_STATE: AudioState = {
  isPlaying: false,
  isMuted: false,
  volume: 1,
};

const STORAGE_KEY = "audioState";
const AUDIO_EVENT = "audioStateChange";

// ================= STORAGE =================

function readAudioState(): AudioState {
  if (typeof window === "undefined") {
    return DEFAULT_AUDIO_STATE;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_AUDIO_STATE;
    }

    const parsed = JSON.parse(saved);

    return {
      isPlaying: parsed.isPlaying ?? false,
      isMuted: parsed.isMuted ?? false,
      volume: typeof parsed.volume === "number"
        ? Math.min(1, Math.max(0, parsed.volume))
        : 1,
    };
  } catch {
    return DEFAULT_AUDIO_STATE;
  }
}

function writeAudioState(state: AudioState) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Notifica os subscribers dentro da mesma aba
    window.dispatchEvent(new Event(AUDIO_EVENT));
  } catch {
    // localStorage pode estar indisponível
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(AUDIO_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUDIO_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// ================= SNAPSHOTS =================

function getIsPlayingSnapshot() {
  return readAudioState().isPlaying;
}

function getIsMutedSnapshot() {
  return readAudioState().isMuted;
}

function getVolumeSnapshot() {
  return readAudioState().volume;
}

// Snapshot do servidor para evitar divergência na hidratação
function getServerIsPlayingSnapshot() {
  return DEFAULT_AUDIO_STATE.isPlaying;
}

function getServerIsMutedSnapshot() {
  return DEFAULT_AUDIO_STATE.isMuted;
}

function getServerVolumeSnapshot() {
  return DEFAULT_AUDIO_STATE.volume;
}

// ================= CONTEXT =================

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used dentro do AudioProvider");
  }

  return context;
};

// ================= PROVIDER =================

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({
  children,
}: AudioProviderProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const isPlaying = useSyncExternalStore(
    subscribe,
    getIsPlayingSnapshot,
    getServerIsPlayingSnapshot
  );

  const isMuted = useSyncExternalStore(
    subscribe,
    getIsMutedSnapshot,
    getServerIsMutedSnapshot
  );

  const volume = useSyncExternalStore(
    subscribe,
    getVolumeSnapshot,
    getServerVolumeSnapshot
  );

  // ================= SINCRONIZAR ÁUDIO =================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    if (isPlaying) {
      audio.play().catch(() => {
        // O navegador pode bloquear autoplay.
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isMuted, volume]);

  // ================= ATUALIZAR STORAGE =================

  const atualizarAudioState = (updates: Partial<AudioState>) => {
    const atual = readAudioState();

    writeAudioState({
      ...atual,
      ...updates,
    });
  };

  // ================= CONTROLES =================

  const togglePlayPause = () => {
    atualizarAudioState({
      isPlaying: !isPlaying,
    });
  };

  const toggleMute = () => {
    atualizarAudioState({
      isMuted: !isMuted,
    });
  };

  const handleVolumeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    atualizarAudioState({
      volume: Math.min(1, Math.max(0, parseFloat(e.target.value))),
    });
  };

  // ================= RENDER =================

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
