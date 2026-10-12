import Image from "next/image";

export default function Loading({ progress = 0 }: { progress?: number }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="relative h-20 w-20 sm:h-24 sm:w-24">
        <Image
          src="/adtc.png"
          alt="ADTC"
          fill
          priority
          className="object-contain"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Carregando... {progress}%
      </p>

      <div className="relative h-1.5 w-48 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}