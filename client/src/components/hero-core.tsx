'use client'

import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import { ParticleTextEffect } from "@/components/ui/particle-text-effect"
import { Phone, Rocket, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
 
interface AnalyticsData {
  activeLeads: number;
  agentPerformance: number;
  monthlyRevenue: number;
}

export function HeroCore() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

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
                  width={1300}
                  height={280}
                  className="mx-auto"
                />
              </div>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Welcome Jason and Kelli, my name is Bandit. You can speak to me by pressing or texting the call button down below to my left (Your Right). Feel free to text or talk to me. Once you initiate a call it will ask you your name for verification, then the data upload begins, and I will return after a short moment of silence.
              </p>
              

              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center p-4 card-glass hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-electric-cyan">
                    {isLoading ? "..." : analytics?.activeLeads || 0}
                  </div>
                  <div className="text-sm text-gray-400">Active Leads</div>
                </div>
                <div className="text-center p-4 card-glass hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-crimson-red">
                    {isLoading ? "..." : `${analytics?.agentPerformance || 0}%`}
                  </div>
                  <div className="text-sm text-gray-400">AI Success Rate</div>
                </div>
                <div className="text-center p-4 card-glass hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold text-royal-blue">
                    {isLoading ? "..." : `$${((analytics?.monthlyRevenue || 0) / 1000).toFixed(1)}K`}
                  </div>
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
