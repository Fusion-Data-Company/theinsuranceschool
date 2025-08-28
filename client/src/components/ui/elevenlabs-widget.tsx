import { useEffect, useState, useRef } from 'react';

export function ElevenLabsWidget() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
    if (existingScript) {
      setIsScriptLoaded(true);
      return;
    }

    // Load ElevenLabs ConvAI widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    script.crossOrigin = 'anonymous';
    
    // Handle script load
    script.onload = () => {
      console.log('ElevenLabs script loaded successfully');
      // Give the script time to initialize
      setTimeout(() => {
        setIsScriptLoaded(true);
      }, 100);
    };
    
    // Handle script error
    script.onerror = (error) => {
      console.error('Failed to load ElevenLabs widget script:', error);
      setHasError(true);
    };
    
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Handle widget initialization after DOM update
  useEffect(() => {
    if (isScriptLoaded && widgetContainerRef.current) {
      console.log('Widget container ready, checking element...');
      
      // Wait a bit more for the custom element to be defined
      setTimeout(() => {
        const widgetElement = widgetContainerRef.current?.querySelector('elevenlabs-convai');
        if (widgetElement) {
          console.log('Widget element found:', widgetElement);
          
          // Check if the widget is properly loaded
          if (typeof (window as any).customElements !== 'undefined') {
            const isElementDefined = (window as any).customElements.get('elevenlabs-convai');
            console.log('Custom element defined:', !!isElementDefined);
          }
          
          // Listen for widget errors
          widgetElement.addEventListener('error', (event: any) => {
            console.error('Widget error event:', event);
          });
        } else {
          console.warn('Widget element not found in DOM');
        }
      }, 500);
    }
  }, [isScriptLoaded]);

  if (hasError) {
    return null; // Hide widget if there's an error loading the script
  }

  // Only render the widget after script is loaded
  if (!isScriptLoaded) {
    return null;
  }

  return (
    <div 
      ref={widgetContainerRef}
      className="fixed bottom-6 right-6 z-[9999]"
      dangerouslySetInnerHTML={{
        __html: '<elevenlabs-convai agent-id="agent_01jym82zjnfykactsvevyt6bra"></elevenlabs-convai>'
      }}
    />
  );
}