
"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { ArrowLeft, Camera, SwitchCamera } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FrameSelector, type Frame } from "@/components/cam/frame-selector"

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void
}

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  focusMode?: string[]
  pointsOfInterest?: boolean
}

interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  focusMode?: string
  pointsOfInterest?: Array<{ x: number; y: number }>
}

export function CameraView({ onCapture }: CameraViewProps) {
  const router = useRouter()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [isReady, setIsReady] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    setIsReady(false)

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Seu navegador não suporta acesso à câmera. Verifique se a página está em HTTPS."
        )
      }

      stopCamera()

      const isIOS =
        /iPhone|iPad|iPod/i.test(navigator.userAgent) &&
        "ontouchend" in document

      const videoConstraints: MediaTrackConstraints = isIOS
        ? {
            facingMode: facing,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 },
          }
        : {
            facingMode: facing,
            aspectRatio: { ideal: 9 / 16 },
            frameRate: { ideal: 60 },
          }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      })

      streamRef.current = stream

      const track = stream.getVideoTracks()[0]

      if (track?.getCapabilities) {
        const capabilities =
          track.getCapabilities() as ExtendedMediaTrackCapabilities

        if (capabilities.focusMode?.includes("continuous")) {
          try {
            await track.applyConstraints({
              advanced: [
                {
                  focusMode: "continuous",
                } as ExtendedMediaTrackConstraintSet,
              ],
            })
          } catch {
            console.info("Foco contínuo não suportado.")
          }
        }
      }

      const video = videoRef.current

      if (video) {
        video.srcObject = stream

        await video.play().catch(() => {
          console.warn("Não foi possível iniciar o vídeo automaticamente.")
        })

        if (video.videoWidth > 0) {
          setIsReady(true)
        } else {
          video.onloadedmetadata = () => {
            setIsReady(true)
          }
        }
      }
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error)

      const message =
        error instanceof Error
          ? error.message
          : "Verifique as permissões e se a página está em HTTPS."

      alert(`Erro ao acessar câmera: ${message}`)
    }
  }, [stopCamera])

  useEffect(() => {
    startCamera(facingMode)

    return () => {
      stopCamera()
    }
  }, [facingMode, startCamera, stopCamera])

  const handleSelectFrame = (frame: Frame) => {
    setSelectedFrame(frame.id === "frame-0" ? null : frame)
  }

  const handleFlipCamera = () => {
    setIsReady(false)
    setFacingMode((prev) =>
      prev === "user" ? "environment" : "user"
    )
  }

  const handleFocus = async (event: React.TouchEvent<HTMLVideoElement> | React.MouseEvent<HTMLVideoElement>) => {
    const stream = streamRef.current
    const video = videoRef.current

    if (!stream || !video) return

    const track = stream.getVideoTracks()[0]

    if (!track?.getCapabilities) return

    const capabilities =
      track.getCapabilities() as ExtendedMediaTrackCapabilities

    if (!capabilities.pointsOfInterest) return

    const rect = video.getBoundingClientRect()

    const clientX =
      "touches" in event
        ? event.touches[0]?.clientX
        : event.clientX

    const clientY =
      "touches" in event
        ? event.touches[0]?.clientY
        : event.clientY

    if (clientX === undefined || clientY === undefined) return

    const focusX = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    )

    const focusY = Math.max(
      0,
      Math.min(1, (clientY - rect.top) / rect.height)
    )

    try {
      await track.applyConstraints({
        advanced: [
          {
            pointsOfInterest: [{ x: focusX, y: focusY }],
            focusMode: "continuous",
          } as ExtendedMediaTrackConstraintSet,
        ],
      })
    } catch {
      console.info("Foco por toque não suportado.")
    }
  }

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !isReady) return

    const videoW = video.videoWidth
    const videoH = video.videoHeight

    if (!videoW || !videoH) return

    // Proporção de Stories: 9:16
    const targetRatio = 9 / 16

    let cropW = videoW
    let cropH = videoW / targetRatio

    if (cropH > videoH) {
      cropH = videoH
      cropW = videoH * targetRatio
    }

    const cropX = (videoW - cropW) / 2
    const cropY = (videoH - cropH) / 2

    canvas.width = cropW
    canvas.height = cropH

    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Espelhamento da câmera frontal
    if (facingMode === "user") {
      ctx.translate(cropW, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(
      video,
      cropX,
      cropY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH
    )

    ctx.setTransform(1, 0, 0, 1, 0, 0)

    const finalizeCapture = () => {
      onCapture(canvas.toDataURL("image/png"))
    }

    if (selectedFrame) {
      const frameImg = new window.Image()

      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, cropW, cropH)
        finalizeCapture()
      }

      frameImg.onerror = () => {
        console.error("Erro ao carregar a moldura.")
        finalizeCapture()
      }

      frameImg.src = selectedFrame.src
    } else {
      finalizeCapture()
    }
  }

  const handleGoBack = () => {
    stopCamera()
    router.push("/")
  }

  return (
    <div>
      <div
        className="relative w-full flex-1 overflow-hidden rounded-2xl bg-muted"
        style={{
          aspectRatio: "9 / 16",
          height: "100%",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          disablePictureInPicture
          controls={false}
          preload="auto"
          onClick={handleFocus}
          onTouchStart={handleFocus}
          className={`absolute inset-0 w-full h-full object-contain ${
            facingMode === "user" ? "scale-x-[-1]" : ""
          }`}
        />

        {/* Moldura sobre a câmera */}
        {selectedFrame && selectedFrame.id !== "frame-0" && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Image
              src={selectedFrame.src}
              alt="Moldura selecionada"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Carregamento da câmera */}
        {!isReady && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
              <Camera className="w-10 h-10 text-muted-foreground animate-pulse" />
              <p className="text-sm text-muted-foreground">
                Abrindo câmera...
              </p>
            </div>
          </div>
        )}

        {/* Voltar */}
        <button
          onClick={handleGoBack}
          className="absolute top-3 left-3 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/60"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Trocar câmera */}
        <button
          onClick={handleFlipCamera}
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/60"
          aria-label="Trocar câmera"
        >
          <SwitchCamera className="w-5 h-5 text-white" />
        </button>

        {/* Controles de captura */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center gap-4">
          <div className="relative w-full">
            <div className="absolute -bottom-23.5 px-4 left-[0.2px] right-0">
              <FrameSelector onSelectFrame={handleSelectFrame} />
            </div>
          </div>

          {/* Botão de captura */}
          <button
            onClick={handleCapture}
            disabled={!isReady}
            aria-label="Capturar foto"
            className="snap-center shrink-0 flex flex-col relative w-18.5 h-18.5 rounded-full border-4 border-white items-center justify-center transition-all duration-200 active:scale-95 shadow-xl overflow-hidden disabled:opacity-50"
          >
            {selectedFrame && selectedFrame.id !== "frame-0" ? (
              <Image
                alt=""
                src={selectedFrame.src}
                fill
                sizes="80px"
                className="object-cover rounded-full"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/40" />
            )}
          </button>

          <span>
            {selectedFrame ? selectedFrame.label : ""}
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
