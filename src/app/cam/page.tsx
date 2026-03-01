"use client"

import { useState, useCallback } from "react"
import { CameraView } from "@/components/cam/camera-view"
import { PhotoPreview } from "@/components/cam/photo-preview"

type AppState = "selecting" | "preview"

export default function Page() {
  const [state, setState] = useState<AppState>("selecting")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const handleCapture = useCallback((imageDataUrl: string) => {
    setCapturedImage(imageDataUrl)
    setState("preview")
  }, [])

  const handleRetake = useCallback(() => {
    setCapturedImage(null)
    setState("selecting")
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground mx-auto max-w-md">
      {state === "selecting" && (
        <>
          <CameraView
            onCapture={handleCapture}
          />
        </>
      )}

      {state === "preview" && capturedImage && (
        <PhotoPreview
          imageDataUrl={capturedImage}
          onRetake={handleRetake}
        />
      )}
    </main>
  )
}
