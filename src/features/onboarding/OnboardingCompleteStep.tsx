"use client";

import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function OnboardingCompleteStep() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4">{t("onboarding.complete.title")}</h2>
      <p className="mb-6">{t("onboarding.complete.description")}</p>
      <Button
        onClick={() => router.push(`/dashboard/${user?.username}`)}
        className="text-lg py-6 px-8"
      >
        {t("onboarding.complete.goToDashboard")}
      </Button>
    </div>
  );
} 