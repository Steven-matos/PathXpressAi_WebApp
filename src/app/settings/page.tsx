"use client";
import { ReduxProvider } from "@/providers/redux-provider";
import Settings from "../../components/page-components/Settings";

export default function SettingsPage() {
    return (
        <ReduxProvider>
            <Settings />
        </ReduxProvider>
    );
}
