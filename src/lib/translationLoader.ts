/**
 * Utility functions for preloading translations
 */

// Import translations directly to be bundled with the app
import enTranslations from '../context/langs/en/common.json';
import esTranslations from '../context/langs/es/common.json';

// Translations cache map
const TRANSLATIONS_CACHE = new Map();

// Pre-cache the translations
TRANSLATIONS_CACHE.set('en', enTranslations);
TRANSLATIONS_CACHE.set('es', esTranslations);

/**
 * Preload all translations into memory and browser cache
 */
export async function preloadAllTranslations() {
  // This ensures the translations are available immediately
  if (typeof window === 'undefined') return;

  // Store in localStorage for faster access on subsequent loads
  try {
    localStorage.setItem('translations_en', JSON.stringify(enTranslations));
    localStorage.setItem('translations_es', JSON.stringify(esTranslations));
    localStorage.setItem('translations_last_updated', new Date().toISOString());
  } catch (e) {
    console.warn('Failed to cache translations in localStorage:', e);
  }
  
  return {
    en: enTranslations,
    es: esTranslations
  };
}

/**
 * Get a cached translation by language code
 */
export function getCachedTranslation(lang: string) {
  // First try memory cache for fastest access
  if (TRANSLATIONS_CACHE.has(lang)) {
    return TRANSLATIONS_CACHE.get(lang);
  }
  
  // Then try localStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`translations_${lang}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        TRANSLATIONS_CACHE.set(lang, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to get cached translation:', e);
    }
  }
  
  // Fallback to bundled translations
  return lang === 'en' ? enTranslations : esTranslations;
}

/**
 * Expose the translations to window for debugging
 */
if (typeof window !== 'undefined') {
  (window as any).__translations = {
    en: enTranslations,
    es: esTranslations,
    getCached: getCachedTranslation,
    preload: preloadAllTranslations
  };
} 