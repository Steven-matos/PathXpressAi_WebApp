"use client";

import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";
import { LanguageSwitcher } from "./language-switcher";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className={`bg-primary text-white mt-auto w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 py-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center">
              <span className="text-sm text-gray-300">Logo</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <Link
              href="/terms-and-conditions"
              className="text-secondary hover:text-accent transition-colors"
            >
              {t("footer.termsAndConditions")}
            </Link>
            <Link
              href="/privacy-policy"
              className="text-secondary hover:text-accent transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>
          </nav>
        </div>

        {/* Copyright Section */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </div>

        <div className="flex items-center gap-2 md:self-end py-2">
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
