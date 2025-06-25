import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield, Phone, Home, BarChart3, Users, GraduationCap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/leads", label: "Leads", icon: Users },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/enrollment", label: "Enrollment", icon: GraduationCap },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="navbar-glass fixed top-0 left-0 right-0 z-50 border-b border-electric-cyan/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-electric-cyan to-crimson-red rounded-xl flex items-center justify-center animate-pulse-neon">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">Insurance School</span>
                <span className="text-electric-cyan font-semibold text-sm leading-tight">Recruiting Annex</span>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    location === href 
                      ? "bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30 shadow-lg shadow-electric-cyan/20" 
                      : "text-gray-300 hover:text-electric-cyan hover:bg-electric-cyan/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </Button>
              </Link>
            ))}
            
            {/* CTA Button */}
            <Button className="btn-glass bg-gradient-to-r from-royal-blue to-neon-blue ml-4">
              <Phone className="w-4 h-4 mr-2" />
              Call Center
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-electric-cyan focus:outline-none p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-screen bg-black-glass backdrop-blur-lg z-40">
          <div className="px-4 pt-4 pb-3 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full justify-start flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    location === href 
                      ? "bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30" 
                      : "text-gray-300 hover:text-electric-cyan hover:bg-electric-cyan/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Button>
              </Link>
            ))}
            
            {/* Mobile CTA */}
            <Button className="btn-glass bg-gradient-to-r from-royal-blue to-neon-blue w-full mt-4">
              <Phone className="w-4 h-4 mr-2" />
              Call Center
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
