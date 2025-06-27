import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Phone, PhoneCall } from "lucide-react";

interface ElevenLabsWidgetProps {
  agentId?: string;
  onCallStart?: () => void;
  onCallEnd?: () => void;
}

export function ElevenLabsWidget({ 
  agentId = "demo-agent", 
  onCallStart, 
  onCallEnd 
}: ElevenLabsWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleCallStart = () => {
    setIsConnected(true);
    setIsListening(true);
    onCallStart?.();
  };

  const handleCallEnd = () => {
    setIsConnected(false);
    setIsListening(false);
    setIsOpen(false);
    onCallEnd?.();
  };

  const toggleWidget = () => {
    if (isConnected) {
      handleCallEnd();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Widget */}
      {isOpen && !isConnected && (
        <div className="mb-4 card-glass p-6 w-80 animate-in slide-in-from-bottom-2">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-electric-cyan to-fuchsia rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Talk to Our AI Agent</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get instant answers about our insurance licensing programs
            </p>
            <button
              onClick={handleCallStart}
              className="w-full bg-gradient-to-r from-electric-cyan to-fuchsia hover:from-fuchsia hover:to-electric-cyan text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Voice Call
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Powered by ElevenLabs AI
            </p>
          </div>
        </div>
      )}

      {/* Active Call Interface */}
      {isConnected && (
        <div className="mb-4 card-glass p-6 w-80 animate-in slide-in-from-bottom-2">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isListening 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
            }`}>
              {isListening ? (
                <Mic className="w-8 h-8 text-white" />
              ) : (
                <MicOff className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isListening ? "Listening..." : "Call Active"}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Speak naturally about your insurance licensing questions
            </p>
            <button
              onClick={handleCallEnd}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleWidget}
        className={`w-16 h-16 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 ${
          isConnected
            ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse'
            : isOpen
            ? 'bg-gradient-to-r from-gray-600 to-gray-700'
            : 'bg-gradient-to-r from-electric-cyan to-fuchsia hover:from-fuchsia hover:to-electric-cyan'
        }`}
      >
        {isConnected ? (
          <PhoneCall className="w-8 h-8 text-white mx-auto" />
        ) : (
          <Phone className="w-8 h-8 text-white mx-auto" />
        )}
      </button>

      {/* Notification Dot */}
      {!isOpen && !isConnected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
      )}
    </div>
  );
}