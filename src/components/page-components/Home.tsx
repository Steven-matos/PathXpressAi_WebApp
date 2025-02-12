"use client";

import { useTranslation } from "@/context/TranslationContext";
import Link from "next/link";
import {
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useResponsiveVideo } from '@/hooks/useResponsiveVideo';
import Image from "next/image";
import DriverPhone from "../../../public/driver-phone.jpg";

export function Home() {
  const { t } = useTranslation();
  const videoSources = useResponsiveVideo();

  const features = [
    { id: "aiRouting" },
    { id: "multiStop" },
    { id: "mobileSync" },
    { id: "liveUpdates" },
    { id: "fleetOptimization" },
  ];

  const plans = [
    {
      id: "weekly",
      price: "9.99",
      duration: "week",
      featuresKeys: [
        "plans.weekly.features.0",
        "plans.weekly.features.1",
        "plans.weekly.features.2",
      ],
    },
    {
      id: "monthly",
      price: "29.99",
      duration: "month",
      popular: true,
      featuresKeys: [
        "plans.monthly.features.0",
        "plans.monthly.features.1",
        "plans.monthly.features.2",
      ],
    },
    {
      id: "yearly",
      price: "299.99",
      duration: "year",
      featuresKeys: [
        "plans.yearly.features.0",
        "plans.yearly.features.1",
        "plans.yearly.features.2",
        "plans.yearly.features.3",
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section aria-label="Main product introduction">
        <div className="relative overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="object-cover w-full h-full"
              poster="/video-poster.jpg"
              preload="metadata"
            >
              <source
                src={videoSources.webm}
                type="video/webm"
              />
              <source
                src={videoSources.mp4}
                type="video/mp4"
              />
            </video>
            {/* Semi-transparent overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          {/* Content */}
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl [text-shadow:_0_1px_12px_rgb(0_0_0_/_40%)]">
              {t("heroTitle")}
            </h1>
            <h1 className="text-4xl font-extrabold text-accent sm:text-5xl lg:text-6xl [text-shadow:_0_1px_12px_rgb(0_0_0_/_40%)]">
              {t("heroTitle2")}
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl mx-auto [text-shadow:_0_1px_8px_rgb(0_0_0_/_40%)]">
              {t("heroSubtitle")}
            </p>
            <div className="mt-10">
              <Link
                href="#"
                className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors shadow-lg"
              >
                {t("startTrial")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
        {/* Background gradient effect */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.100),white)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-accent">
              {t("featuresTagline")}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {t("featuresTitle")}
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t("featuresSubtitle")}
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            {/* Image Section */}
            <div className="relative mb-16 lg:mb-24">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100 shadow-xl ring-1 ring-gray-400/10 sm:aspect-[3/2] lg:aspect-[2/1]">
                <Image
                  src={DriverPhone}
                  alt="Driver using mobile app"
                  className="absolute left-0 top-0 w-full h-full object-cover"
                  quality={90}
                  priority
                  placeholder="blur"
                />
                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 mix-blend-multiply" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 -right-4 -bottom-4 rounded-2xl bg-primary/5 ring-1 ring-inset ring-primary/10 lg:-top-6 lg:-left-6 lg:-right-6 lg:-bottom-6" />
            </div>

            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-5">
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className="group relative transform transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative pl-16">
                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary group-hover:bg-accent transition-colors">
                      <div className="h-8 w-8 text-white" aria-hidden="true">
                        {feature.id === "aiRouting" && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                          </svg>
                        )}
                        {feature.id === "multiStop" && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        )}
                        {feature.id === "mobileSync" && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                          </svg>
                        )}
                        {feature.id === "liveUpdates" && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 0 1 0-5.303m5.304 0a3.75 3.75 0 0 1 0 5.303m-7.425 2.122a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12Z" />
                          </svg>
                        )}
                        {feature.id === "fleetOptimization" && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <dt className="text-lg font-semibold leading-7 text-primary">
                      {t(`features.${feature.id}.title`)}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">
                      {t(`features.${feature.id}.description`)}
                    </dd>
                  </div>
                  {/* Decorative gradient line */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t("pricingTitle")}
            </h2>
            <p className="mt-4 text-xl text-gray-500">{t("pricingSubtitle")}</p>
          </div>
          <div className="mt-16 space-y-16 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative bg-white border-2 border-gray-200 rounded-2xl shadow-sm p-8"
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 transform bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {t("mostPopular")}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900">
                  {t(`plans.${plan.id}.name`)}
                </h3>
                <div className="mt-6">
                  <p className="text-6xl font-extrabold text-gray-900">
                    ${plan.price}
                  </p>
                  <p className="mt-2 text-gray-500">
                    {t("pricing.per")} {t(`duration.${plan.duration}`)}
                  </p>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.featuresKeys.map((key) => (
                    <li key={key} className="flex items-start">
                      <span className="text-blue-500">✓</span>
                      <span className="ml-3 text-gray-700">{t(key)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="#"
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t("getStarted")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="pt-5 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl shadow-xl p-8 sm:p-12 lg:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-extrabold text-gray-900">
                {t("contactTitle")}
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                {t("contactSubtitle")}
              </p>
            </div>
            <form className="mt-12 space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("firstName")}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t("firstNamePlaceholder")}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("lastName")}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t("lastNamePlaceholder")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("emailAddress")} <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t("emailPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("message")}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t("messagePlaceholder")}
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  {t("sendMessage")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Path Xpress Ai",
          url: "https://Path Xpress Ai",
          logo: "https://Path Xpress Ai/logo.png",
          description: "AI-powered route optimization platform",
          sameAs: [
            "https://twitter.com/schedulpath",
            "https://linkedin.com/company/schedulpath",
          ],
        })}
      </script>
    </div>
  );
}
