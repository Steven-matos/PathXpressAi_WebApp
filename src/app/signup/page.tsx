"use client";
import { AuthForm } from "@/components/auth/auth-form";
import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/context/TranslationContext";
import Link from "next/link";

export default function SignupPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left side with background image */}
        <div className="hidden md:block w-1/2 relative">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/gps.jpg")' }}
          />
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="text-white space-y-6">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-accent 
                             [text-shadow:_0_1px_12px_rgb(0_0_0_/_40%)] mb-4"
              >
                {t("signup.title")}
              </h2>
              <p className="text-xl opacity-90 leading-relaxed max-w-lg">
                {t("signup.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Right side with card */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
          <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-bold text-center">
                {t("signup.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <AuthForm mode="signup" />
              </Suspense>
              <div className="text-center text-sm mt-4">
                {t("alreadyHaveAccount")}{" "}
                <Link
                  href="/login"
                  className="text-accent hover:text-accent-dark font-medium"
                >
                  {t("signIn")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
