"use client";
import { TranslationProvider } from "../../context/TranslationContext";
import Calendar from "../../components/page-components/Calendar";
import Navigation from "../../components/Navigation";
import { ReduxProvider } from "@/providers/redux-provider";

export default function CalendarPage() {
  return (
    <TranslationProvider>
      <ReduxProvider>
        <Navigation />
        <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
          <Calendar />
        </div>
      </ReduxProvider>
    </TranslationProvider>
  );
}
