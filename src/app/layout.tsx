import "../styles/globals.css";
import { Inter } from "next/font/google";
import { TranslationProvider } from "@/context/TranslationContext";
import { ReduxProvider } from "@/providers/redux-provider";
import { AuthProvider } from "@/hooks/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Path Xpress Ai - AI-Powered Route Optimization",
    template: "%s | Path Xpress Ai",
  },
  description:
    "Real-time AI route optimization adapting to traffic, weather, and schedules. Reduce delivery times and fuel costs with smart logistics planning.",
  keywords: [
    "AI route optimization",
    "real-time traffic routing",
    "delivery route planner",
    "logistics management",
    "fuel cost reduction",
    "smart scheduling",
  ],
  openGraph: {
    title: "Path Xpress Ai - Intelligent Route Planning",
    description:
      "AI-driven logistics optimization with real-time traffic and weather adaptation",
    url: "https://pathxpressai.com",
    siteName: "Path Xpress Ai",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Path Xpress Ai - Smart Logistics Solution",
    description:
      "Transform your delivery routes with AI-powered real-time optimization",
    images: ["/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <TranslationProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
