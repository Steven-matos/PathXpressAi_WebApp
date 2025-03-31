"use client";

// src/context/TranslationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLanguage, loadTranslations } from '@/store/languageSlice';
import { getCachedTranslation, preloadTranslations } from '@/lib/translationLoader';
import { translationConfig } from './translationConfig';

interface TranslationContextType {
  t: (key: string) => string;
  setLang: (lang: string) => void;
  language: string;
  isLoaded: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [language, setLanguageState] = useState('en');
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initializeTranslations = async () => {
      try {
        // Load initial language from cookie or localStorage
        const langFromCookie = document.cookie.match(/preferredLang=([^;]+)/)?.[1];
        const langFromStorage = localStorage.getItem('preferredLang');
        const initialLang = langFromCookie || langFromStorage || 'en';
        
        setLanguageState(initialLang);
        dispatch(setLanguage(initialLang as 'en' | 'es'));
        
        // Preload all translations
        await preloadTranslations();
        
        // Load translations into Redux store
        const translations = {
          en: getCachedTranslation('en'),
          es: getCachedTranslation('es')
        };
        dispatch(loadTranslations(translations));
        setIsLoaded(true);
      } catch (error) {
        console.error('Error initializing translations:', error);
      }
    };

    initializeTranslations();
  }, [dispatch]);

  const setLang = async (lang: string) => {
    setLanguageState(lang);
    dispatch(setLanguage(lang as 'en' | 'es'));
    localStorage.setItem('preferredLang', lang);
    document.cookie = `preferredLang=${lang}; path=/; max-age=31536000`;
    
    // Reload translations for the new language
    try {
      await preloadTranslations();
      const translations = {
        en: getCachedTranslation('en'),
        es: getCachedTranslation('es')
      };
      dispatch(loadTranslations(translations));
    } catch (error) {
      console.error('Error reloading translations:', error);
    }
  };

  const t = (key: string): string => {
    if (!isClient) return key;
    
    const translations = getCachedTranslation(language);
    const keys = key.split('.');
    let result: any = translations;
    
    for (const k of keys) {
      if (!result) return key;
      result = result[k];
      if (result === undefined) return key;
    }
    
    return String(result);
  };

  // Show loading state while translations are being loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading translations...</p>
        </div>
      </div>
    );
  }

  return (
    <TranslationContext.Provider value={{ t, setLang, language, isLoaded }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
