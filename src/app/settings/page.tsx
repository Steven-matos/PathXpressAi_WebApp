"use client";
import { ReduxProvider } from "@/providers/redux-provider";
import { Settings } from "@/features/settings";

export default function SettingsPage() {
    return (
        <ReduxProvider>
            <Settings />
        </ReduxProvider>
    );
}
