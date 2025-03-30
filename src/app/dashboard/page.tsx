"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/clientStore";
import { useTranslation } from "@/context/TranslationContext";
import Navigation from "@/features/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserProfile, AmplifyStatus, CognitoTester } from "@/features/auth";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  // Get user data from Redux store
  const username = useSelector((state: RootState) => state.auth.user?.username);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (!isClient || authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <UserProfile />
            <AmplifyStatus />
            <CognitoTester />
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2 bg-secondary shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold">
              {t("welcome")}, {username || user.username}!
            </h1>
            <p className="mt-4">{t("dashboardWelcomeMessage")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
