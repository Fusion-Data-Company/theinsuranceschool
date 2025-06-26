'use client'

import { Suspense, lazy, useState } from 'react'
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-electric-cyan/20 to-crimson-red/20 rounded-lg">
        <div className="text-center p-8">
          <Bot className="w-24 h-24 text-electric-cyan mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg font-medium">Interactive Robot Loading...</p>
          <p className="text-gray-400 text-sm mt-2">AI Agent Initializing</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-cyan mb-4 mx-auto"></div>
            <p className="text-white text-sm">Loading Interactive Robot...</p>
          </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={cn("w-full h-full", className)}
        onLoad={handleLoad}
        onError={handleError}
      />
    </Suspense>
  )
}