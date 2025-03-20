"use client";

// src/context/TranslationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { translationConfig } from "./translationConfig";
import type { Translations } from './types';

// Pre-import all translations at build time for faster loading
import enTranslations from './langs/en/common.json';
import esTranslations from './langs/es/common.json';

// Static translations map for instant access
const STATIC_TRANSLATIONS: Translations = {
  en: enTranslations,
  es: esTranslations,
};

type Language = (typeof translationConfig.languages)[number];

interface TranslationContextType {
  language: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
  isLoaded: boolean;
}

// Default translations for immediate rendering
const initialTranslations: Translations = {
  en: enTranslations,
  es: esTranslations,
};

// Create a localStorage key for caching translations
const TRANSLATIONS_CACHE_KEY = 'cached_translations';
const LANGUAGE_PREFERENCE_KEY = 'preferredLang';

const TranslationContext = createContext<TranslationContextType>({
  language: 'en',
  setLang: () => {},
  t: (key) => key,
  isLoaded: false,
});

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Try to get initial language from localStorage for SSR compatibility
  const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(LANGUAGE_PREFERENCE_KEY) as Language) || translationConfig.defaultLanguage;
    }
    return translationConfig.defaultLanguage;
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());
  const [translations, setTranslations] = useState<Translations>(initialTranslations);
  const [isLoaded, setIsLoaded] = useState(true); // Start true since we have static translations

  // Handle language changes
  const setLang = (lang: string) => {
    if (translationConfig.languages.includes(lang as Language)) {
      setLanguage(lang as Language);
      if (typeof window !== "undefined") {
        localStorage.setItem(LANGUAGE_PREFERENCE_KEY, lang);
        document.cookie = `preferredLang=${lang}; path=/; max-age=31536000`;
      }
    }
  };

  // Translation function with memoization for performance
  const t = useMemo(() => {
    return (key: string): string => {
      const keys = key.split(".");
      let result: unknown = translations[language] || {};
  
      for (const k of keys) {
        if (!result || typeof result !== 'object') break;
        result = (result as Record<string, unknown>)[k];
      }
  
      return (result as string) || key;
    };
  }, [translations, language]);

  return (
    <TranslationContext.Provider value={{ language, setLang, t, isLoaded }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
