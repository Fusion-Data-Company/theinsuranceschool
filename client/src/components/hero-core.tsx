'use client'

import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
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
      
      {/* Enhanced Mouse-Following Spotlight */}
      <div 
        className="fixed pointer-events-none z-20 transition-all duration-500 ease-out"
        style={{
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          background: `radial-gradient(600px circle at center, rgba(0, 255, 247, 0.08), rgba(255, 69, 58, 0.04) 40%, transparent 70%)`,
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          opacity: isHovered ? 1 : 0.6,
          filter: 'blur(2px)',
        }}
      />
      
      {/* Secondary Spotlight Effect */}
      <div 
        className="fixed pointer-events-none z-19 transition-all duration-700 ease-out"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          background: `radial-gradient(300px circle at center, rgba(255, 69, 58, 0.06), transparent 60%)`,
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          opacity: isHovered ? 0.8 : 0.4,
        }}
      />
      
      <Card 
        className="glass w-full max-w-7xl mx-4 relative overflow-hidden animate-float"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="#00fff7"
        />
        
        <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
          {/* Left content */}
          <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-electric-cyan/20 border border-electric-cyan/30 rounded-full text-electric-cyan text-sm font-medium mb-4">
                <Shield className="w-4 h-4 mr-2" />
                Enterprise-Grade CRM
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-electric-cyan">Insurance</span>{" "}
                <span className="text-white">School</span>{" "}
                <span className="text-crimson-red">Recruiting</span>{" "}
                <span className="text-white">Annex</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Futuristic AI-powered voice agents, real-time analytics, and automated enrollment system. 
                Transform your insurance education business with cutting-edge technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button className="btn-glass text-lg px-8 py-4 hover:scale-105 transition-transform">
                  <Rocket className="mr-3 h-6 w-6" />
                  Start Your iPower Move
                </Button>
                <Button className="btn-glass bg-gradient-to-r from-royal-blue to-neon-blue text-lg px-8 py-4 hover:scale-105 transition-transform">
                  <Phone className="mr-3 h-6 w-6" />
                  Call Now: (555) 123-4567
                </Button>
              </div>
              
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

          {/* Right content - Interactive 3D Scene */}
          <div 
            className="flex-1 relative group cursor-pointer"
            style={{
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform 0.3s ease-out',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/20 to-crimson-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black-glass/30 group-hover:to-black-glass/10 transition-all duration-300"></div>
            
            {/* Interactive Glow Effect */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at ${isHovered ? '50%' : '75%'} 50%, rgba(0, 255, 247, 0.2), transparent 60%)`,
              }}
            />
          </div>
        </div>
      </Card>
    </section>
  )
}
