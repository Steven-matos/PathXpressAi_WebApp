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
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/context/TranslationContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback, useRef } from "react";
import { SimpleSelect, SimpleSelectOption } from "@/components/ui/simple-select";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  language: z.enum(["en", "es"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function OnboardingProfileStep() {
  const { t, setLang } = useTranslation();
  const { userData, updateUserData, completeCurrentStep, currentStep, resetOnboarding, hardResetOnboarding, goToPreviousStep } = useOnboarding();
  const { user } = useAuth(); // Get the authenticated user from AuthContext
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [skipLoadingPermanently, setSkipLoadingPermanently] = useState(false);
  const initialLoadDone = useRef(false);
  const hasResetOnboarding = useRef(false);

  // Use resetOnboarding instead of manually clearing localStorage
  useEffect(() => {
    console.log("Current onboarding step:", currentStep);
    
    // Prevent multiple resets in the same session
    if (hasResetOnboarding.current) {
      return;
    }

    // If we're not on the profile step but this component is mounted, reset onboarding
    if (currentStep !== 'profile') {
      console.log("Detected step skip, resetting onboarding process");
      
      // Mark that we've performed a reset
      hasResetOnboarding.current = true;
      
      // Add small delay to ensure state is properly synchronized
      setTimeout(() => {
        resetOnboarding();
      }, 50);
    }
  }, [currentStep, resetOnboarding]);

  // Define language options
  const languageOptions: SimpleSelectOption[] = [
    { value: "en", label: t("english") },
    { value: "es", label: t("spanish") }
  ];

  // Use memoized functions for stable dependency arrays
  const handleLanguageChange = useCallback((value: string | undefined) => {
    if (!value) return;
    
    if (value === 'en' || value === 'es') {
      setLang(value);
    }
  }, [setLang]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name || "",
      language: userData.language || "en",
    },
  });

  // Function to manually skip the loading and proceed
  const skipWaiting = useCallback(() => {
    setIsLoading(false);
    setLoadingError(false);
    setSkipLoadingPermanently(true); // Prevent loading from coming back
    toast({
      title: "Loading Skipped",
      description: "You can now enter your name and continue.",
      duration: 3000,
    });
  }, [toast]);

  // Initialize with user data from Auth context instead of fetching from Cognito
  useEffect(() => {
    // Only run this effect once, or when explicitly needed
    if (initialLoadDone.current && !skipLoadingPermanently) {
      return;
    }
    
    // Don't run loading if we've chosen to skip it permanently
    if (skipLoadingPermanently) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const timeouts: NodeJS.Timeout[] = [];
    
    // Start with loading state
    if (isMounted) {
      setIsLoading(true);
    }
    
    const timeoutId = setTimeout(() => {
      // Safety timeout to prevent infinite loading
      if (isMounted && isLoading) {
        setIsLoading(false);
        setLoadingError(true);
        toast({
          title: "Loading Timeout",
          description: "Could not load your profile data. You can continue with the form.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }, 2000);
    timeouts.push(timeoutId);

    // Run this outside the setState call to prevent loops
    try {
      // Prepare values to update - do this outside of state updates to batch them
      let nameToUse = "";
      let langToUse = userData.language || "en";
      
      // Function to get user attributes as initial values for our separate user table
      const getUserAttributes = async () => {
        if (user) {
          try {
            // Check if we have cached attributes
            const cachedAttributes = localStorage.getItem('userAttributes');
            if (cachedAttributes) {
              const attributes = JSON.parse(cachedAttributes);
              console.log("Using cached user attributes:", attributes);
              return attributes;
            }

            // If no cache, fetch from Cognito
            const attributes = await fetchUserAttributes();
            console.log("Fetched user attributes from Cognito:", attributes);
            
            // Cache the attributes
            localStorage.setItem('userAttributes', JSON.stringify(attributes));
            
            return attributes;
          } catch (error) {
            console.error("Error fetching auth user attributes:", error);
            return null;
          }
        }
        return null;
      };
      
      // If we already have data in context, use that (might have been set during signup)
      if (userData.name) {
        nameToUse = userData.name;
        processFormData();
      } else {
        // Get user attributes and then process form data
        getUserAttributes().finally(processFormData);
      }
      
      // Try to detect browser language if we don't have one set
      if (!langToUse) {
        try {
          // Try to detect browser language preferences
          console.log("No language preference found in Cognito, checking browser language");
          
          // Safe browser language detection
          let browserLang = 'en';
          if (typeof navigator !== 'undefined' && navigator.language) {
            const parts = navigator.language.split('-');
            if (parts.length > 0 && parts[0]) {
              browserLang = parts[0].toLowerCase();
            }
          }
          console.log("Browser language detected:", browserLang);
          
          // Only set if it's one of our supported languages
          if (browserLang === 'es') {
            langToUse = 'es';
            console.log("Using Spanish based on browser language");
          } else {
            // Default to English for all other languages
            langToUse = 'en';
            console.log("Using English as default language");
          }
        } catch (error) {
          console.error("Error detecting browser language, defaulting to English:", error);
          langToUse = 'en';
        }
      }
      
      // Function to process form data after getting user attributes
      function processFormData() {
        // Execute all updates in a single microtask to batch them
        const formUpdateTimer = setTimeout(() => {
          if (!isMounted) return;
          
          try {
            // First update user data in context (doesn't trigger rerenders)
            updateUserData({ 
              name: nameToUse,
              language: langToUse 
            });
            
            // Only reset form if component is still mounted
            if (isMounted) {
              // Use silent reset option to avoid unnecessary rerenders
              form.reset(
                {
                  name: nameToUse,
                  language: langToUse
                },
                { keepValues: true, keepDirty: false, keepIsSubmitted: false, keepErrors: false }
              );
            }
            
            // Finally set loading to false
            if (isMounted) {
              setIsLoading(false);
              // Mark that we've done the initial load
              initialLoadDone.current = true;
            }
          } catch (formError) {
            // Handle form errors gracefully
            if (isMounted) {
              console.error("Form update error:", formError);
              setIsLoading(false);
              setLoadingError(true);
              // Still mark as done even if there was an error
              initialLoadDone.current = true;
            }
          }
        }, 0);
        timeouts.push(formUpdateTimer);
      }
      
    } catch (error) {
      if (isMounted) {
        setLoadingError(true);
        setIsLoading(false);
        // Still mark as done even if there was an error
        initialLoadDone.current = true;
      }
    }

    return () => {
      isMounted = false;
      // Clear all timeouts
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [form, updateUserData, toast, skipLoadingPermanently, user, resetOnboarding]);

  async function onSubmit(values: ProfileFormValues) {
    if (skipLoadingPermanently) {
      // Only save to local context - no Cognito updates
      updateUserData({ 
        name: values.name,
        language: values.language 
      });
      
      // Update the app language
      handleLanguageChange(values.language);
      
      // Small delay to allow React to process any state updates
      setTimeout(() => {
        completeCurrentStep();
      }, 50);
      
      return;
    }

    let submitTimeout: NodeJS.Timeout | null = null;
    try {
      setIsLoading(true);
      
      // Set a timeout safety to prevent getting stuck in loading state
      submitTimeout = setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Operation Timed Out",
          description: "The request is taking longer than expected. Your data has been saved locally.",
          variant: "destructive",
          duration: 5000,
        });
        
        // Update local state - this is what will be used for the user table
        console.log("Saving profile data for separate user table after timeout:", {
          name: values.name,
          language: values.language
        });
        
        updateUserData({ 
          name: values.name,
          language: values.language 
        });
        
        // Update the app language
        handleLanguageChange(values.language);
        
        // Small delay to allow React to process any state updates
        setTimeout(() => {
          completeCurrentStep();
        }, 50);
      }, 3000); // Reduced timeout to 3 seconds
      
      // NO COGNITO UPDATES HERE - we're only collecting data for our separate user table
      
      // Save the data in context for the user table that will be created at the end of onboarding
      console.log("Saving profile data for separate user table:", {
        name: values.name,
        language: values.language
      });
      
      updateUserData({ 
        name: values.name,
        language: values.language 
      });
      
      // Update the app language
      handleLanguageChange(values.language);
      
      // Clear the timeout since operation succeeded
      if (submitTimeout) clearTimeout(submitTimeout);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
        duration: 3000,
      });
      
      // Small delay to allow React to process any state updates
      setTimeout(() => {
        completeCurrentStep();
      }, 50);
    } catch (error) {
      // Update local state even if something fails
      updateUserData({ 
        name: values.name,
        language: values.language 
      });
      
      // Update the app language
      handleLanguageChange(values.language);
      
      // Show appropriate error message
      const errorObj = error as any;
      const errorMessage = errorObj.message || "There was a problem updating your profile. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      // Allow continuing to next step even if there's an error
      // This ensures users don't get stuck in the onboarding flow
      setTimeout(() => {
        completeCurrentStep();
      }, 50);
    } finally {
      // Clear the timeout if it's still active
      if (submitTimeout) clearTimeout(submitTimeout);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mx-auto">
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("onboarding.profile.title") || "Welcome to Path Xpress AI"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("onboarding.profile.description") || "Let's set up your profile to get started. Tell us how we should address you."}
            </p>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">{t("onboarding.profile.name") || "Your Name"}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("onboarding.profile.namePlaceholder") || "Enter your full name"}
                      className="h-12 text-lg"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">{t("onboarding.profile.selectLanguage") || "Select your preferred language"}</FormLabel>
                  <FormControl>
                    <SimpleSelect
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleLanguageChange(value);
                      }}
                      options={languageOptions}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="w-full text-white text-lg py-6" 
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