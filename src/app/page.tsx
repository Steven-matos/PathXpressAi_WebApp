"use client";
import Dashboard from "../pages/dashboard";
import { TranslationProvider } from "../context/TranslationContext";

export default function Home() {
  return (
    <TranslationProvider>
      <Dashboard />
    </TranslationProvider>
  );
}
