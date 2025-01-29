'use client';

import { useState, useEffect } from 'react';

export function DateDisplay() {
  const [date, setDate] = useState('');

  useEffect(() => {
    // Client-side only date formatting
    setDate(new Date().toLocaleDateString());
  }, []);

  return <span>{date}</span>;
} 