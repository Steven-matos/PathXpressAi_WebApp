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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/context/TranslationContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { updateUserAttributes, fetchUserAttributes } from "aws-amplify/auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

// US States array with abbreviations and full names
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const addressSchema = z.object({
  address: z.string().min(5, "Please enter a valid street address"),
  city: z.string().min(2, "Please enter a valid city"),
  state: z.string().length(2, "State must be 2-letter abbreviation"),
  zip: z.string().regex(/^\d{5}$/, "ZIP must be 5 digits"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export function OnboardingAddressStep() {
  const { t } = useTranslation();
  const { userData, updateUserData, completeCurrentStep, goToPreviousStep } = useOnboarding();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: userData.address || "",
      city: userData.city || "",
      state: userData.state || "",
      zip: userData.zip || "",
    },
  });

  // Try to fetch and parse address from Cognito when component mounts
  useEffect(() => {
    async function loadUserAddress() {
      try {
        setIsLoading(true);
        
        // Use data from context instead of fetching from Cognito
        if (userData.address) {
          form.setValue("address", userData.address);
        }
        
        if (userData.city) {
          form.setValue("city", userData.city);
        }
        
        if (userData.state) {
          form.setValue("state", userData.state);
        }
        
        if (userData.zip) {
          form.setValue("zip", userData.zip);
        }
      } catch (error) {
        console.error("Error loading address:", error);
        setLoadingError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserAddress();
  }, [form, userData]);

  async function onSubmit(values: AddressFormValues) {
    try {
      setIsLoading(true);
      
      // Format full address for Cognito
      const fullAddress = `${values.address}, ${values.city}, ${values.state} ${values.zip}`;
      
      // Update local state first
      updateUserData({
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
      });
      
      // Update Cognito attributes
      await updateUserAttributes({
        userAttributes: {
          address: fullAddress,
        },
      });
      
      // Update cached attributes
      const cachedAttributes = localStorage.getItem('userAttributes');
      if (cachedAttributes) {
        const attributes = JSON.parse(cachedAttributes);
        attributes.address = fullAddress;
        localStorage.setItem('userAttributes', JSON.stringify(attributes));
      }
      
      toast({
        title: "Address Updated",
        description: "Your home base address has been saved.",
        duration: 3000,
      });
      
      // Move to next step
      completeCurrentStep();
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your address. Please try again.",
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
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {t("onboarding.address.title") || "Set Your Home Base Address"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("onboarding.address.description") || "We need your address to help optimize your routes and calculate distances."}
            </p>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">{t("onboarding.address.street") || "Street Address"}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={t("onboarding.address.streetPlaceholder") || "Enter your street address"}
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">{t("onboarding.address.city") || "City"}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder={t("onboarding.address.cityPlaceholder") || "Enter your city"}
                      className="h-12 text-lg"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">{t("onboarding.address.state") || "State"}</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 text-lg">
                          <SelectValue placeholder={t("onboarding.address.statePlaceholder") || "Select state"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name} ({state.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">{t("onboarding.address.zip") || "ZIP Code"}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder={t("onboarding.address.zipPlaceholder") || "Enter ZIP code"}
                        className="h-12 text-lg"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
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