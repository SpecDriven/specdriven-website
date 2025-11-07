/**
 * Calendly Integration Utilities
 * Loads Calendly script on-demand and manages popup modal
 */

interface CalendlyWidget {
  initPopupWidget(options: { url: string }): void;
}

declare global {
  interface Window {
    Calendly?: CalendlyWidget;
  }
}

const CALENDLY_SCRIPT_URL = 'https://assets.calendly.com/assets/external/widget.js';
let isScriptLoading = false;
let isScriptLoaded = false;

/**
 * Dynamically load Calendly script
 */
export async function loadCalendlyScript(): Promise<void> {
  if (isScriptLoaded) return;
  if (isScriptLoading) {
    // Wait for existing load to complete
    return new Promise((resolve) => {
      const checkLoaded = () => {
        if (isScriptLoaded) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
  }

  isScriptLoading = true;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      resolve();
    };

    script.onerror = () => {
      isScriptLoading = false;
      reject(new Error('Failed to load Calendly script'));
    };

    // Add script to head
    document.head.appendChild(script);
  });
}

/**
 * Open Calendly popup modal
 */
export async function openCalendlyModal(url?: string): Promise<void> {
  const calendlyUrl = url || import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/your-handle/assessment';

  try {
    // Load script if not already loaded
    if (!window.Calendly) {
      await loadCalendlyScript();
    }

    // Open popup
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: calendlyUrl });
    } else {
      throw new Error('Calendly widget not available');
    }
  } catch (error) {
    console.error('Failed to open Calendly modal:', error);

    // Fallback: open in new tab
    window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Track Calendly CTA clicks for analytics
 */
export function trackCalendlyClick(source: string = 'unknown'): void {
  // Simple tracking - can be enhanced with analytics tools
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // Google Analytics 4 event tracking
    (window as any).gtag('event', 'calendly_click', {
      event_category: 'engagement',
      event_label: source,
      value: 1,
    });
  }

  // Cloudflare Web Analytics beacon (if available)
  if (typeof window !== 'undefined' && 'beacon' in navigator) {
    try {
      navigator.sendBeacon('/api/analytics', JSON.stringify({
        event: 'calendly_click',
        source,
        timestamp: Date.now(),
      }));
    } catch (error) {
      // Fail silently
    }
  }
}

/**
 * Handle Calendly CTA click with tracking and modal opening
 */
export async function handleCalendlyClick(source: string = 'cta'): Promise<void> {
  trackCalendlyClick(source);
  await openCalendlyModal();
}

/**
 * Preload Calendly script on user interaction (hover, focus)
 */
export function preloadCalendlyScript(): void {
  if (!isScriptLoaded && !isScriptLoading) {
    loadCalendlyScript().catch(error => {
      console.warn('Failed to preload Calendly script:', error);
    });
  }
}