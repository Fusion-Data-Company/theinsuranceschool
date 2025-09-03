import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Building2, Phone, Home, BarChart3, Users, GraduationCap, Settings, Database, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/leads", label: "Prospects", icon: Users },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/enrollment", label: "Enrollment", icon: GraduationCap },
    { href: "/mcp-demo", label: "Integration", icon: Database },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Premium Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 scale-110"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-semibold text-lg tracking-tight">Insurance School</span>
                <span className="text-blue-600 font-medium text-xs tracking-wide uppercase">Recruiting Platform</span>
              </div>
            </div>
          </Link>
          
          {/* Enterprise Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location === href 
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              </Link>
            ))}
            

          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-screen bg-white/95 backdrop-blur-xl border-t border-gray-200 z-40">
          <div className="px-6 pt-4 pb-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full justify-start flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location === href 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              </Link>
            ))}
            

          </div>
        </div>
      )}
    </header>
  );
}