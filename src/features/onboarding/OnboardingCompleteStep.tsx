"use client";

import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

export function OnboardingCompleteStep() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const { setOnboardingComplete } = useOnboarding();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleComplete = async () => {
    if (!user?.username) {
      toast({
        title: t("onboarding.complete.error"),
        description: t("onboarding.complete.errorDescription"),
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      setIsLoading(true);
      await setOnboardingComplete();
      
      toast({
        title: t("onboarding.complete.success"),
        description: t("onboarding.complete.description"),
        duration: 3000,
      });

      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        router.push(`/dashboard/${user.username}`);
      }, 100);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: t("onboarding.complete.error"),
        description: t("onboarding.complete.errorDescription"),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4">{t("onboarding.complete.title")}</h2>
      <p className="mb-6">{t("onboarding.complete.description")}</p>
      <Button
        onClick={handleComplete}
        className="text-lg py-6 px-8"
        disabled={isLoading || !user?.username}
      >
        {isLoading ? t("onboarding.complete.creatingAccount") : t("onboarding.complete.goToDashboard")}
      </Button>
    </div>
  );
} 