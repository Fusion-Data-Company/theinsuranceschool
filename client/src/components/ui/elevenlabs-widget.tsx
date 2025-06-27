import { useEffect } from 'react';

export function ElevenLabsWidget() {
  useEffect(() => {
    // Load ElevenLabs ConvAI widget script
    if (!document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div 
      className="fixed bottom-6 right-6 z-[9999]"
      dangerouslySetInnerHTML={{
        __html: '<elevenlabs-convai agent-id="agent_01jym82zjnfykactsvevyt6bra"></elevenlabs-convai>'
      }}
    />
  );
}