"use client"

import { useTranslation } from '@/context/TranslationContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { TranslationProvider } from '@/context/TranslationContext';
export function LanguageSwitcher() {
  const { setLang } = useTranslation();

  return (
    <TranslationProvider>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-white hover:text-blue-100 transition-colors">
          🌐
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLang('en')}>
            🇺🇸 English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLang('es')}>
            🇪🇸 Español
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TranslationProvider>
   
  )
} 