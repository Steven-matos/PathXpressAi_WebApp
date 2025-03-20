import "../styles/globals.css";
import { Inter } from "next/font/google";
import { TranslationProvider } from "@/context/TranslationContext";
import { ReduxProvider } from "@/providers/redux-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import AmplifyClientProvider from "@/components/AmplifyClientProvider";

const inter = Inter({ subsets: ["latin"] });

// Add this script to detect browser language and set it before the page loads
const languageDetectorScript = `
  try {
    const getBrowserLanguage = () => {
      const userLang = navigator.language || navigator.userLanguage;
      return userLang.split('-')[0]; // Get primary language code
    };

    const savedLang = localStorage.getItem('preferredLang');
    if (!savedLang) {
      const browserLang = getBrowserLanguage();
      const supportedLanguages = ['en', 'es'];
      
      // Only set if it's a supported language
      if (supportedLanguages.includes(browserLang)) {
        localStorage.setItem('preferredLang', browserLang);
        document.cookie = \`preferredLang=\${browserLang}; path=/; max-age=31536000\`;
      }
    }
  } catch (e) {
    // Ignore errors in language detection
  }
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://pathxpressai.com"),
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
  icons: {
    icon: '/assets/favicons/favicon.ico',
    apple: '/assets/images/apple-icon.png',
  },
  openGraph: {
    title: "Path Xpress Ai - Intelligent Route Planning",
    description:
      "AI-driven logistics optimization with real-time traffic and weather adaptation",
    url: "https://pathxpressai.com",
    siteName: "Path Xpress Ai",
    images: [
      {
        url: "/assets/images/og-image.jpg",
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
    images: ["/assets/images/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Path Xpress Ai" />
        <link rel="apple-touch-icon" href="/assets/images/apple-icon.png" />
        <link rel="icon" href="/assets/favicons/favicon.ico" />
        {/* Add the language detector script */}
        <script dangerouslySetInnerHTML={{ __html: languageDetectorScript }} />
      </head>
      <body className={inter.className}>
        <AmplifyClientProvider>
          <AuthProvider>
            <TranslationProvider>
              <ReduxProvider>{children}</ReduxProvider>
            </TranslationProvider>
          </AuthProvider>
        </AmplifyClientProvider>
        <Toaster />
        <meta
          property="og:image"
          content={`https://pathxpressai.com/assets/images/og-image.jpg`}
        />
      </body>
    </html>
  );
}
