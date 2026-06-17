import React from 'react';

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="space-y-2.5">
        <div className="h-8 w-48 bg-white/10 rounded-lg" />
        <div className="h-4 w-72 bg-white/5 rounded-lg" />
      </div>
      
      {/* Controls Skeleton */}
      <div className="h-20 w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl" />
      
      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 h-[420px] bg-white/[0.02] border border-white/[0.06] rounded-2xl" />
        <div className="lg:col-span-2 h-[420px] bg-white/[0.02] border border-white/[0.06] rounded-2xl" />
      </div>
    </div>
  );
}

export function CodeViewerSkeleton() {
  return (
    <div className="p-5 space-y-3 animate-pulse bg-white/[0.01] rounded-2xl border border-white/[0.04] h-[300px] select-none">
      <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-white/10 rounded-md" />
          <div className="h-6 w-16 bg-white/5 rounded-md" />
          <div className="h-6 w-16 bg-white/5 rounded-md" />
        </div>
        <div className="h-6 w-8 bg-white/5 rounded-md" />
      </div>
      <div className="space-y-2.5 pt-3">
        <div className="h-3 w-5/6 bg-white/5 rounded-md" />
        <div className="h-3 w-4/6 bg-white/5 rounded-md" />
        <div className="h-3 w-full bg-white/5 rounded-md" />
        <div className="h-3 w-3/5 bg-white/5 rounded-md" />
        <div className="h-3 w-4/5 bg-white/5 rounded-md" />
        <div className="h-3 w-2/3 bg-white/5 rounded-md" />
      </div>
    </div>
  );
}

export function AlgorithmInfoSkeleton() {
  return (
    <div className="p-5 space-y-4 animate-pulse h-[350px] select-none">
      <div className="h-6 w-1/3 bg-white/10 rounded-md" />
      <div className="space-y-3 pt-3">
        <div className="h-12 w-full bg-white/[0.02] border border-white/[0.04] rounded-xl" />
        <div className="h-12 w-full bg-white/[0.02] border border-white/[0.04] rounded-xl" />
        <div className="h-12 w-full bg-white/[0.02] border border-white/[0.04] rounded-xl" />
      </div>
    </div>
  );
}
