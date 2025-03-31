"use client";

/**
 * Utility functions for preloading translations
 */

import { translationConfig } from '@/context/translationConfig';

const CACHE_KEY_PREFIX = 'translation_cache_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface TranslationCache {
  data: any;
  timestamp: number;
}

// Fallback translations in case the JSON files fail to load
const fallbackTranslations = {
  en: {
    welcome: "Welcome",
    nav: {
      dashboard: "Dashboard",
      routes: "Routes",
      calendar: "Calendar",
      settings: "Settings",
      welcome: "Welcome"
    },
    auth: {
      signOut: "Sign Out",
      signingOut: "Signing Out...",
      signOutSuccess: "Signed out successfully",
      signOutError: "Error signing out"
    },
    routesForTomorrow: "Routes for Tomorrow",
    route: "Route",
    startTime: "Start Time",
    endTime: "End Time",
    status: {
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed"
    },
    noRoutesForTomorrow: "No routes scheduled for tomorrow",
    dashboardWelcomeMessage: "Welcome to your dashboard! Here you can manage your routes and schedule.",
    loading: "Loading...",
    onboarding: {
      complete: {
        success: "Onboarding Complete",
        description: "Your account has been successfully created.",
        error: "Error Creating Account",
        errorDescription: "There was a problem creating your account. Please try again."
      }
    },
    profile: {
      title: "Profile",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      state: "State",
      zip: "ZIP Code",
      updateProfile: "Update Profile",
      profileUpdated: "Profile Updated",
      profileUpdateError: "Error updating profile",
      profileUpdateSuccess: "Profile updated successfully",
      loading: "Loading profile...",
      error: "Error loading profile",
      notProvided: "Not provided"
    }
  },
  es: {
    welcome: "Bienvenido",
    nav: {
      dashboard: "Panel",
      routes: "Rutas",
      calendar: "Calendario",
      settings: "Configuración",
      welcome: "Bienvenido"
    },
    auth: {
      signOut: "Cerrar Sesión",
      signingOut: "Cerrando Sesión...",
      signOutSuccess: "Sesión cerrada exitosamente",
      signOutError: "Error al cerrar sesión"
    },
    routesForTomorrow: "Rutas para Mañana",
    route: "Ruta",
    startTime: "Hora de Inicio",
    endTime: "Hora de Fin",
    status: {
      pending: "Pendiente",
      in_progress: "En Progreso",
      completed: "Completado"
    },
    noRoutesForTomorrow: "No hay rutas programadas para mañana",
    dashboardWelcomeMessage: "¡Bienvenido a tu panel! Aquí puedes gestionar tus rutas y horarios.",
    loading: "Cargando...",
    onboarding: {
      complete: {
        success: "Registro Completado",
        description: "Tu cuenta ha sido creada exitosamente.",
        error: "Error al Crear la Cuenta",
        errorDescription: "Hubo un problema al crear tu cuenta. Por favor, inténtalo de nuevo."
      }
    },
    profile: {
      title: "Perfil",
      name: "Nombre",
      email: "Correo Electrónico",
      phone: "Teléfono",
      address: "Dirección",
      city: "Ciudad",
      state: "Estado",
      zip: "Código Postal",
      updateProfile: "Actualizar Perfil",
      profileUpdated: "Perfil Actualizado",
      profileUpdateError: "Error al actualizar el perfil",
      profileUpdateSuccess: "Perfil actualizado exitosamente",
      loading: "Cargando perfil...",
      error: "Error al cargar el perfil",
      notProvided: "No proporcionado"
    }
  }
};

export async function preloadTranslations(): Promise<void> {
  const languages = translationConfig.supportedLanguages;
  
  for (const lang of languages) {
    try {
      const response = await fetch(`/context/langs/${lang}/common.json`);
      if (!response.ok) {
        console.warn(`Failed to load translations for ${lang}, using fallback`);
        cacheTranslation(lang, fallbackTranslations[lang as keyof typeof fallbackTranslations]);
        continue;
      }
      
      const translations = await response.json();
      // Merge with fallback translations to ensure all keys are available
      const mergedTranslations = {
        ...fallbackTranslations[lang as keyof typeof fallbackTranslations],
        ...translations
      };
      cacheTranslation(lang, mergedTranslations);
    } catch (error) {
      console.warn(`Error preloading translations for ${lang}, using fallback:`, error);
      cacheTranslation(lang, fallbackTranslations[lang as keyof typeof fallbackTranslations]);
    }
  }
}

export function getCachedTranslation(lang: string): any {
  const cacheKey = `${CACHE_KEY_PREFIX}${lang}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (!cached) {
    // If no cache, try to load from langs folder
    fetch(`/context/langs/${lang}/common.json`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load translations');
        return response.json();
      })
      .then(translations => {
        // Merge with fallback translations
        const mergedTranslations = {
          ...fallbackTranslations[lang as keyof typeof fallbackTranslations],
          ...translations
        };
        cacheTranslation(lang, mergedTranslations);
      })
      .catch(error => {
        console.warn(`Error loading translations for ${lang}, using fallback:`, error);
        cacheTranslation(lang, fallbackTranslations[lang as keyof typeof fallbackTranslations]);
      });
    
    return fallbackTranslations[lang as keyof typeof fallbackTranslations] || {};
  }
  
  const { data, timestamp }: TranslationCache = JSON.parse(cached);
  
  // Check if cache is expired
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(cacheKey);
    return fallbackTranslations[lang as keyof typeof fallbackTranslations] || {};
  }
  
  return data;
}

function cacheTranslation(lang: string, translations: any): void {
  const cacheKey = `${CACHE_KEY_PREFIX}${lang}`;
  const cache: TranslationCache = {
    data: translations,
    timestamp: Date.now()
  };
  
  localStorage.setItem(cacheKey, JSON.stringify(cache));
}

export function clearTranslationCache(): void {
  const languages = translationConfig.supportedLanguages;
  languages.forEach(lang => {
    localStorage.removeItem(`${CACHE_KEY_PREFIX}${lang}`);
  });
}

/**
 * Expose the translations to window for debugging
 */
if (typeof window !== 'undefined') {
  (window as any).__translations = {
    getCached: getCachedTranslation,
    preload: preloadTranslations
  };
} 