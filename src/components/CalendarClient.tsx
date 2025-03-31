"use client";

import { Calendar } from "@/features/calendar";
import { ReduxProvider } from "@/providers/redux-provider";

export function CalendarClient() {
  return (
    <ReduxProvider>
      <Calendar />
    </ReduxProvider>
  );
}
