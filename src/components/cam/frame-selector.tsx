"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"

interface Frame {
  id: string
  src: string
  label: string
}

const frames: Frame[] = [
  { id: "frame-0", src: "", label: "0" },
  { id: "frame-1", src: "/frame/1.png", label: "JuventudeTC" },
  { id: "frame-2", src: "/frame/2.png", label: "MulheresTC" },
  { id: "frame-3", src: "/frame/3.png", label: "FamiliaTC" },
  { id: "frame-4", src: "/frame/4.png", label: "ADTC" },
]

export function FrameSelector({ onSelectFrame }: { onSelectFrame: (f: Frame) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleScroll = () => {
      const center = el.scrollLeft + el.offsetWidth / 2
      let closest: HTMLElement | null = null
      let min = Infinity

      Array.from(el.children).forEach((child) => {
        const c = child as HTMLElement
        const childCenter = c.offsetLeft + c.offsetWidth / 2
        const d = Math.abs(center - childCenter)
        if (d < min) {
          min = d
          closest = c
        }
      })

      if (closest) {
        const id = closest?.dataset.id
        const frame = frames.find(f => f.id === id)
        if (frame) onSelectFrame(frame)
      }
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [onSelectFrame])

  return (
    <div
      ref={ref}
      onPointerDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
      className="
        flex gap-5 px-[40vw] py-3
        overflow-x-auto
        snap-x snap-mandatory
        scroll-smooth
        scrollbar-hide
        touch-pan-x
        select-none
        scrollbar-hide
        [-ms-overflow-style:none]
        [scrollbar-width:none]
      "
      style={{ WebkitOverflowScrolling: "touch" }}

    >
      {frames.map(frame => (
        <div
          key={frame.id}
          data-id={frame.id}
          className="snap-center flex-shrink-0"
        >
          <div className="relative w-14 h-14 flex flex-row-revers rounded-full border border-white/40 overflow-hidden">
            {frame.id !== "frame-0" && (
              <Image
                src={frame.src}
                fill
                alt=""
                className="object-cover"
                sizes="64px"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export { frames } 
export type { Frame }