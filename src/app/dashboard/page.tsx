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
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

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

  if (!isAuthenticated) {
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
          
          {/* Routes Preview */}
          <div className="md:col-span-2 bg-secondary shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold">
              {t("welcome")}, {user?.username || username}!
            </h1>
            <h2 className="text-xl mt-4">{t("routesForTomorrow")}</h2>
            {routes.length > 0 ? (
              <table className="min-w-full mt-4">
                <thead>
                  <tr>
                    <th>{t("route")}</th>
                    <th>{t("startTime")}</th>
                    <th>{t("endTime")}</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route, index) => (
                    <tr key={index}>
                      <td>{route.title}</td>
                      <td>{route.start}</td>
                      <td>{route.end}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-4">{t("noRoutesForTomorrow")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
