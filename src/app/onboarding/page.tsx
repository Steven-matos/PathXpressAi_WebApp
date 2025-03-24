"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { 
  OnboardingProfileStep,
  OnboardingAddressStep,
  OnboardingSubscriptionStep,
  OnboardingProgress 
} from "@/features/onboarding";
import { useTranslation } from "@/context/TranslationContext";

export default function OnboardingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { currentStep, isOnboardingComplete } = useOnboarding();
  const router = useRouter();
  const { t } = useTranslation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    
    // If onboarding is already complete, redirect to dashboard
    if (!isLoading && isAuthenticated && isOnboardingComplete && user) {
      router.push(`/dashboard/${user.username}`);
    }
  }, [isLoading, isAuthenticated, isOnboardingComplete, router, user]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!isAuthenticated || (isOnboardingComplete && user)) {
    return null;
  }

  // Render the current step
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg px-6 py-8 bg-background rounded-lg shadow-lg">
        <OnboardingProgress />
        
        {currentStep === "profile" && <OnboardingProfileStep />}
        {currentStep === "address" && <OnboardingAddressStep />}
        {currentStep === "subscription" && <OnboardingSubscriptionStep />}
        {currentStep === "complete" && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">{t("onboarding.complete.title")}</h2>
            <p className="mb-6">{t("onboarding.complete.description")}</p>
            <button
              onClick={() => router.push(`/dashboard/${user?.username}`)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {t("onboarding.complete.goToDashboard")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 