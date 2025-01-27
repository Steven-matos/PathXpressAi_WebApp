// src/components/Navigation.tsx
"use client";

import Link from "next/link";
import { useTranslation } from "../context/TranslationContext";

export default function Navigation() {
  const { t } = useTranslation();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo placeholder */}
        <div className="text-white font-bold">
          {/* Replace with an actual logo if available */}
          Logo
        </div>
        <div className="flex space-x-4">
          <Link href="/" className="text-white">
            {t("dashboard")}
          </Link>
          <Link href="/calendar" className="text-white">
            {t("calendar")}
          </Link>
          <Link href="/settings" className="text-white">
            {t("settings")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
