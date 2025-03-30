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
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/context/TranslationContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PencilIcon } from "lucide-react";
import { PolicyModal } from "@/components/modals/PolicyModal";
import { termsAndConditions, privacyPolicy } from "@/content/policies";

const reviewSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms and Conditions",
  }),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: "You must accept the Privacy Policy",
  }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function OnboardingReviewStep() {
  const { t } = useTranslation();
  const { userData, completeCurrentStep, goToPreviousStep, setCurrentStep, updateUserData } = useOnboarding();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasViewedTerms, setHasViewedTerms] = useState(false);
  const [hasViewedPrivacy, setHasViewedPrivacy] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'terms' | 'privacy' | null;
  }>({
    isOpen: false,
    type: null,
  });

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  const handleOpenModal = (type: 'terms' | 'privacy') => {
    setModalState({ isOpen: true, type });
  };

  const handleCloseModal = () => {
    // Only allow closing through the agree button
    return;
  };

  const handleAcceptPolicy = () => {
    if (modalState.type === 'terms') {
      setHasViewedTerms(true);
      form.setValue('acceptTerms', true, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    } else if (modalState.type === 'privacy') {
      setHasViewedPrivacy(true);
      form.setValue('acceptPrivacy', true, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }
    setModalState({ isOpen: false, type: null });
  };

  async function onSubmit(values: ReviewFormValues) {
    try {
      setIsLoading(true);
      
      // Update user data with terms acceptance
      updateUserData({
        terms: true,
        privacy_policy: true,
        subscriptionPlan: userData.subscriptionPlan
      });
      
      // Update cached attributes
      const cachedAttributes = localStorage.getItem('userAttributes');
      if (cachedAttributes) {
        const attributes = JSON.parse(cachedAttributes);
        localStorage.setItem('userAttributes', JSON.stringify(attributes));
      }
      
      // Move to next step (completion)
      completeCurrentStep();
    } catch (error) {
      console.error("Error in review step:", error);
      toast({
        title: "Error",
        description: "There was a problem completing your review. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mx-auto">
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            {t("onboarding.review.title") || "Review Your Information"}
          </h2>

          <div className="space-y-6">
            {/* Profile Information */}
            <Card className="p-6 relative">
              <button
                type="button"
                onClick={() => setCurrentStep('profile')}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <PencilIcon className="h-5 w-5 text-gray-500" />
              </button>
              <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{userData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">{userData.language === 'en' ? 'English' : 'Spanish'}</span>
                </div>
              </div>
            </Card>

            {/* Address Information */}
            <Card className="p-6 relative">
              <button
                type="button"
                onClick={() => setCurrentStep('address')}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <PencilIcon className="h-5 w-5 text-gray-500" />
              </button>
              <h3 className="text-xl font-semibold mb-4">Address Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Street Address</span>
                  <span className="font-medium">{userData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City</span>
                  <span className="font-medium">{userData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State</span>
                  <span className="font-medium">{userData.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ZIP Code</span>
                  <span className="font-medium">{userData.zip}</span>
                </div>
              </div>
            </Card>

            {/* Subscription Information */}
            <Card className="p-6 relative">
              <button
                type="button"
                onClick={() => setCurrentStep('subscription')}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <PencilIcon className="h-5 w-5 text-gray-500" />
              </button>
              <h3 className="text-xl font-semibold mb-4">Subscription Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Plan</span>
                  <span className="font-medium capitalize">{userData.subscriptionPlan.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing Period</span>
                  <span className="font-medium">
                    {userData.subscriptionPlan.type === "yearly" ? 'Yearly' : 'Monthly'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked && !hasViewedTerms) {
                            handleOpenModal('terms');
                            return;
                          }
                          field.onChange(checked);
                        }}
                        disabled={!hasViewedTerms}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the{" "}
                        <button
                          type="button"
                          onClick={() => handleOpenModal('terms')}
                          className="text-accent hover:underline"
                        >
                          Terms and Conditions
                        </button>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptPrivacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked && !hasViewedPrivacy) {
                            handleOpenModal('privacy');
                            return;
                          }
                          field.onChange(checked);
                        }}
                        disabled={!hasViewedPrivacy}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I accept the{" "}
                        <button
                          type="button"
                          onClick={() => handleOpenModal('privacy')}
                          className="text-accent hover:underline"
                        >
                          Privacy Policy
                        </button>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
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
            className="flex-1 text-white text-lg py-6" 
            disabled={isLoading || form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting 
              ? t("saving")
              : form.formState.isValid 
                ? t("submit") || "Submit"
                : t("complete")}
          </Button>
        </div>

        <PolicyModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          onAccept={handleAcceptPolicy}
          type={modalState.type || 'privacy'}
          content={modalState.type === 'terms' ? termsAndConditions : privacyPolicy}
          closeOnOutsideClick={false}
        />
      </form>
    </Form>
  );
} 