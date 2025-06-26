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

          {/* Right content - Interactive Robot */}
          <div 
            className="flex-1 relative group cursor-pointer"
            style={{
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform 0.3s ease-out',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/20 to-crimson-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            
            {/* Interactive Robot Display */}
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="text-center space-y-6">
                {/* Animated Robot Icon */}
                <div className="relative">
                  <div className="w-48 h-48 mx-auto relative">
                    {/* Robot Body */}
                    <div className="w-32 h-40 bg-gradient-to-b from-electric-cyan to-royal-blue rounded-2xl mx-auto relative shadow-2xl shadow-electric-cyan/50">
                      {/* Robot Head */}
                      <div className="w-24 h-24 bg-gradient-to-b from-white to-electric-cyan rounded-xl absolute -top-6 left-4 border-4 border-electric-cyan">
                        {/* Eyes */}
                        <div className="flex justify-center items-center h-full space-x-3">
                          <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${isHovered ? 'bg-crimson-red animate-pulse' : 'bg-royal-blue'}`}></div>
                          <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${isHovered ? 'bg-crimson-red animate-pulse' : 'bg-royal-blue'}`}></div>
                        </div>
                      </div>
                      
                      {/* Robot Chest Panel */}
                      <div className="absolute top-8 left-4 right-4 h-16 bg-black-glass rounded-lg border border-electric-cyan/50">
                        <div className="grid grid-cols-3 gap-1 p-2">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-sm transition-colors duration-500 ${isHovered ? 'bg-crimson-red animate-pulse' : 'bg-electric-cyan/70'}`}></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Robot Arms */}
                      <div className="absolute top-6 -left-6 w-6 h-20 bg-gradient-to-b from-electric-cyan to-royal-blue rounded-full transform rotate-12"></div>
                      <div className="absolute top-6 -right-6 w-6 h-20 bg-gradient-to-b from-electric-cyan to-royal-blue rounded-full transform -rotate-12"></div>
                    </div>
                    
                    {/* Robot Legs */}
                    <div className="flex justify-center space-x-4 mt-2">
                      <div className="w-6 h-16 bg-gradient-to-b from-royal-blue to-electric-cyan rounded-full"></div>
                      <div className="w-6 h-16 bg-gradient-to-b from-royal-blue to-electric-cyan rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-1 h-1 rounded-full transition-all duration-1000 ${isHovered ? 'bg-crimson-red' : 'bg-electric-cyan'}`}
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 3) * 20}%`,
                          animationDelay: `${i * 0.2}s`,
                          animation: isHovered ? 'float 2s ease-in-out infinite' : 'float 3s ease-in-out infinite',
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Interactive Text */}
                <div className="space-y-3">
                  <h3 className={`text-2xl font-bold transition-colors duration-300 ${isHovered ? 'text-crimson-red' : 'text-electric-cyan'}`}>
                    Jason AI Agent
                  </h3>
                  <p className="text-gray-300 text-sm max-w-xs mx-auto">
                    {isHovered ? 'Analyzing lead data and optimizing conversions...' : 'Hover to activate AI voice assistant'}
                  </p>
                  <div className={`flex justify-center space-x-2 ${isHovered ? 'animate-pulse' : ''}`}>
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isHovered ? 'bg-crimson-red' : 'bg-electric-cyan/50'}`}></div>
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isHovered ? 'bg-crimson-red' : 'bg-electric-cyan/50'}`} style={{ animationDelay: '0.1s' }}></div>
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isHovered ? 'bg-crimson-red' : 'bg-electric-cyan/50'}`} style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
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
