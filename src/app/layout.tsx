import "../styles/globals.css";
import { Inter } from "next/font/google";

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
