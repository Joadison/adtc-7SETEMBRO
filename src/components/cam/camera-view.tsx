"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { Camera, SwitchCamera } from "lucide-react"
import { FrameSelector, type Frame } from "@/components/cam/frame-selector"

interface CameraViewProps {
  onCapture: (imageDataUrl: string) => void
}

export function CameraView({ onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [isReady, setIsReady] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null)
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) && "ontouchend" in document

  const handleSelectFrame = (frame: Frame) => {setSelectedFrame(frame.id === "frame-0" ? null : frame)}

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    try {
      // ✅ VERIFICAÇÃO CRÍTICA PARA CELULAR
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Seu navegador não suporta acesso à câmera ou a página não está em HTTPS")
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const videoConstraints = isIOS
      ? { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 60 }, focusMode: "continuous", pointsOfInterest: [{ x: 0.5, y: 0.5 }]}
      : { facingMode: facing, aspectRatio: 9/16, frameRate: { ideal: 60 }, focusMode: "continuous", pointsOfInterest: [{ x: 0.5, y: 0.5 }]}

      alert(`Iniciando câmera com resolução ${videoConstraints.width?.ideal}x${videoConstraints.height?.ideal} a 60fps`)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      })

      streamRef.current = stream
      const track = stream.getVideoTracks()[0]

      if (
        !isIOS &&
        track.getCapabilities &&
        track.getCapabilities().focusMode
      ) {
        await track.applyConstraints({
          advanced: [{ focusMode: "continuous" }],
        })
      };

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true)
        }
      }
    } catch (error) {
      console.error("Erro ao acessar a camera:", error)
      // ✅ Mostra erro amigável no UI
      alert(`Erro ao acessar câmera: ${error || "Verifique se a página está em HTTPS"}`)
    }
  }, [isIOS])

  useEffect(() => {
    startCamera(facingMode)

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode, startCamera])

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  const handleFocus = async (event: React.TouchEvent | React.MouseEvent) => {
    if (!streamRef.current) return

    const track = streamRef.current.getVideoTracks()[0]
    if (!track.getCapabilities) return

    const rect = (event.target as HTMLElement).getBoundingClientRect()

    const x =
      ("touches" in event ? event.touches[0].clientX : event.clientX) - rect.left
    const y =
      ("touches" in event ? event.touches[0].clientY : event.clientY) - rect.top

    const focusX = x / rect.width
    const focusY = y / rect.height

    await track.applyConstraints({
      advanced: [
        {
          pointsOfInterest: [{ x: focusX, y: focusY }],
          focusMode: "continuous",
        },
      ],
    })
  }

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    const videoW = video.videoWidth
    const videoH = video.videoHeight

    // Instagram ratio 9:16
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

    // Mirror front camera (igual Instagram)
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

    if (selectedFrame) {
      const frameImg = new Image()
      frameImg.crossOrigin = "anonymous"
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, cropW, cropH)
        onCapture(canvas.toDataURL("image/png"))
      }
      frameImg.src = selectedFrame.src
    } else {
      onCapture(canvas.toDataURL("image/png"))
    }
  }, [selectedFrame, onCapture, facingMode])

  

  return (
    <div className="">
      {/* Camera viewfinder - 9:16 story format */}
      <div className="relative w-full flex-1 overflow-hidden rounded-2xl bg-muted" style={{  aspectRatio: "9 / 16", height: "100%" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onClick={handleFocus}
          onTouchStart={handleFocus}
          className={`absolute inset-0 w-full h-full object-contain ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
        />

        {/* Frame overlay - using native img to preserve PNG transparency */}
        {!selectedFrame || selectedFrame.id === 'frame-0' ? (
           <></>
        ) : (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedFrame.src}
              alt="Moldura selecionada"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {!isReady && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
              <Camera className="w-10 h-10 text-muted-foreground animate-pulse" />
              <p className="text-sm text-muted-foreground">Abrindo camera...</p>
            </div>
          </div>
        )}

        <button
          onClick={handleFlipCamera}
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/60"
          aria-label="Trocar camera"
        >
          <SwitchCamera className="w-5 h-5 text-white" />
        </button>

        <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center gap-4">
          
          <div className="relative w-full">
            <div className="absolute -bottom-[94px] px-4 left-[0.2px] right-0">
              <FrameSelector onSelectFrame={handleSelectFrame} />
            </div>
          </div>
             
          <button
            onClick={handleCapture}
            disabled={!isReady}
            className="snap-center flex-shrink-0 flex flex-col relative w-[74px] h-[74px] rounded-full border-4 border-white items-center justify-center transition-all duration-200 active:scale-95 shadow-xl overflow-hidden"
          >
           
          {selectedFrame && selectedFrame.id !== "frame-0" ? (
              <img
                src={selectedFrame.src}
                className="absolute inset-0 w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/40" />
            )}
          </button>

          <span>
            {selectedFrame ? `${selectedFrame.label}` : "."}
          </span>
        </div>

      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
