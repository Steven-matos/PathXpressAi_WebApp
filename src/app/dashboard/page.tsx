"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useTranslation } from "../../context/TranslationContext";
import Navigation from "../../components/Navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/components/auth/UserProfile";
import AmplifyStatus from "@/components/AmplifyStatus";
import { CognitoTester } from "@/components/CognitoTester";

export default function Dashboard() {
  const { t } = useTranslation();
  const username = useSelector((state: RootState) => state.user.name);
  const routes = useSelector((state: RootState) => state.routes.tomorrow);
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        router.push("/login");
      } else if (user) {
        // Authenticated, redirect to user-specific dashboard
        router.push(`/dashboard/${user.username}`);
      }
    }
  }, [isAuthenticated, isLoading, router, user]);

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
      </div>
    </div>
  );
}
