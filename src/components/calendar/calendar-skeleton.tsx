"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-7 border-b border-border bg-muted">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="px-2 py-3">
              <Skeleton className="mx-auto h-4 w-8" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-[100px] flex-col gap-1 border-b border-r border-border p-2"
            >
              <Skeleton className="h-7 w-7 rounded-full" />
              {i % 4 === 0 && <Skeleton className="mt-1 h-4 w-full" />}
              {i % 7 === 2 && <Skeleton className="mt-1 h-4 w-3/4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
