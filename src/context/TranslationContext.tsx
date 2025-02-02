"use client";

// src/context/TranslationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { translationConfig } from "./translationConfig";

interface TranslationContextProps {
  language: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextProps | null>(null);

type Language = (typeof translationConfig.languages)[number];

interface Translations {
  [key: string]: { [key: string]: string };
}

const translations: Translations = translationConfig.languages.reduce(
  (acc, lang) => {
    acc[lang] = require(`./langs/${lang}/common.json`);
    return acc;
  },
  {} as Translations
);

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLang] = useState<Language>(
    translationConfig.defaultLanguage
  );

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

  const t = (key: string) => {
    const keys = key.split(".");
    let result: any = translations[language];

    for (const k of keys) {
      if (!result) break;
      const arrayIndex = parseInt(k, 10);
      result =
        !isNaN(arrayIndex) && Array.isArray(result)
          ? result[arrayIndex]
          : result[k];
    }

    return result || key;
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
