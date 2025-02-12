'use client';

import { useTranslation } from '@/context/TranslationContext';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
  const { setLang } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLanguageChange = (lang: string) => {
    document.cookie = `preferredLang=${lang}; path=/; max-age=31536000`;
    setLang(lang);
    window.location.reload();
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange('en')}>English</button>
      <button onClick={() => handleLanguageChange('es')}>Español</button>
    </div>
  );
} 