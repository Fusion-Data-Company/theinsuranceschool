import { useEffect, useRef, useState } from 'react';

// Single global flag to track script status
let scriptInitialized = false;

export function ElevenLabsWidget() {
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetCreated = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (widgetCreated.current) return;

    const initWidget = async () => {
      try {
        // Check if script is already loaded
        if (!scriptInitialized) {
          const existingScript = document.querySelector('script[src*="elevenlabs"]');
          if (!existingScript) {
            console.log('Loading ElevenLabs widget script...');
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
            script.async = true;
            
            await new Promise<void>((resolve, reject) => {
              script.onload = () => {
                console.log('ElevenLabs script loaded');
                scriptInitialized = true;
                resolve();
              };
              script.onerror = reject;
              document.head.appendChild(script);
            });
          } else {
            scriptInitialized = true;
          }
        }

        // Wait for custom elements to be ready
        await new Promise<void>((resolve) => {
          const checkCustomElements = () => {
            if (window.customElements?.get('elevenlabs-convai')) {
              resolve();
            } else {
              setTimeout(checkCustomElements, 100);
            }
          };
          checkCustomElements();
        });

        // Create widget element
        if (containerRef.current && !widgetCreated.current) {
          console.log('Creating ElevenLabs widget element');
          const widget = document.createElement('elevenlabs-convai') as any;
          widget.setAttribute('agent-id', 'agent_01jym82zjnfykactsvevyt6bra');
          
          // Add event listeners for debugging
          widget.addEventListener('ready', () => {
            console.log('Widget ready');
            setIsReady(true);
          });

          widget.addEventListener('error', (e: any) => {
            console.log('Widget error (non-critical):', e?.detail || 'Unknown error');
          });

          containerRef.current.appendChild(widget);
          widgetCreated.current = true;
          setIsReady(true);
        }

      } catch (error) {
        console.error('Failed to initialize ElevenLabs widget:', error);
      }
    };

    // Initialize with a delay to ensure DOM is ready
    setTimeout(initWidget, 1000);

    return () => {
      // Cleanup: remove widget on unmount
      if (containerRef.current && widgetCreated.current) {
        containerRef.current.innerHTML = '';
        widgetCreated.current = false;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 right-6 z-[9999]"
    >
      {!isReady && (
        <div className="sr-only">Loading voice assistant...</div>
      )}
    </div>
  );
}