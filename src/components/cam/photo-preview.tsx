"use client"

import { Share2, RotateCcw, Download } from "lucide-react"
import { useCallback } from "react"

interface PhotoPreviewProps {
  imageDataUrl: string
  onRetake: () => void
}

export function PhotoPreview({ imageDataUrl, onRetake }: PhotoPreviewProps) {
  const handleShare = useCallback(async () => {
    try {
      // Convert data URL to blob
      const response = await fetch(imageDataUrl)
      const blob = await response.blob()
      const file = new File([blob], "foto-moldura.png", { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Minha foto com moldura",
        })
      } else {
        // Fallback: download the image
        downloadImage()
      }
    } catch (error) {
      // User cancelled sharing or error occurred
      if ((error as Error).name !== "AbortError") {
        downloadImage()
      }
    }
  }, [imageDataUrl])

  const downloadImage = useCallback(() => {
    const link = document.createElement("a")
    link.href = imageDataUrl
    link.download = "foto-moldura.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [imageDataUrl])

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Photo result */}
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "9/16",  height: "100%" }}>
        <img
          src={imageDataUrl}
          alt="Sua foto com moldura"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 w-full">
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-secondary text-secondary-foreground font-medium transition-colors hover:bg-secondary/80"
          aria-label="Tirar outra foto"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Nova foto</span>
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90"
          aria-label="Compartilhar foto"
        >
          <Share2 className="w-5 h-5" />
          <span>Compartilhar</span>
        </button>
      </div>

      <button
        onClick={downloadImage}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Baixar foto"
      >
        <Download className="w-4 h-4" />
        <span>Baixar imagem</span>
      </button>
    </div>
  )
}
