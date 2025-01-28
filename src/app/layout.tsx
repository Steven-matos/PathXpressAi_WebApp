import "../styles/globals.css";
import { Inter } from "next/font/google";
import { ReduxProvider } from "@/providers/redux-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageSwitcher } from '../components/language-switcher';
import { TranslationProvider } from "@/context/TranslationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SchedulPath.ai",
  description: "AI-powered route optimization that adapts to real-time traffic, weather, and your schedule",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ReduxProvider>
            <TranslationProvider>
              <header className="absolute right-4 top-4 z-10">
                <LanguageSwitcher />
              </header>
              {children}
            </TranslationProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
