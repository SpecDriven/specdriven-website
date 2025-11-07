/**
 * UTM Parameter Tracking Utilities
 * Captures and persists UTM parameters in localStorage for 90 days
 */

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page?: string;
  timestamp?: number;
}

const UTM_STORAGE_KEY = 'specdriven_utm_data';
const UTM_EXPIRY_DAYS = 90;

/**
 * Extract UTM parameters from current URL
 */
export function extractUTMParams(): UTMData {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmData: UTMData = {
    timestamp: Date.now(),
    landing_page: window.location.href,
    referrer: document.referrer || 'direct',
  };

  // Extract UTM parameters
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmData[key as keyof UTMData] = value;
    }
  });

  return utmData;
}

/**
 * Store UTM data in localStorage with expiry
 */
export function storeUTMData(utmData: UTMData): void {
  if (typeof window === 'undefined') return;

  try {
    const dataWithExpiry = {
      ...utmData,
      timestamp: Date.now(),
    };
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(dataWithExpiry));
  } catch (error) {
    console.warn('Failed to store UTM data:', error);
  }
}

/**
 * Retrieve stored UTM data from localStorage
 */
export function getStoredUTMData(): UTMData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (!stored) return null;

    const data: UTMData = JSON.parse(stored);
    const now = Date.now();
    const expiryTime = (data.timestamp || 0) + (UTM_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    // Check if data has expired
    if (now > expiryTime) {
      localStorage.removeItem(UTM_STORAGE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Failed to retrieve UTM data:', error);
    localStorage.removeItem(UTM_STORAGE_KEY);
    return null;
  }
}

/**
 * Initialize UTM tracking on page load
 * Only stores new UTM data if none exists or if new UTM parameters are present
 */
export function initializeUTMTracking(): UTMData {
  const currentUTM = extractUTMParams();
  const storedUTM = getStoredUTMData();

  // If we have new UTM parameters, store them
  const hasNewUTMParams = Object.keys(currentUTM).some(key =>
    key.startsWith('utm_') && currentUTM[key as keyof UTMData]
  );

  if (hasNewUTMParams || !storedUTM) {
    storeUTMData(currentUTM);
    return currentUTM;
  }

  return storedUTM;
}

/**
 * Get attribution data for form submissions
 */
export function getAttributionData(): UTMData {
  return getStoredUTMData() || {};
}

/**
 * Clear stored UTM data (useful for testing)
 */
export function clearUTMData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(UTM_STORAGE_KEY);
}