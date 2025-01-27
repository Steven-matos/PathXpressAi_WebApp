"use client";
import "../styles/globals.css";
import { TranslationProvider } from "../context/TranslationContext";
import { ReduxProvider } from "@/providers/redux-provider";
import Settings from "../components/Settings";

export default function SettingsPage() {
  return (
    <TranslationProvider>
      <ReduxProvider>
        <Settings />
      </ReduxProvider>
    </TranslationProvider>
  );
}
