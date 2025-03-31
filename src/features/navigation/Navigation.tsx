// src/features/navigation/Navigation.tsx
"use client";

import Link from "next/link";
import { useTranslation } from "@/context/TranslationContext";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/AuthContext";
import { LogOutIcon } from "lucide-react";

export default function Navigation() {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // The AuthContext will handle the redirect to login
  };

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
          <button 
            onClick={handleLogout} 
            className="text-white flex items-center hover:text-red-300 transition-colors"
          >
            <LogOutIcon className="h-4 w-4 mr-1" />
            <Text id="logout" fallback="Logout" />
          </button>
        </div>
      </div>
    </nav>
  );
}
