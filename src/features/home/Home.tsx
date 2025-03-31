"use client";

import { useTranslation } from "@/context/TranslationContext";
import Link from "next/link";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useResponsiveVideo } from "@/hooks/useResponsiveVideo";
import Image from "next/image";
import DriverPhone from "../../../public/assets/images/driver-phone.jpg";
import { useToast } from "@/hooks/use-toast";

export function Home() {
  const { t } = useTranslation();
  const videoSources = useResponsiveVideo();
  const { toast } = useToast();

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Product Not Live",
      description:
        "Product not live yet. Feel free to reach out via email for any questions.",
      duration: 5000,
    });
  };

  const features = [
    { id: "aiRouting" },
    { id: "multiStop" },
    { id: "liveUpdates" },
    { id: "mobileSync" },
    { id: "fleetOptimization" },
  ];

  const plans = [
    {
      id: "free",
      price: "0",
      duration: "month",
      featuresKeys: [
        "plans.free.features.0",
        "plans.free.features.1",
        "plans.free.features.2",
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
              poster="/assets/images/video-poster.jpg"
              preload="metadata"
            >
              <source src={videoSources.webm} type="video/webm" />
              <source src={videoSources.mp4} type="video/mp4" />
            </video>
            {/* Semi-transparent overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Content - Improved mobile spacing */}
          <div
            className="relative max-w-7xl mx-auto min-h-[80vh] px-4 sm:px-6 lg:px-8 
                          flex flex-col items-center justify-center 
                          py-16 sm:py-24 md:py-32"
          >
            {" "}
            {/* Adjusted padding for mobile */}
            <div className="w-full max-w-4xl">
              {" "}
              {/* Added max-width container */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white 
                             [text-shadow:_0_1px_12px_rgb(0_0_0_/_40%)] mb-4"
              >
                {" "}
                {/* Responsive font sizes */}
                {t("heroTitle")}
              </h1>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-accent 
                             [text-shadow:_0_1px_12px_rgb(0_0_0_/_40%)] mb-4"
              >
                {t("heroTitle2")}
              </h1>
              <p
                className="mt-4 sm:mt-6 text-lg sm:text-xl text-white max-w-3xl mx-auto 
                            [text-shadow:_0_1px_8px_rgb(0_0_0_/_40%)]"
              >
                {t("heroSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="relative isolate overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-primary-100 to-white" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Features header - Improved mobile spacing */}
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-accent">
              {t("featuresTagline")}
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-primary">
              {t("featuresTitle")}
            </p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-gray-600">
              {t("featuresSubtitle")}
            </p>
          </div>

          {/* Image section - Improved mobile handling */}
          <div className="relative mt-12 sm:mt-16 lg:mt-24">
            <div className="aspect-[16/9] sm:aspect-[3/2] lg:aspect-[2/1]">
              <Image
                src={DriverPhone}
                alt="Driver using mobile app"
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                quality={90}
                priority
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>

          {/* Features grid - Better mobile layout */}
          <dl className="mt-12 sm:mt-16 grid gap-y-10 gap-x-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group relative transform transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative pl-16">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary group-hover:bg-accent transition-colors">
                    <div className="h-8 w-8 text-white" aria-hidden="true">
                      {feature.id === "aiRouting" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                          />
                        </svg>
                      )}
                      {feature.id === "multiStop" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                      )}
                      {feature.id === "mobileSync" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                          />
                        </svg>
                      )}
                      {feature.id === "liveUpdates" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.348 14.651a3.75 3.75 0 0 1 0-5.303m5.304 0a3.75 3.75 0 0 1 0 5.303m-7.425 2.122a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12Z"
                          />
                        </svg>
                      )}
                      {feature.id === "fleetOptimization" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                          />
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

      {/* Pricing Section */}
      <div className="relative isolate overflow-hidden bg-white py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Pricing header - Mobile optimized */}
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-accent">
              {t("pricingTitle")}
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-primary">
              {t("pricingSubtitle")}
            </p>
          </div>

          {/* Pricing cards - Improved mobile grid */}
          <div
            className="isolate mx-auto mt-10 sm:mt-16 
                          grid max-w-md grid-cols-1 gap-y-8 sm:gap-y-6 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl bg-white p-8 ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "lg:z-10 lg:rounded-b-3xl lg:-mx-8 lg:p-10 ring-2 ring-accent shadow-lg"
                    : "lg:px-8"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white">
                    {t("mostPopular")}
                  </div>
                )}
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-2xl font-bold tracking-tight text-primary">
                    {t(`plans.${plan.id}.name`)}
                  </h3>
                </div>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-5xl font-bold tracking-tight text-primary">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    /{t(`duration.${plan.duration}`)}
                  </span>
                </p>
                <Link
                  href="#"
                  className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    plan.popular
                      ? "bg-accent text-white shadow-sm hover:bg-accent/90 focus-visible:outline-accent"
                      : "bg-primary/5 text-primary hover:bg-primary/10 focus-visible:outline-primary"
                  }`}
                  onClick={handleSignupClick}
                >
                  {t("comingSoon")}
                </Link>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {plan.featuresKeys.map((key) => (
                    <li key={key} className="flex gap-x-3">
                      <svg
                        className={`h-6 w-5 flex-none ${
                          plan.popular ? "text-accent" : "text-primary"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t(key)}
                    </li>
                  ))}
                </ul>
                {/* Premium decorative gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5">
                  <div className="mx-auto w-full max-w-[90%] h-full bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative isolate bg-white">
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-primary-100 to-white" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Let&apos;s optimize your routes
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t("contactSubtitle")}
            </p>
          </div>
          <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row">
            <form className="lg:flex-1">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold leading-6 text-primary"
                  >
                    {t("firstName")}
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      autoComplete="given-name"
                      placeholder={t("firstNamePlaceholder")}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold leading-6 text-primary"
                  >
                    {t("lastName")}
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      autoComplete="family-name"
                      placeholder={t("lastNamePlaceholder")}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-primary"
                  >
                    {t("emailAddress")}
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      placeholder={t("emailPlaceholder")}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold leading-6 text-primary"
                  >
                    {t("message")}
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      placeholder={t("messagePlaceholder")}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-accent transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent w-full"
                >
                  {t("sendMessage")}
                </button>
              </div>
            </form>

            {/* Contact Information */}
            <div className="lg:flex-1 lg:ml-16 lg:pt-2">
              <div className="flex flex-col gap-10">
                <div className="relative flex gap-x-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <EnvelopeIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold leading-7 text-primary">
                      Email us
                    </h3>
                    <p className="mt-2 text-base leading-7 text-gray-600">
                      We&apos;ll respond within 24 hours
                    </p>
                    <p className="mt-4">
                      <a
                        href="mailto:customerservice@pathxpressai.com"
                        className="text-sm font-semibold text-accent hover:text-accent/80"
                      >
                        customerservice@pathxpressai.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Path Xpress Ai",
            url: process.env["NEXT_PUBLIC_BASE_URL"],
            logo: `${process.env["NEXT_PUBLIC_BASE_URL"]}/assets/images/logo.png`,
            description: "AI-powered route optimization platform",
            sameAs: [
              "https://twitter.com/pathxpressai",
              "https://linkedin.com/company/pathxpressai",
            ],
          },
          null,
          2
        )}
      </script>
    </div>
  );
}
