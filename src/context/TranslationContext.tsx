"use client";

// src/context/TranslationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { translationConfig } from "./translationConfig";
import type { Translations } from './types';

interface TranslationContextType {
  language: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'en',
  setLang: () => {},
  t: (key) => key,
});

type Language = (typeof translationConfig.languages)[number];

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLang] = useState<Language>(
    translationConfig.defaultLanguage
  );
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Sync with Redux store
    const savedLang = localStorage.getItem("preferredLang");
    const initialLang = savedLang || translationConfig.defaultLanguage;
    setLang(initialLang);

    // Set cookie for server-side consistency
    document.cookie = `preferredLang=${initialLang}; path=/; max-age=31536000`;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLang", language);
      document.cookie = `preferredLang=${language}; path=/; max-age=31536000`;
    }
  }, [language]);

  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslations: Translations = {};
      for (const lang of translationConfig.languages) {
        newTranslations[lang] = (await import(`./langs/${lang}/common.json`)).default;
      }
      setTranslations(newTranslations);
    };
    loadTranslations();
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let result: unknown = translations[language] || {};

    for (const k of keys) {
      if (!result || typeof result !== 'object') break;
      result = (result as Record<string, unknown>)[k];
    }

    return (result as string) || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLang, t }}>
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
