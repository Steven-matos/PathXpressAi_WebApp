"use client";
import { TranslationProvider } from "../context/TranslationContext";
import { CalendarClient } from "../components/CalendarClient";

export default function Home() {
  return (
    <TranslationProvider>
      <main className="container mx-auto p-4">
        <CalendarClient />
      </main>
    </TranslationProvider>
  );
}
