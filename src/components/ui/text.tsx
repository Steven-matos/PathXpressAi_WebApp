"use client";

import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import clsx from 'clsx';

interface TextProps {
  id: string;
  className?: string;
  fallback?: string;
  children?: React.ReactNode;
  asElement?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export function Text({ id, className, fallback, children, asElement = 'span' }: TextProps) {
  const { t, isLoaded } = useTranslation();
  const translatedText = t(id);
  const displayText = translatedText !== id ? translatedText : (fallback || id);
  
  const Element = asElement as any;
  
  // Show loading state if translations aren't loaded yet
  if (!isLoaded) {
    return (
      <Element className={clsx('animate-pulse bg-gray-200 rounded h-4 w-20', className)}>
        &nbsp;
      </Element>
    );
  }
  
  return (
    <Element className={className}>
      {displayText}
      {children}
    </Element>
  );
} 