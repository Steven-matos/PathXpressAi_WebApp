'use client'
import { useTranslation } from '@/context/TranslationContext';

export default function TermsAndConditions() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <main className="max-w-4xl mx-auto py-16">
                    <article className="prose lg:prose-xl">
                        <h1 className="text-6xl font-extrabold text-gray-900 mb-8 underline underline-offset-4">
                            {t('termsTitle')}
                        </h1>

                        <section aria-labelledby="acceptance-of-terms">
                            <h2 id="acceptance-of-terms" className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                                {t('termsSections.acceptanceOfTerms')}
                            </h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>{t('termsContent.acceptanceOfTerms.0')}</li>
                                <li>{t('termsContent.acceptanceOfTerms.1')}</li>
                                <li>{t('termsContent.acceptanceOfTerms.2')}</li>
                            </ul>
                        </section>

                        <section aria-labelledby="service-description">
                            <h2 id="service-description" className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                                {t('termsSections.serviceDescription')}
                            </h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>{t('termsContent.serviceDescription.0')}</li>
                                <li>{t('termsContent.serviceDescription.1')}</li>
                                <li>{t('termsContent.serviceDescription.2')}</li>
                            </ul>
                        </section>

                        <section aria-labelledby="user-responsibilities">
                            <h2 id="user-responsibilities" className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                                {t('termsSections.userResponsibilities')}
                            </h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>{t('termsContent.userResponsibilities.0')}</li>
                                <li>{t('termsContent.userResponsibilities.1')}</li>
                                <li>{t('termsContent.userResponsibilities.2')}</li>
                            </ul>
                        </section>

                        <section aria-labelledby="data-usage">
                            <h2 id="data-usage" className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                                {t('termsSections.dataUsage')}
                            </h2>
                            <p className="text-gray-600">
                                {t('termsContent.dataUsage.0')}
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                                <li>{t('termsContent.dataUsage.1')}</li>
                                <li>{t('termsContent.dataUsage.2')}</li>
                                <li>{t('termsContent.dataUsage.3')}</li>
                            </ul>
                        </section>

                        <section aria-labelledby="subscription-terms">
                            <h2 id="subscription-terms" className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                                {t('termsSections.subscriptionTerms')}
                            </h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>{t('termsContent.subscriptionTerms.0')}</li>
                                <li>{t('termsContent.subscriptionTerms.1')}</li>
                                <li>{t('termsContent.subscriptionTerms.2')}</li>
                                <li>{t('termsContent.subscriptionTerms.3')}</li>
                            </ul>
                        </section>

                        <section aria-labelledby="user-feedback">
                            <h2 id="user-feedback" className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                                {t('termsSections.userFeedback')}
                            </h2>
                            <p className="text-gray-600">
                                {t('termsContent.userFeedback.0')}
                            </p>
                            <p className="text-gray-600 mt-4">
                                {t('termsContent.userFeedback.1')}
                            </p>
                        </section>

                        <section aria-labelledby="changes-to-terms">
                            <h2 id="changes-to-terms" className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                                10. Changes to Terms
                            </h2>
                            <p className="text-gray-600">
                                We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.
                            </p>
                        </section>
                    </article>
                </main>
            </div>
        </div>
    );
} 