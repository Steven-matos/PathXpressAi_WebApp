"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/clientStore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from "@/context/TranslationContext";
import Navigation from "@/features/navigation";
import { UserProfile, AmplifyStatus, CognitoTester } from "@/features/auth";

interface Route {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'pending' | 'in_progress' | 'completed';
  driver?: string;
  vehicle?: string;
}

interface UserState {
  name: string;
  email: string;
  role: string;
}

interface RoutesState {
  tomorrow: Route[];
  today: Route[];
  past: Route[];
}

export default function DashboardUserPage({ params }: { params: { userId: string } }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  // Get user data from Redux store
  const username = useSelector((state: RootState) => state.auth.user?.username);
  const routes = useSelector((state: RootState) => state.routes.tomorrow) as Route[];
  const routesLoading = useSelector((state: RootState) => state.routes.isLoading);
  const routesError = useSelector((state: RootState) => state.routes.error);
  const userId = params.userId;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (!isClient || authLoading || routesLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (routesError) {
    return <div>Error loading routes: {routesError}</div>;
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
              {t("welcome")}, {username || user.username}!
            </h1>
            <h2 className="text-xl mt-4">{t("routesForTomorrow")}</h2>
            {routes.length > 0 ? (
              <table className="min-w-full mt-4">
                <thead>
                  <tr>
                    <th>{t("route")}</th>
                    <th>{t("startTime")}</th>
                    <th>{t("endTime")}</th>
                    <th>{t("status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id}>
                      <td>{route.title}</td>
                      <td>{route.start}</td>
                      <td>{route.end}</td>
                      <td>{t(`status.${route.status}`)}</td>
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
