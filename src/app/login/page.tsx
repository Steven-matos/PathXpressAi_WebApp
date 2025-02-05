"use client";
import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/context/TranslationContext";
import Link from "next/link";

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left side with background */}
        <div className="hidden md:block w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="h-full flex items-center justify-center p-12">
            <div className="text-white space-y-4">
              <h2 className="text-4xl font-bold">{t("login.title")}</h2>
              <p className="text-xl opacity-90">
                {t("login.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Right side with card */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {t("login.signIn")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <AuthForm mode="login" />
              </Suspense>
              <div className="text-center text-sm mt-4">
                {t("dontHaveAccount")}{' '}
                <Link href="/signup" className="text-accent hover:text-accent-dark font-medium">
                  {t("signUp")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 