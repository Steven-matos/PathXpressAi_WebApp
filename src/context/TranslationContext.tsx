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

type Language = (typeof translationConfig.languages)[number];

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

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLang] = useState<Language>(
    translationConfig.defaultLanguage
  );
  const [translations, setTranslations] = useState<Translations>({});

  const newTranslations: Translations = {};

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        for (const lang of translationConfig.languages) {
          const translationModule = await import(`./langs/${lang}/common.json`);
          newTranslations[lang] = translationModule.default || { error: 'Translation not found' };
        }
        console.log('newTranslations', newTranslations);
        setTranslations(newTranslations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };
    loadTranslations();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedLang = localStorage.getItem("preferredLang");
    const initialLang = savedLang || translationConfig.defaultLanguage;
    setLang(initialLang as Language);

    document.cookie = `preferredLang=${initialLang}; path=/; max-age=31536000`;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLang", language);
      document.cookie = `preferredLang=${language}; path=/; max-age=31536000`;
    }
  }, [language]);

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
