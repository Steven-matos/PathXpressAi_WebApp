"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTranslation } from "@/context/TranslationContext";
import Navigation from "@/features/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, AmplifyStatus, CognitoTester } from "@/features/auth";

export default function Dashboard() {
  const { t } = useTranslation();
  const username = useSelector((state: RootState) => state.user.name);
  const routes = useSelector((state: RootState) => state.routes.tomorrow);
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isOnboardingComplete } = useOnboarding();
  const router = useRouter();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    console.log("Dashboard page loaded, auth state:", { 
      isAuthenticated, 
      isLoading, 
      hasUser: !!user, 
      username: user?.username,
      isOnboardingComplete
    });

    if (!isLoading) {
      try {
        if (!isAuthenticated) {
          // Not authenticated, redirect to login
          console.log("Not authenticated, redirecting to login...");
          router.push("/login");
        } else if (!isOnboardingComplete) {
          // Authenticated but onboarding not complete, redirect to onboarding
          console.log("Onboarding not complete, redirecting to onboarding...");
          router.push("/onboarding");
          
          // Safety redirect
          if (!redirectAttempted) {
            setRedirectAttempted(true);
            setTimeout(() => {
              if (window.location.pathname === '/dashboard') {
                console.log("Still on dashboard, forcing redirect to onboarding...");
                window.location.href = '/onboarding';
              }
            }, 500);
          }
        } else if (user) {
          // Authenticated and onboarded, redirect to user-specific dashboard
          console.log(`User found (${user.username}), redirecting to user dashboard...`);
          router.push(`/dashboard/${user.username}`);
          
          // Safety redirect
          if (!redirectAttempted) {
            setRedirectAttempted(true);
            setTimeout(() => {
              if (window.location.pathname === '/dashboard') {
                console.log("Still on dashboard, forcing redirect to user dashboard...");
                window.location.href = `/dashboard/${user.username}`;
              }
            }, 500);
          }
        } else {
          console.log("No user object available yet, but authenticated. Waiting...");
        }
      } catch (error) {
        console.error("Error during dashboard redirect:", error);
      }
    }
  }, [isAuthenticated, isLoading, isOnboardingComplete, router, user, redirectAttempted]);

  // Render a temporary dashboard if we're stuck here
  if (!isLoading && isAuthenticated && !redirectAttempted) {
    return (
      <div>
        <Navigation />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">
            {t("welcome")}, {user?.username || username || "User"}!
          </h1>
          <p>{t("loading")} {t("dashboard")}...</p>
          <div className="mt-4">
            <button 
              onClick={() => router.push('/onboarding')} 
              className="px-4 py-2 bg-primary text-white rounded-md mr-4"
            >
              Go to Onboarding
            </button>
            {user && (
              <button 
                onClick={() => router.push(`/dashboard/${user.username}`)} 
                className="px-4 py-2 bg-secondary text-white rounded-md"
              >
                Go to User Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

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

  // This is just a fallback, should redirect before rendering
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p>{t("redirecting")}...</p>
        <button 
          onClick={() => {
            if (isAuthenticated) {
              if (!isOnboardingComplete) {
                window.location.href = '/onboarding';
              } else if (user) {
                window.location.href = `/dashboard/${user.username}`;
              } else {
                window.location.href = '/login';
              }
            } else {
              window.location.href = '/login';
            }
          }}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Click to Continue
        </button>
      </div>
    </div>
  );
}
