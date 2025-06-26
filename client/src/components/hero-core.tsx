'use client'

import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import { ParticleTextEffect } from "@/components/ui/particle-text-effect"
import { Phone, Rocket, Shield } from "lucide-react"
import { useState, useEffect } from "react"
 
export function HeroCore() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-indigo via-transparent to-electric-cyan opacity-30"></div>
      

      
      <Card 
        className="glass w-full max-w-7xl mx-4 relative overflow-hidden animate-float"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
        />
        
        <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
          {/* Left content */}
          <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="mb-8">
                <ParticleTextEffect 
                  words={["INSURANCE SCHOOL", "RECRUITING ANNEX"]}
                  width={1500}
                  height={320}
                  className="mx-auto"
                />
              </div>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Futuristic AI-powered voice agents, real-time analytics, and automated enrollment system. 
                Transform your insurance education business with cutting-edge technology.
              </p>
              

              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center p-4 card-glass hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-electric-cyan">247</div>
                  <div className="text-sm text-gray-400">Active Leads</div>
                </div>
                <div className="text-center p-4 card-glass hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-crimson-red">94.2%</div>
                  <div className="text-sm text-gray-400">AI Success Rate</div>
                </div>
                <div className="text-center p-4 card-glass hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-royal-blue">$2.4M</div>
                  <div className="text-sm text-gray-400">Monthly Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="flex-1 relative">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
    </section>
  )
}
