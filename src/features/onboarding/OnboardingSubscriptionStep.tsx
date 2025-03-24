"use client";

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
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/context/TranslationContext";
import { useOnboarding, SubscriptionTier } from "@/context/OnboardingContext";
import { updateUserAttributes } from "aws-amplify/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const subscriptionSchema = z.object({
  subscriptionTier: z.enum(['free', 'basic', 'premium', 'enterprise'] as const),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

// Subscription tier definitions
const subscriptionTiers = [
  {
    id: 'free' as SubscriptionTier,
    name: "Free",
    price: "$0/month",
    features: ["5 routes per day", "Basic analytics", "Email support"],
  },
  {
    id: 'basic' as SubscriptionTier,
    name: "Basic",
    price: "$9.99/month",
    features: ["20 routes per day", "Standard analytics", "Priority email support", "Route optimization"],
  },
  {
    id: 'premium' as SubscriptionTier,
    name: "Premium",
    price: "$29.99/month",
    features: ["Unlimited routes", "Advanced analytics", "24/7 phone support", "Route optimization", "Team collaboration"],
  },
  {
    id: 'enterprise' as SubscriptionTier, 
    name: "Enterprise",
    price: "Custom pricing",
    features: ["Unlimited everything", "Custom integrations", "Dedicated account manager", "SLA guarantees", "White-label options"],
  },
];

export function OnboardingSubscriptionStep() {
  const { t } = useTranslation();
  const { userData, updateUserData, completeCurrentStep, createUserInDatabase } = useOnboarding();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      subscriptionTier: userData.subscriptionTier || 'free',
    },
  });

  async function onSubmit(values: SubscriptionFormValues) {
    try {
      setIsLoading(true);
      
      // Save to Cognito as a custom attribute
      await updateUserAttributes({
        userAttributes: {
          'custom:subscription_tier': values.subscriptionTier,
        },
      });
      
      // Update local state
      updateUserData({ subscriptionTier: values.subscriptionTier });
      
      // Create the user in database
      setCreatingUser(true);
      try {
        await createUserInDatabase();
        
        toast({
          title: "Account Created",
          description: "Your account has been successfully created.",
          duration: 3000,
        });
      } catch (dbError) {
        toast({
          title: "Database Error",
          description: "There was an issue creating your account in our database. Your preferences have been saved locally.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setCreatingUser(false);
      }
      
      toast({
        title: "Subscription Updated",
        description: "Your subscription plan has been saved.",
        duration: 3000,
      });
      
      // Move to next step (completion)
      completeCurrentStep();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your subscription. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t("onboarding.subscription.title")}</h2>
          <p className="text-muted-foreground">
            {t("onboarding.subscription.description")}
          </p>

          <FormField
            control={form.control}
            name="subscriptionTier"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormLabel className="sr-only">{t("onboarding.subscription.tier")}</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subscriptionTiers.map((tier) => (
                      <Card
                        key={tier.id}
                        className={`p-4 cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                          field.value === tier.id ? 'border-2 border-primary' : ''
                        }`}
                        onClick={() => field.onChange(tier.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{tier.name}</h3>
                            <p className="text-lg font-medium text-primary">{tier.price}</p>
                          </div>
                          {field.value === tier.id && (
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <ul className="mt-4 space-y-2">
                          {tier.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || form.formState.isSubmitting || creatingUser}
        >
          {form.formState.isSubmitting 
            ? (t("onboarding.saving") || "Saving...")
            : creatingUser
              ? (t("onboarding.creatingAccount") || "Creating account...")
              : (t("onboarding.complete") || "Complete")}
        </Button>
      </form>
    </Form>
  );
} 