import "../styles/globals.css";
import { Inter } from "next/font/google";
import { ReduxProvider } from "@/providers/redux-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageSwitcher } from '../components/language-switcher';
import { TranslationProvider } from "@/context/TranslationContext";
import { Footer } from '../components/footer';
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "SchedulPath.ai - AI-Powered Route Optimization",
    template: "%s | SchedulPath.ai"
  },
  description: "Real-time AI route optimization adapting to traffic, weather, and schedules. Reduce delivery times and fuel costs with smart logistics planning.",
  keywords: [
    "AI route optimization", 
    "real-time traffic routing",
    "delivery route planner",
    "logistics management",
    "fuel cost reduction",
    "smart scheduling"
  ],
  openGraph: {
    title: "SchedulPath.ai - Intelligent Route Planning",
    description: "AI-driven logistics optimization with real-time traffic and weather adaptation",
    url: "https://schedulpath.ai",
    siteName: "SchedulPath.ai",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SchedulPath.ai - Smart Logistics Solution",
    description: "Transform your delivery routes with AI-powered real-time optimization",
    images: ['/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider>
          <ReduxProvider>
            <TranslationProvider>
              <header className="absolute w-full top-4 z-10 flex justify-between items-center px-4">
                <Link 
                  href="#" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Log In
                </Link>
                <LanguageSwitcher />
              </header>
              <main className="flex-1">{children}</main>
              <Footer />
            </TranslationProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
