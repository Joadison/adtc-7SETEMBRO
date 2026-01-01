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
    if (!isPlaying) return;
    const updateProgress = () => {
      if (audioRef?.current) {
        setProgress(audioRef.current.currentTime);
        const dur = audioRef.current.duration;
        setDuration(!isNaN(dur) && isFinite(dur) ? dur : null);
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [audioRef, isPlaying]);

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
    <div className="fixed top-0 z-50 w-full bg-gray-900 shadow-lg">
      <div className="flex items-center w-full relative px-4 py-2">
        <div className="flex-1 text-white text-sm font-semibold whitespace-nowrap">
          <span className="">
            FM 102,3
          </span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-3">
          <button
            onClick={togglePlayPause}
            className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xs text-white w-10 text-right">
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
              className={`w-40 h-1 rounded-lg cursor-pointer ${
                isLive ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
              }`}
              disabled={isLive}
            />
          </div>

          <span className="text-xs text-red-500 font-semibold animate-pulse whitespace-nowrap">
            🔴 AO VIVO
          </span>

          <div className="flex items-center space-x-1 group">
            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Ativar som" : "Desativar som"}
              className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              disabled={isMuted}
              className="w-24 h-1 bg-blue-300 rounded-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>

  );
};


export default AudioPlayer;
