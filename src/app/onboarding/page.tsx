"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { 
  OnboardingProfileStep,
  OnboardingAddressStep,
  OnboardingSubscriptionStep,
  OnboardingProgress,
  OnboardingReviewStep,
  OnboardingCompleteStep
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
      <div className={`w-full px-4 sm:px-6 lg:px-8 py-8 bg-background rounded-lg shadow-lg ${
        currentStep === 'subscription' 
          ? 'max-w-[1400px]' 
          : 'max-w-[800px]'
      }`}>
        <OnboardingProgress />
        
        <div className="flex-1 flex items-center justify-center py-12">
          {currentStep === 'profile' && <OnboardingProfileStep />}
          {currentStep === 'address' && <OnboardingAddressStep />}
          {currentStep === 'subscription' && <OnboardingSubscriptionStep />}
          {currentStep === 'review' && <OnboardingReviewStep />}
          {currentStep === 'complete' && <OnboardingCompleteStep />}
        </div>
      </div>
    </div>
  );
} 