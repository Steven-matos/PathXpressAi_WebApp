// src/components/Navigation.tsx
"use client";

import Link from "next/link";
import { useTranslation } from "../context/TranslationContext";
import { Text } from "./ui/text";

export default function Navigation() {
  const { t } = useTranslation();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo placeholder */}
        <div className="text-white font-bold">
          {/* Replace with an actual logo if available */}
          <Text id="footer.title" fallback="Path Xpress AI" />
        </div>
        <div className="flex space-x-4">
          <Link href="/dashboard" className="text-white">
            <Text id="dashboard" fallback="Dashboard" />
          </Link>
          <Link href="/calendar" className="text-white">
            <Text id="calendar" fallback="Calendar" />
          </Link>
          <Link href="/settings" className="text-white">
            <Text id="settings" fallback="Settings" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
