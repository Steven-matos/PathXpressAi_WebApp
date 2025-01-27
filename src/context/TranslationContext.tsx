// src/context/TranslationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { translationConfig } from "./translationConfig";

interface TranslationContextProps {
  t: (key: string) => string;
  lang: Language;
  setLang: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(
  undefined
);

type Language = (typeof translationConfig.languages)[number];

interface Translations {
  [key: string]: { [key: string]: string };
}

// Ensure default language is 'en'
const translations: Translations = translationConfig.languages.reduce(
  (acc, lang) => {
    acc[lang] = require(`./langs/${lang}/common.json`);
    return acc;
  },
  {} as Translations
);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(
    translationConfig.defaultLanguage
  );

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const setLang = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <TranslationContext.Provider value={{ t, lang: language, setLang }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
