"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, Clock, Play} from "lucide-react"
import { Button } from "@/components/ui/button"
//import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
//import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Video {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    publishedAt: string
    description: string
    thumbnails: {
      high: {
        url: string
      }
      default: {
        url: string
        width: number
        height: number
      }
    }
  }
}

const Cultos = () => {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([])
  //const [isLive, setIsLive] = useState(false)
  //const [liveVideo, setLiveVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("todos")
  //const [nextService, setNextService] = useState<string>("")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchChannelId = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_APIKEY
        const channelId = process.env.NEXT_PUBLIC_CHANNELID

        // Fetch videos
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=20&order=date&type=video&key=${apiKey}`,
        )

        if (!videosResponse.ok) {
          throw new Error("Erro ao buscar vídeos do YouTube")
        }

        const videosData = await videosResponse.json()
        setVideos(videosData.items || [])

        // Fetch live stream
        const liveResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`,
        )

        if (!liveResponse.ok) {
          throw new Error("Erro ao buscar transmissão ao vivo do YouTube")
        }

        const liveData = await liveResponse.json()
        if (liveData.items && liveData.items.length > 0) {
          //setIsLive(true)
          //setLiveVideo(liveData.items[0])
        } else {
          // Calculate next service time
          const now = new Date()
          const dayOfWeek = now.getDay() // 0 = Sunday, 4 = Thursday
          let nextServiceDate

          if (dayOfWeek === 0) {
            // If today is Sunday, check if it's before 6 PM
            if (now.getHours() < 18) {
              nextServiceDate = new Date(now)
              nextServiceDate.setHours(18, 0, 0, 0)
            } else {
              // Next Thursday
              nextServiceDate = new Date(now)
              nextServiceDate.setDate(now.getDate() + (4 - 0))
              nextServiceDate.setHours(19, 0, 0, 0)
            }
          } else if (dayOfWeek === 4) {
            // If today is Thursday, check if it's before 7 PM
            if (now.getHours() < 19) {
              nextServiceDate = new Date(now)
              nextServiceDate.setHours(19, 0, 0, 0)
            } else {
              // Next Sunday
              nextServiceDate = new Date(now)
              nextServiceDate.setDate(now.getDate() + (7 - 4))
              nextServiceDate.setHours(18, 0, 0, 0)
            }
          } else if (dayOfWeek < 4) {
            // If before Thursday, next service is Thursday
            nextServiceDate = new Date(now)
            nextServiceDate.setDate(now.getDate() + (4 - dayOfWeek))
            nextServiceDate.setHours(19, 0, 0, 0)
          } else {
            // If after Thursday, next service is Sunday
            nextServiceDate = new Date(now)
            nextServiceDate.setDate(now.getDate() + (7 - dayOfWeek))
            nextServiceDate.setHours(18, 0, 0, 0)
          }

          // Format the date
          /* const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
          } */
          //setNextService(nextServiceDate.toLocaleDateString("pt-BR", options))
        }

        setLoading(false)
      } catch (error) {
        console.error("Erro ao buscar vídeos do YouTube:", error)
        setLoading(false)
      }
    }

    fetchChannelId()
  }, [])

  // Filter videos based on active tab
  const filteredVideos = videos.filter((video) => {
    if (activeTab === "todos") return true
    //if (activeTab === "cultos") return video.snippet.title.toLowerCase().includes("culto")
    //if (activeTab === "estudos") return video.snippet.title.toLowerCase().includes("estudo")
    //if (activeTab === "eventos") return video.snippet.title.toLowerCase().includes("evento")
    return true
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const closeVideoModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedVideo(null), 300)
  }

  return (
    <div className="flex-1 overflow-auto py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Culto ao Vivo</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Assista nossas transmissões ao vivo e cultos anteriores. Participe de onde estiver e seja edificado pela
            Palavra de Deus.
          </p>
        </motion.div>

        {/* Live Stream or Next Service Section */}
        {/* <div className="mb-12">
          {isLive && liveVideo ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Badge className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                AO VIVO
              </Badge>
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1&mute=0`}
                  title={liveVideo.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-bold">{liveVideo.snippet.title}</h2>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Curtir
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl overflow-hidden border border-orange-200"
            >
              <div className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Próxima Transmissão ao Vivo</h2>
                <div className="flex justify-center items-center gap-3 mb-6">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <span className="text-xl font-medium capitalize">{nextService}</span>
                </div>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  Não estamos ao vivo no momento. Nossa próxima transmissão será no horário indicado acima. Enquanto
                  isso, você pode assistir a nossos cultos anteriores abaixo.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Bell className="mr-2 h-4 w-4" />
                    Receber Lembrete
                  </Button>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Ver Agenda de Cultos
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div> */}

        {/* Videos Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Cultos Anteriores</h2>
            {/* <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="cultos">Cultos</TabsTrigger>
                <TabsTrigger value="estudos">Estudos</TabsTrigger>
                <TabsTrigger value="eventos">Eventos</TabsTrigger>
              </TabsList>
            </Tabs> */}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <motion.div
                    key={video?.id.videoId}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                  >
                    <Card
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openVideoModal(video)}
                    >
                      <div className="relative">
                        <Image
                          src={video?.snippet.thumbnails.high.url || "/placeholder.svg"}
                          alt={video?.snippet.title}
                          width={640}
                          height={360}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            className="h-12 w-12 rounded-full bg-orange-600 hover:bg-orange-700"
                            onClick={() => openVideoModal(video)}
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium line-clamp-2 mb-2">{video?.snippet.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(video?.snippet.publishedAt)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Nenhum vídeo encontrado para esta categoria.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Participe Presencialmente</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Embora disponibilizemos nossos cultos online, convidamos você a participar presencialmente e experimentar
              a comunhão com outros irmãos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold mb-2 text-orange-600">Cultos de Celebração</h3>
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Domingo</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>18:00h às 20:00h</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold mb-2 text-orange-600">Cultos de Doutrina</h3>
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Quinta-feira</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>19:00h às 21:00h</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold mb-2 text-orange-600">Escola Bíblica</h3>
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Domingo</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>08:00h às 10:00h</span>
                </div>
              </div>
            </div>
            <Button className="bg-orange-600 text-white hover:bg-orange-700" onClick={() => router.push("https://bit.ly/enderecoadtc7stm")}>Como Chegar</Button>
          </div>
        </motion.div>

        {/* Video Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full bg-black/20 hover:bg-black/40 text-white"
                  onClick={closeVideoModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                  </svg>
                </Button>
              </div>

              <div className="aspect-video w-full">
                {selectedVideo && (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1`}
                    title={selectedVideo.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                )}
              </div>

              <div className="p-4">
                {selectedVideo && (
                  <>
                    <h2 className="text-xl font-bold">{selectedVideo.snippet.title}</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(selectedVideo.snippet.publishedAt)}</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cultos
