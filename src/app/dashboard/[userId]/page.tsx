"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const params = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const userId = params["userId"] as string;

  useEffect(() => {
    // Verify authentication
    if (!token) {
      router.push("/login");
      return;
    }

    // Verify user data with API
    const verifyUser = async () => {
      try {
        const response = await fetch(
          `https://2p74yk9yn0.execute-api.us-east-1.amazonaws.com/v1/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to verify user");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error verifying user:", error);
        router.push("/login");
      }
    };

    verifyUser();
  }, [token, userId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {/* Add your dashboard content here */}
        </div>
      </main>
    </div>
  );
}
