"use client";

import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="absolute w-full top-4 z-10 flex justify-between items-center px-4">
      <Link
        href="/"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span className="hidden sm:inline" suppressHydrationWarning>
          {t("home")}
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="#"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {t("signIn")}
        </Link>
      </div>
    </header>
  );
}
