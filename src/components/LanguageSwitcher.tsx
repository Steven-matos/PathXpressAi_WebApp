'use client';

import { useState, useEffect } from 'react';

export function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const cookieLang = document.cookie.match(/preferred_language=(\w+)/)?.[1];
    setCurrentLang(cookieLang || 'en');
  }, []);

  if (!mounted) return null;
  
  return (
    <div>
      <button onClick={() => {
        document.cookie = 'preferred_language=en; path=/';
        window.location.reload();
      }}>English</button>
    </div>
  );
} 