"use client";

import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";
import { LanguageSwitcher } from "./language-switcher";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center">
              <span className="text-sm text-gray-300">Logo</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <Link
              href="/terms-and-conditions"
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t("footer.termsAndConditions")}
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>
          </nav>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </div>

        <div className="flex items-center gap-4 md:self-end">
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
