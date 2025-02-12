"use client";

import { Calendar } from "./page-components/Calendar";
import { ReduxProvider } from "@/providers/redux-provider";

export function CalendarClient() {
  return (
    <ReduxProvider>
      <Calendar />
    </ReduxProvider>
  );
}
