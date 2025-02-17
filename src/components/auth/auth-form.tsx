"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth-context";
import { useTranslation } from "@/context/TranslationContext";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = loginSchema
  .extend({
    name: z.string().min(2, "Name must be at least 2 characters"),
    address: z.string().min(5, "Please enter a valid street address"),
    city: z.string().min(2, "Please enter a valid city"),
    state: z.string().length(2, "State must be 2-letter abbreviation"),
    zip: z.string().regex(/^\d{5}$/, "ZIP must be 5 digits"),
    language: z.enum(["en", "es"]),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const { t, language } = useTranslation();
  const router = useRouter();
  const { setToken } = useAuth();
  const { toast } = useToast();

  type FormValues = z.infer<typeof loginSchema | typeof signupSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      ...(mode === "signup" && {
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        language: "en",
      }),
    },
  });

  async function onSubmit(values: FormValues) {
    if (mode === "signup") {
      // Show toast for now since signup is disabled
      toast({
        title: "Product Not Live",
        description:
          "Product not live yet. Feel free to reach out via email for any questions.",
        duration: 5000,
      });
      return;

      /* Commented out signup implementation for future use
      try {
        // Create user
        const userResponse = await fetch(
          `https://2p74yk9yn0.execute-api.us-east-1.amazonaws.com/v1/user`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: values.email,
              name: values.name,
              preferences: {
                routeOptimization: "FASTEST",
                language: values.language,
              },
              homeBase: `${values.address}, ${values.city}, ${values.state} ${values.zip}`,
            }),
          }
        );

        if (!userResponse.ok) throw new Error("Failed to create user");

        // After successful signup, authenticate user
        const loginResponse = await fetch(
          `https://2p74yk9yn0.execute-api.us-east-1.amazonaws.com/v1/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          }
        );

        if (!loginResponse.ok) throw new Error("Authentication failed");
        const loginData = await loginResponse.json();

        // Generate API key for the new user
        const apiKeyResponse = await fetch(
          `https://2p74yk9yn0.execute-api.us-east-1.amazonaws.com/v1/api-keys`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${loginData.token}`,
            },
          }
        );

        if (!apiKeyResponse.ok) throw new Error("Failed to generate API key");
        const apiKeyData = await apiKeyResponse.json();

        // Set the API key in auth context
        setToken(apiKeyData.apiKey);

        // Navigate to dashboard with user ID
        router.push(`/dashboard/${loginData.userId}`);
      } catch (error) {
        form.setError("root", {
          message: error instanceof Error ? error.message : "Signup error",
        });
      }
      */
    }

    // Login flow
    try {
      // First, authenticate user
      const loginResponse = await fetch(
        `https://2p74yk9yn0.execute-api.us-east-1.amazonaws.com/v1/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }
      );

      if (!loginResponse.ok) throw new Error("Authentication failed");
      const loginData = await loginResponse.json();

      // Generate API key for the authenticated user
      const apiKeyResponse = await fetch(
        `https://2p74yk9yn0.execute-api.us-east-1.amazonaws.com/v1/api-keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`,
          },
        }
      );

      if (!apiKeyResponse.ok) throw new Error("Failed to generate API key");
      const apiKeyData = await apiKeyResponse.json();

      // Set the API key in auth context
      setToken(apiKeyData.apiKey);

      // Navigate to dashboard with user ID
      router.push(`/dashboard/${loginData.userId}`);
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Authentication error",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mode === "login" ? (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("login.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("login.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("signup.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("login.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("login.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("signup.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("signup.address")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("signup.addressPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("signup.city")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("signup.cityPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("signup.state")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("signup.statePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("signup.zip")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("signup.zipPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} value={language} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-accent text-white"
          disabled={form.formState.isSubmitting}
        >
          {mode === "login" ? t("login.signIn") : t("signUp")}
        </Button>
      </form>
    </Form>
  );
}
