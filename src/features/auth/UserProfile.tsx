"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserAttributes } from "aws-amplify/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/context/TranslationContext";

export function UserProfile() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [userAttributes, setUserAttributes] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUserAttributes() {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const attributes = await fetchUserAttributes();
        setUserAttributes(attributes);
        setError(null);
      } catch (err) {
        console.error("Error fetching user attributes:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch user attributes");
      } finally {
        setLoading(false);
      }
    }

    getUserAttributes();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.loading")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">{t("profile.error")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t("profile.email")}</h3>
            <p className="mt-1">{userAttributes?.email || user?.username}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t("profile.name")}</h3>
            <p className="mt-1">{userAttributes?.given_name || t("profile.notProvided")}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">{t("profile.address")}</h3>
            <p className="mt-1">{userAttributes?.address || t("profile.notProvided")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 