"use client";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LegalSection } from "@/components/page-components/legal-section";
import { useTranslation } from "@/context/TranslationContext";

function PrivacyPolicyContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 flex-1">
        <h1 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl underline">
          {t("privacy_policy.title")}
        </h1>
        <LegalSection contentKey="privacy_policy" />
      </main>
      <Footer />
    </div>
  );
}

export default function PrivacyPolicy() {
  return <PrivacyPolicyContent />;
}
