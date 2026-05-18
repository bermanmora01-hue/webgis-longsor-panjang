/**
 * Vercel Speed Insights Integration
 * This file injects the Speed Insights tracking script for performance monitoring
 * Following official Vercel documentation: https://vercel.com/docs/speed-insights/quickstart
 */

import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights with configuration
injectSpeedInsights({
  debug: false, // Set to true for debugging in development
  sampleRate: 1.0, // Track 100% of page views
});
