'use client';

import { useState, useEffect } from 'react';

export function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Indicates component is mounted
  }, []);

  if (!mounted) {    
    return null; // Return placeholder during SSR
  }

  // Now safely access cookies
  const preferredLang = document.cookie.match(/preferred_language=(\w+)/)?.[1];
  
  return (
    // Render based on preferredLang
    <div>
      <button onClick={() => {
        document.cookie = 'preferred_language=en; path=/';
        window.location.reload();
      }}>English</button>
    </div>
  );
} 