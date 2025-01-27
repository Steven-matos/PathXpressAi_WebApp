"use client";

import Calendar from "./Calendar";
import { ReduxProvider } from "@/providers/redux-provider";

export function CalendarClient() {
  return (
    <ReduxProvider>
      <Calendar />
    </ReduxProvider>
  );
}
