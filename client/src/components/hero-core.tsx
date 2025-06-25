'use client'

import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import { Phone, Rocket, Shield } from "lucide-react"
 
export function HeroCore() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-indigo via-transparent to-electric-cyan opacity-30"></div>
      
      <Card className="glass w-full max-w-7xl mx-4 relative overflow-hidden animate-float">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20 opacity-100"
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
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-glow">
                <span className="text-electric-cyan">Insurance</span>{" "}
                <span className="text-white">School</span>{" "}
                <span className="text-fuchsia">Recruiting</span>{" "}
                <span className="text-white">Annex</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                Futuristic AI-powered voice agents, real-time analytics, and automated enrollment system. 
                Transform your insurance education business with cutting-edge technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button className="btn-glass text-lg px-8 py-4">
                  <Rocket className="mr-3 h-6 w-6" />
                  Start Your iPower Move
                </Button>
                <Button className="btn-glass bg-gradient-to-r from-vibrant-purple to-neon-magenta text-lg px-8 py-4">
                  <Phone className="mr-3 h-6 w-6" />
                  Call Now: (555) 123-4567
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-cyan">247</div>
                  <div className="text-sm text-gray-400">Active Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-fuchsia">94.2%</div>
                  <div className="text-sm text-gray-400">AI Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-vibrant-purple">$2.4M</div>
                  <div className="text-sm text-gray-400">Monthly Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content - 3D Scene */}
          <div className="flex-1 relative">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black-glass/50"></div>
          </div>
        </div>
      </Card>
    </section>
  )
}
