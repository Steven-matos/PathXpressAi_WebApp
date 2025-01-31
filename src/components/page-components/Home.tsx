'use client';

import { useTranslation } from '@/context/TranslationContext';
import Link from 'next/link';
import { UserIcon, EnvelopeIcon, ChatBubbleLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export function Home() {
  const { t } = useTranslation();

  const features = [
    { id: 'aiRouting' },
    { id: 'multiStop' },
    { id: 'mobileSync' },
    { id: 'liveUpdates' }
  ];

  const plans = [
    {
      id: 'weekly',
      price: '9.99',
      duration: 'week',
      featuresKeys: ['plans.weekly.features.0', 'plans.weekly.features.1', 'plans.weekly.features.2']
    },
    {
      id: 'monthly',
      price: '29.99',
      duration: 'month',
      popular: true,
      featuresKeys: ['plans.monthly.features.0', 'plans.monthly.features.1', 'plans.monthly.features.2']
    },
    {
      id: 'yearly',
      price: '299.99',
      duration: 'year',
      featuresKeys: ['plans.yearly.features.0', 'plans.yearly.features.1', 'plans.yearly.features.2', 'plans.yearly.features.3']
    }
  ];

  return (
      <div className="bg-white">
        {/* Hero Section */}
        <section aria-label="Main product introduction">
          <div className="relative bg-gradient-to-b from-blue-600 to-blue-700">
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                {t('heroTitle')}
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                {t('heroSubtitle')}
              </p>
              <div className="mt-10">
                <Link href="#" className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors">
                  {t('startTrial')}
                </Link>
              </div>
              <div className="mt-20 max-w-4xl mx-auto bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                {/* Placeholder for route visualization */}
                <span className="text-gray-500">Route Preview Visualization</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {t('featuresTitle')}
              </h2>
            </div>
            <section aria-label="Key features" itemScope itemType="https://schema.org/ItemList">
              <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
                {features.map((feature) => (
                  <div itemProp="itemListElement" key={feature.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900">
                      {t(`features.${feature.id}.title`)}
                    </h3>
                    <p className="mt-2 text-gray-500">
                      {t(`features.${feature.id}.description`)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {t('pricingTitle')}
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                {t('pricingSubtitle')}
              </p>
            </div>
            <div className="mt-16 space-y-16 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
              {plans.map((plan) => (
                <div key={plan.id} className="relative bg-white border-2 border-gray-200 rounded-2xl shadow-sm p-8">
                  {plan.popular && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 transform bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {t('mostPopular')}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900">{t(`plans.${plan.id}.name`)}</h3>
                  <div className="mt-6">
                    <p className="text-6xl font-extrabold text-gray-900">${plan.price}</p>
                    <p className="mt-2 text-gray-500">per {plan.duration}</p>
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
                    <Link href="#" className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition-colors">
                      {t('getStarted')}
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
                <h2 className="text-4xl font-extrabold text-gray-900">{t('contactTitle')}</h2>
                <p className="mt-4 text-lg text-gray-500">
                  {t('contactSubtitle')}
                </p>
              </div>
              <form className="mt-12 space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      {t('firstName')}
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
                        placeholder={t('firstNamePlaceholder')}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      {t('lastName')}
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
                        placeholder={t('lastNamePlaceholder')}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('emailAddress')} <span className="text-red-500">*</span>
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
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    {t('message')}
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
                      placeholder={t('messagePlaceholder')}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                    {t('sendMessage')}
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
            "name": "Path Xpress Ai",
            "url": "https://Path Xpress Ai",
            "logo": "https://Path Xpress Ai/logo.png",
            "description": "AI-powered route optimization platform",
            "sameAs": [
              "https://twitter.com/schedulpath",
              "https://linkedin.com/company/schedulpath"
            ]
          })}
        </script>
      </div>
  );
} 