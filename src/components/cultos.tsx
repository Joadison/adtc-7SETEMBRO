"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./theme/theme-context";

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
}

const Cultos = () => {
  const { colors } = useTheme();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannelId = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_APIKEY;
        const channelId = process.env.NEXT_PUBLIC_CHANNELID;
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=20&order=date&key=${apiKey}`
        );

        if (!videosResponse.ok) {
          throw new Error("Erro ao buscar vídeos do YouTube");
        }

        const videosData = await videosResponse.json();
        setVideos(videosData.items);

        const liveResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`
        );

        if (!liveResponse.ok) {
          throw new Error("Erro ao buscar transmissão ao vivo do YouTube");
        }

        const liveData = await liveResponse.json();
        if (liveData.items.length > 0) {
          setIsLive(true);
        } else {
          setIsLive(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar vídeos do YouTube:", error);
        setLoading(false);
      }
    };

    fetchChannelId();
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className={`overflow-y-auto max-h-full ${colors.fundo} ${colors.text}`}>
        {isLive && (
          <div className="bg-red-600 text-white text-center p-2 mb-4">LIVE</div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((video) => (
            <motion.div
              key={video?.id.videoId}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="p-4"
            >
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video?.id.videoId}`}
                title={video?.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p className="mt-2 text-sm font-medium">{video?.snippet.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cultos;
