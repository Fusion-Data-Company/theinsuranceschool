import { useEffect, useRef, useState, useCallback } from 'react';

// Enhanced global state management with HMR persistence
interface WidgetState {
  scriptLoaded: boolean;
  widgetInitialized: boolean;
  retryCount: number;
}

// Persist state across HMR to prevent re-initialization
const getWidgetState = (): WidgetState => {
  if (typeof window !== 'undefined') {
    if (!(window as any).__ELEVENLABS_WIDGET_STATE) {
      (window as any).__ELEVENLABS_WIDGET_STATE = {
        scriptLoaded: false,
        widgetInitialized: false,
        retryCount: 0
      };
    }
    return (window as any).__ELEVENLABS_WIDGET_STATE;
  }
  return {
    scriptLoaded: false,
    widgetInitialized: false,
    retryCount: 0
  };
};

const WIDGET_STATE = getWidgetState();

const MAX_RETRIES = 3;
const SCRIPT_TIMEOUT = 10000; // 10 seconds
const CUSTOM_ELEMENT_TIMEOUT = 15000; // 15 seconds

export function ElevenLabsWidget() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetCreated = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced script loading with timeout and abort handling
  const loadScript = useCallback(async (signal: AbortSignal): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Early return if custom element is already defined (prevents duplicate registration)
      const isElementAlreadyDefined = window.customElements?.get('elevenlabs-convai');
      if (isElementAlreadyDefined) {
        console.log('ElevenLabs custom element already registered, skipping script load');
        WIDGET_STATE.scriptLoaded = true;
        resolve();
        return;
      }

      // Check if script already exists by ID
      const existingScript = document.querySelector('#elevenlabs-embed-script');
      if (existingScript && WIDGET_STATE.scriptLoaded) {
        resolve();
        return;
      }

      console.log('Loading ElevenLabs widget script...');
      const script = document.createElement('script');
      script.id = 'elevenlabs-embed-script'; // Deterministic ID for tracking
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.crossOrigin = 'anonymous';

      // Timeout handling
      const timeout = setTimeout(() => {
        script.remove();
        reject(new Error('Script loading timeout'));
      }, SCRIPT_TIMEOUT);

      // Abort handling
      const onAbort = () => {
        clearTimeout(timeout);
        script.remove();
        reject(new Error('Script loading aborted'));
      };

      if (signal.aborted) {
        onAbort();
        return;
      }

      signal.addEventListener('abort', onAbort);

      script.onload = () => {
        clearTimeout(timeout);
        signal.removeEventListener('abort', onAbort);
        WIDGET_STATE.scriptLoaded = true;
        console.log('ElevenLabs script loaded successfully');
        resolve();
      };

      script.onerror = (event) => {
        clearTimeout(timeout);
        signal.removeEventListener('abort', onAbort);
        script.remove();
        reject(new Error(`Script failed to load: ${event}`));
      };

      document.head.appendChild(script);
    });
  }, []);

  // Enhanced custom element waiting with timeout
  const waitForCustomElement = useCallback(async (signal: AbortSignal): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkCustomElements = () => {
        if (signal.aborted) {
          reject(new Error('Custom element check aborted'));
          return;
        }

        if (Date.now() - startTime > CUSTOM_ELEMENT_TIMEOUT) {
          reject(new Error('Custom element timeout'));
          return;
        }

        // Check if custom element is already defined
        const isElementDefined = window.customElements?.get('elevenlabs-convai');
        
        // Also check if the element constructor is available in the global scope
        const isElementAvailable = typeof window.customElements !== 'undefined' && 
          (isElementDefined || (window as any).ElevenLabsConvAI);

        if (isElementAvailable) {
          console.log('ElevenLabs custom element ready');
          resolve();
        } else {
          setTimeout(checkCustomElements, 100);
        }
      };

      checkCustomElements();
    });
  }, []);

  // Enhanced widget creation with error handling
  const createWidget = useCallback(async (signal: AbortSignal): Promise<void> => {
    if (!containerRef.current || widgetCreated.current || signal.aborted) {
      return;
    }

    try {
      console.log('Creating ElevenLabs widget element');
      const widget = document.createElement('elevenlabs-convai') as any;
      
      // Set agent ID with validation
      const agentId = 'agent_01jym82zjnfykactsvevyt6bra';
      widget.setAttribute('agent-id', agentId);
      
      // Enhanced event listeners
      widget.addEventListener('ready', () => {
        console.log('ElevenLabs widget ready');
        setIsReady(true);
        setIsLoading(false);
        setError(null);
      });

      widget.addEventListener('error', (e: any) => {
        const errorMsg = e?.detail || 'Widget configuration error';
        console.warn('ElevenLabs widget error:', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
      });

      // Add connection event listeners
      widget.addEventListener('connected', () => {
        console.log('ElevenLabs widget connected');
      });

      widget.addEventListener('disconnected', () => {
        console.log('ElevenLabs widget disconnected');
      });

      containerRef.current.appendChild(widget);
      widgetCreated.current = true;
      WIDGET_STATE.widgetInitialized = true;
      
      // Set ready state after a brief delay
      setTimeout(() => {
        if (!signal.aborted) {
          setIsReady(true);
          setIsLoading(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to create ElevenLabs widget:', error);
      setError('Failed to create widget');
      setIsLoading(false);
    }
  }, []);

  // Main initialization with retry logic
  const initWidget = useCallback(async () => {
    // Prevent multiple simultaneous initializations
    if (WIDGET_STATE.widgetInitialized || widgetCreated.current) {
      console.log('ElevenLabs widget already initialized, skipping...');
      return;
    }

    // Create new abort controller for this attempt
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setError(null);
      setIsLoading(true);

      // Step 1: Load script
      if (!WIDGET_STATE.scriptLoaded) {
        await loadScript(signal);
      }

      // Step 2: Wait for custom elements
      await waitForCustomElement(signal);

      // Step 3: Create widget
      await createWidget(signal);

      // Reset retry count on success
      WIDGET_STATE.retryCount = 0;

    } catch (error: any) {
      if (signal.aborted) {
        console.log('ElevenLabs widget initialization aborted');
        return;
      }

      console.error('ElevenLabs widget initialization failed:', error);
      setIsLoading(false);
      
      // Retry logic
      if (WIDGET_STATE.retryCount < MAX_RETRIES) {
        WIDGET_STATE.retryCount++;
        const retryDelay = Math.pow(2, WIDGET_STATE.retryCount) * 1000; // Exponential backoff
        console.log(`Retrying ElevenLabs widget initialization in ${retryDelay}ms (attempt ${WIDGET_STATE.retryCount}/${MAX_RETRIES})`);
        
        retryTimeoutRef.current = setTimeout(() => {
          initWidget();
        }, retryDelay);
      } else {
        setError('Failed to initialize voice assistant after multiple attempts');
        console.error('ElevenLabs widget initialization failed permanently after', MAX_RETRIES, 'attempts');
      }
    }
  }, [loadScript, waitForCustomElement, createWidget]);

  useEffect(() => {
    // Only initialize if not already done
    if (!WIDGET_STATE.widgetInitialized && !widgetCreated.current) {
      // Small delay to ensure DOM is ready
      const initTimeout = setTimeout(initWidget, 500);
      return () => clearTimeout(initTimeout);
    }

    return () => {
      // Cleanup on unmount
      abortControllerRef.current?.abort();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      if (containerRef.current && widgetCreated.current) {
        containerRef.current.innerHTML = '';
        widgetCreated.current = false;
        // Don't reset global state to prevent reinitialization
      }
    };
  }, [initWidget]);

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