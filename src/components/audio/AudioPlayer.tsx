"use client";

import React, { useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "./audio-context";

const AudioPlayer = () => {
  const {
    audioRef,
    isPlaying,
    volume,
    isMuted,
    togglePlayPause,
    toggleMute,
    handleVolumeChange,
  } = useAudio();

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef?.current) {
        setProgress(audioRef.current.currentTime);
        const dur = audioRef.current.duration;
        setDuration(!isNaN(dur) && isFinite(dur) ? dur : null);
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [audioRef]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const isLive = duration === null;

  return (
    <div className="fixed top-0 z-50 w-full h-auto bg-gray-900 shadow-lg flex flex-row justify-center items-center py-[0.1px]">
      <button
        onClick={togglePlayPause}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
      <div className="flex justify-center items-center space-x-2 w-[46%] mx-6">
        <span className="md:flex hidden text-xs text-white w-10 text-right">
          {formatTime(progress)}
        </span>
        <input
          type="range"
          min={0}
          max={duration ?? progress + 1}
          step={0.1}
          value={progress}
          onChange={(e) => {
            if (!isLive && audioRef?.current) {
              const newTime = parseFloat(e.target.value);
              audioRef.current.currentTime = newTime;
              setProgress(newTime);
            }
          }}
          className={`md:flex hidden w-full m-2 h-1 rounded-lg cursor-pointer transition-all ${
            isLive ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
          }`}
          disabled={isLive}
        />
        <span className="text-xs text-red-500 font-semibold ml-2 animate-pulse whitespace-nowrap">
          🔴 AO VIVO
        </span>
      </div>

      <div className="flex flex-row items-center justify-between space-x-1 ml-2 group">
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Ativar som" : "Desativar som"}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>

        <div className="relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className={`absolute left-0 w-24 h-1 bg-blue-300 rounded-xl cursor-pointer focus:outline-none transition-all duration-300 ${
              isMuted
                ? "opacity-0 pointer-events-none"
                : "opacity-0 group-hover:opacity-100 focus:opacity-100 active:opacity-100"
            }`}
            disabled={isMuted}
            aria-label="Controle de volume"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
