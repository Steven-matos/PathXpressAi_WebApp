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
import { useState, useEffect } from "react";
import { CheckIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const subscriptionSchema = z.object({
  subscriptionTier: z.enum(['free', 'monthly', 'yearly'] as const),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

// Subscription tier definitions
const subscriptionTiers: Array<{
  id: SubscriptionTier;
  name: string;
  price: number;
  features: string[];
}> = [
  {
    id: 'free',
    name: "Free",
    price: 0,
    features: [
      "5 routes per day",
      "Basic routing optimization",
      "Email support",
      "Standard processing speed"
    ],
  },
  {
    id: 'monthly',
    name: "Monthly",
    price: 29.99,
    features: [
      "Unlimited routes per day",
      "Advanced routing optimization",
      "Priority support",
      "Faster processing speed"
    ],
  },
  {
    id: 'yearly',
    name: "Yearly",
    price: 299.99,
    features: [
      "Unlimited routes per day",
      "Premium routing optimization",
      "VIP support",
      "Fastest processing speed",
      "Beta features access"
    ],
  },
];

export function OnboardingSubscriptionStep() {
  const { t } = useTranslation();
  const { userData, updateUserData, goToPreviousStep, completeCurrentStep } = useOnboarding();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      subscriptionTier: userData.subscriptionTier || 'free',
    },
  });

  // Load cached subscription data when component mounts
  useEffect(() => {
    const loadCachedSubscription = () => {
      try {
        // Check localStorage for cached attributes
        const cachedAttributes = localStorage.getItem('userAttributes');
        if (cachedAttributes) {
          const attributes = JSON.parse(cachedAttributes);
          const cachedTier = attributes['custom:subscription_tier'];
          
          // If we have a cached tier and it's valid, update the form
          if (cachedTier && subscriptionTiers.some(tier => tier.id === cachedTier)) {
            form.setValue('subscriptionTier', cachedTier as SubscriptionTier);
            updateUserData({ subscriptionTier: cachedTier as SubscriptionTier });
          }
        }

        // Check for cached onboarding data
        const cachedOnboarding = localStorage.getItem('onboardingData');
        if (cachedOnboarding) {
          const onboardingData = JSON.parse(cachedOnboarding);
          if (onboardingData.subscriptionTier) {
            form.setValue('subscriptionTier', onboardingData.subscriptionTier as SubscriptionTier);
            updateUserData({ subscriptionTier: onboardingData.subscriptionTier as SubscriptionTier });
          }
        }
      } catch (error) {
        console.error('Error loading cached subscription data:', error);
      }
    };

    loadCachedSubscription();
  }, [form, updateUserData]);

  async function onSubmit(values: SubscriptionFormValues) {
    try {
      setIsLoading(true);
      
      // Update user data with subscription information
      await updateUserData({
        subscriptionTier: values.subscriptionTier
      });
      
      // Move to review step
      completeCurrentStep();
    } catch (error) {
      console.error("Error in subscription step:", error);
      
      // Provide more specific error messages based on the error type
      const errorMessage = error instanceof Error 
        ? error.message 
        : "There was a problem saving your subscription. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <FormField
            control={form.control}
            name="subscriptionTier"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-2xl font-semibold mb-8 block text-center">
                  {t("onboarding.subscription.title") || "Choose Your Subscription Plan"}
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-[1200px] mx-auto justify-center">
                    {subscriptionTiers.map((tier) => (
                      <Card
                        key={tier.id}
                        className={`flex-1 min-w-[300px] max-w-[380px] p-6 md:p-8 cursor-pointer transition-all hover:border-accent hover:shadow-lg ${
                          field.value === tier.id ? 'border-2 border-accent' : ''
                        }`}
                        onClick={() => field.onChange(tier.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-xl md:text-2xl">{tier.name}</h3>
                            <p className="text-xl md:text-2xl font-medium text-accent mt-2">${tier.price}/month</p>
                          </div>
                          {field.value === tier.id && (
                            <div className="bg-accent text-accent-foreground rounded-full p-2 md:p-3">
                              <CheckIcon className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                          )}
                        </div>
                        <ul className="mt-8 space-y-4">
                          {tier.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <CheckIcon className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                              <span className="text-base md:text-lg">{feature}</span>
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

        <div className="flex gap-4">
          <Button 
            type="button"
            variant="outline"
            className="flex-1 text-lg py-6"
            onClick={() => goToPreviousStep()}
          >
            {t("back") || "Back"}
          </Button>
          <Button 
            type="submit" 
            onClick={() => {
              form.handleSubmit(onSubmit)();
            }}
            className="flex-1 text-white text-lg py-6" 
            disabled={isLoading || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting 
              ? t("saving")
              : t("continue")}
          </Button>
        </div>
      </form>
    </Form>
  );
}