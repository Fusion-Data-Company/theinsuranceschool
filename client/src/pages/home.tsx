import { HeroCore } from "@/components/hero-core";
import { Button } from "@/components/ui/button";
import { Phone, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-16"> {/* Account for fixed navbar */}
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-deep-indigo via-transparent to-electric-cyan opacity-30"></div>
        
        {/* Hero Content */}
        <div className="glass relative z-10 max-w-4xl mx-4 p-8 md:p-12 text-center animate-float">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-glow">
            <span className="text-electric-cyan">Interactive</span>{" "}
            <span className="text-white">3D</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Bring your UI to life with beautiful 3D scenes. Create immersive experiences 
            that capture attention and enhance your design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="btn-glass">
              <Rocket className="mr-2 h-5 w-5" />
              Start Your iPower Move
            </Button>
            <Button className="btn-glass bg-gradient-to-r from-vibrant-purple to-neon-magenta">
              <Phone className="mr-2 h-5 w-5" />
              Call Now: (555) 123-4567
            </Button>
          </div>
        </div>

        {/* Replace with actual HeroCore component */}
        <div className="absolute inset-0 flex items-center justify-center opacity-50">
          <HeroCore />
        </div>
      </section>
    </div>
  );
}
