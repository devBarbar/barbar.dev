import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// BROWSER DETECTION
// ============================================================================

export interface BrowserInfo {
  /** True if the browser is Chrome or Chromium-based */
  isChrome: boolean;
  /** True if the browser is Safari */
  isSafari: boolean;
  /** True if the browser is Firefox */
  isFirefox: boolean;
  /** True if the device is desktop (not mobile/tablet) */
  isDesktop: boolean;
  /** True if the device is mobile */
  isMobile: boolean;
  /** True if the device is a tablet */
  isTablet: boolean;
}

/**
 * Detects the current browser and device type.
 * Used for performance optimizations (e.g., disabling bloom on Chrome desktop).
 * 
 * @returns BrowserInfo object with browser and device detection flags
 */
export function detectBrowser(): BrowserInfo {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    // SSR fallback - assume desktop Chrome
    return {
      isChrome: false,
      isSafari: false,
      isFirefox: false,
      isDesktop: true,
      isMobile: false,
      isTablet: false,
    };
  }

  const ua = navigator.userAgent;
  const vendor = navigator.vendor || "";

  // Browser detection
  const isChrome = /Chrome/i.test(ua) && /Google Inc/i.test(vendor) && !/Edg/i.test(ua);
  const isSafari = /Safari/i.test(ua) && /Apple Computer/i.test(vendor) && !/Chrome/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);

  // Device detection
  const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(ua);
  
  // Also check screen width for more accurate detection
  const screenWidth = window.innerWidth;
  const isMobile = isMobileUA || screenWidth < 640;
  const isTablet = isTabletUA || (screenWidth >= 640 && screenWidth < 1024);
  const isDesktop = !isMobile && !isTablet;

  return {
    isChrome,
    isSafari,
    isFirefox,
    isDesktop,
    isMobile,
    isTablet,
  };
}
