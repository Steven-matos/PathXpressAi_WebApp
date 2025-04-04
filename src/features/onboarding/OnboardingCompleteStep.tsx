"use client";

import { useTranslation } from "@/context/TranslationContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { signIn, signOut } from 'aws-amplify/auth';

export function OnboardingCompleteStep() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
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

      // Only attempt to sign in if the user is not already authenticated
      if (!isAuthenticated) {
        try {
          // Try to sign in with retries
          let retryCount = 0;
          const maxRetries = 3;
          let signInSuccess = false;

          while (retryCount < maxRetries && !signInSuccess) {
            try {
              await signIn({ username: user.username });
              signInSuccess = true;
            } catch (error) {
              console.error(`Sign in attempt ${retryCount + 1} failed:`, error);
              retryCount++;
              
              if (retryCount === maxRetries) {
                // If all retries failed, try to force a new sign in
                try {
                  await signOut({ global: true });
                  await signIn({ username: user.username });
                  signInSuccess = true;
                } catch (finalError) {
                  console.error('Final sign in attempt failed:', finalError);
                  throw new Error('Authentication failed. Please try signing in again.');
                }
              } else {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
              }
            }
          }
        } catch (error) {
          console.error("Authentication error:", error);
          toast({
            title: t("onboarding.complete.error"),
            description: t("onboarding.complete.authError"),
            variant: "destructive",
            duration: 5000,
          });
          return;
        }
      }

      // Attempt to complete onboarding
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
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      
      // Handle specific error cases
      let errorMessage = t("onboarding.complete.errorDescription");
      if (error.message?.includes("No credentials")) {
        errorMessage = t("onboarding.complete.credentialsError");
      } else if (error.message?.includes("Authentication session expired")) {
        errorMessage = t("onboarding.complete.sessionError");
        // Add a retry button for session expiration
        toast({
          title: t("onboarding.complete.error"),
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
          action: (
            <Button
              variant="outline"
              onClick={() => {
                // Clear any stored auth state
                localStorage.removeItem('userAttributes');
                localStorage.removeItem('onboardingData');
                // Redirect to sign in
                router.push('/auth/signin');
              }}
            >
              {t("onboarding.complete.retrySignIn")}
            </Button>
          ),
        });
        return;
      } else if (error.message?.includes("assertUserNotAuthenticated")) {
        // Handle the specific error we're seeing
        errorMessage = "You are already signed in. Proceeding with account creation.";
        console.log("User already authenticated, proceeding with account creation");
      }

      toast({
        title: t("onboarding.complete.error"),
        description: errorMessage,
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