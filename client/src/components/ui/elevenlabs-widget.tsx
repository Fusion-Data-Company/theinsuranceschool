import { useEffect, useState, useRef } from 'react';

// Global flag to prevent multiple widget initializations
let isElevenLabsScriptLoading = false;
let isElevenLabsScriptLoaded = false;

export function ElevenLabsWidget() {
  const [scriptLoaded, setScriptLoaded] = useState(isElevenLabsScriptLoaded);
  const [hasError, setHasError] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const initializationRef = useRef(false);

  useEffect(() => {
    // If script is already loaded globally, update local state
    if (isElevenLabsScriptLoaded) {
      setScriptLoaded(true);
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
    if (existingScript) {
      isElevenLabsScriptLoaded = true;
      setScriptLoaded(true);
      return;
    }

    // Prevent multiple simultaneous script loads
    if (isElevenLabsScriptLoading) {
      // Wait for the script to finish loading
      const checkInterval = setInterval(() => {
        if (isElevenLabsScriptLoaded) {
          setScriptLoaded(true);
          clearInterval(checkInterval);
        } else if (!isElevenLabsScriptLoading) {
          // Loading failed
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Load ElevenLabs ConvAI widget script
    isElevenLabsScriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    script.crossOrigin = 'anonymous';
    
    // Handle script load
    script.onload = () => {
      console.log('ElevenLabs script loaded successfully');
      isElevenLabsScriptLoading = false;
      isElevenLabsScriptLoaded = true;
      // Give the script time to initialize
      setTimeout(() => {
        setScriptLoaded(true);
      }, 200);
    };
    
    // Handle script error
    script.onerror = (error) => {
      console.error('Failed to load ElevenLabs widget script:', error);
      isElevenLabsScriptLoading = false;
      setHasError(true);
    };
    
    document.head.appendChild(script);

    // Don't remove the script on cleanup to prevent re-loading
    return () => {
      // Only reset loading flag, keep the script in DOM
      if (isElevenLabsScriptLoading) {
        isElevenLabsScriptLoading = false;
      }
    };
  }, []);

  // Handle widget initialization after DOM update
  useEffect(() => {
    if (scriptLoaded && widgetContainerRef.current && !initializationRef.current) {
      console.log('Widget container ready, checking element...');
      
      // Wait for the custom element to be defined
      const initializeWidget = () => {
        const widgetElement = widgetContainerRef.current?.querySelector('elevenlabs-convai');
        if (widgetElement) {
          console.log('Widget element found:', widgetElement);
          
          // Check if the widget is properly loaded
          if (typeof (window as any).customElements !== 'undefined') {
            const isElementDefined = (window as any).customElements.get('elevenlabs-convai');
            console.log('Custom element defined:', !!isElementDefined);
            
            if (isElementDefined) {
              setWidgetReady(true);
            }
          }
          
          // Listen for various widget events
          widgetElement.addEventListener('error', (event: any) => {
            console.error('Widget error event:', event.detail || event);
            // Don't set hasError here as it might be recoverable
          });
          
          // Listen for agent config errors specifically
          widgetElement.addEventListener('agent-config-error', (event: any) => {
            console.warn('Agent configuration failed:', event.detail);
            // This is common during development, don't hide the widget
          });
          
          // Listen for successful initialization
          widgetElement.addEventListener('ready', (event: any) => {
            console.log('Widget initialized successfully');
            setWidgetReady(true);
          });
        } else {
          console.warn('Widget element not found in DOM, retrying...');
          // Retry after a longer delay if element not found
          setTimeout(initializeWidget, 1000);
          return;
        }
      };
      
      // Initial delay to let the widget render
      setTimeout(initializeWidget, 500);
      
      // Mark as initialized to prevent multiple initializations
      initializationRef.current = true;
    }
  }, [scriptLoaded]);

  if (hasError) {
    return null; // Hide widget if there's an error loading the script
  }

  // Only render the widget after script is loaded
  if (!scriptLoaded) {
    return null;
  }

  return (
    <div 
      ref={widgetContainerRef}
      className="fixed bottom-6 right-6 z-[9999]"
    >
      <div
        dangerouslySetInnerHTML={{
          __html: '<elevenlabs-convai agent-id="agent_01jym82zjnfykactsvevyt6bra"></elevenlabs-convai>'
        }}
      />
      {/* Optional: Add a fallback indicator when widget has configuration issues */}
      {scriptLoaded && !widgetReady && (
        <div className="sr-only" aria-live="polite">
          Voice assistant loading...
        </div>
      )}
    </div>
  );
}