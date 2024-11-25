'use client';

import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from './audio-context';

const AudioPlayer = () => {
  const { isPlaying, volume, isMuted, togglePlayPause, toggleMute, handleVolumeChange } = useAudio();

  return (
    <div className="fixed z-50 left-0 top-1/4 transform -translate-y-1/2 w-16 h-auto bg-gray-900 rounded-r-lg shadow-lg flex flex-col items-center space-y-4 py-4">
      <button
        onClick={togglePlayPause}
        className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>

      <div className="flex flex-row items-center justify-between space-y-2 group">
        <button
          onClick={toggleMute}
          className="p-2 ml-20 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-blue-300 rounded-xl cursor-pointer focus:outline-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          disabled={isMuted}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
