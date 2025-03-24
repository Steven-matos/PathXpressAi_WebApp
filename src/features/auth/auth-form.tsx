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
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/context/TranslationContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnboarding } from "@/context/OnboardingContext";

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

const confirmationSchema = z.object({
  email: z.string().email("Invalid email address"),
  confirmationCode: z.string().min(6, "Confirmation code is required"),
});

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const { t, language } = useTranslation();
  const router = useRouter();
  const { signIn, signUp, confirmSignUp } = useAuth();
  const { checkUserExists, forceCheckUserExists } = useOnboarding();
  const { toast } = useToast();
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasCheckedUserExists, setHasCheckedUserExists] = useState(false);
  const [userExistsResult, setUserExistsResult] = useState<boolean | null>(null);

  type FormValues = z.infer<typeof loginSchema | typeof signupSchema>;
  type ConfirmationValues = z.infer<typeof confirmationSchema>;

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

  const confirmationForm = useForm<ConfirmationValues>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      email: userEmail,
      confirmationCode: "",
    },
  });

  useEffect(() => {
    confirmationForm.setValue("email", userEmail);
    console.log("Updated confirmation form with email:", userEmail);
  }, [userEmail, confirmationForm]);

  async function onSubmit(values: FormValues) {
    if (mode === "signup") {
      try {
        // Type assertion to ensure TypeScript knows we're dealing with signup form values
        const signupValues = values as z.infer<typeof signupSchema>;
        
        const address = `${signupValues.address}, ${signupValues.city}, ${signupValues.state} ${signupValues.zip}`;
        setUserEmail(signupValues.email);

        console.log('🔄 Attempting to sign up with:', { 
          email: signupValues.email,
          givenName: signupValues.name,
          // Not logging password
          addressLength: address.length
        });

        // Sign up the user with Amplify
        const result = await signUp({
          email: signupValues.email,
          password: signupValues.password,
          givenName: signupValues.name,
          address: address,
        });

        console.log('✅ Sign up result:', { isSignUpComplete: result.isSignUpComplete });

        if (result.isSignUpComplete) {
          // If sign up is complete without confirmation (unlikely with Cognito)
          toast({
            title: "Sign Up Successful",
            description: "You can now log in with your credentials.",
            duration: 3000,
          });
          router.push("/login");
        } else {
          // User needs to confirm their account
          setNeedsConfirmation(true);
          toast({
            title: "Confirmation Required",
            description: "Please check your email for a confirmation code.",
            duration: 5000,
          });
        }
      } catch (error: any) {
        console.error("❌ Sign up error:", error);
        
        // Log detailed error information to help with debugging
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          code: error.code,
          statusCode: error.$metadata?.httpStatusCode
        });

        // Handle specific error cases
        let errorMessage = "An error occurred during sign up";
        
        if (error.name === 'UsernameExistsException') {
          errorMessage = "This email is already registered. Please use a different email or try to log in.";
        } else if (error.name === 'InvalidParameterException' && error.message.includes('password')) {
          errorMessage = "Password does not meet requirements. Please use a stronger password."; 
        } else if (error.name === 'InvalidPasswordException') {
          errorMessage = "Password does not meet requirements. Please use a stronger password with numbers, special characters and uppercase letters.";
        } else if (error.name === 'TokenProviderNotFoundException') {
          errorMessage = "Authentication configuration error. User Pool credentials may be missing or invalid.";
        } else if (error.name === 'AmplifyError' && error.message.includes('token provider')) {
          errorMessage = "Authentication system is not properly configured. Please contact support.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast({
          title: "Sign Up Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
    } else {
      // Login flow
      try {
        const loginValues = values as z.infer<typeof loginSchema>;
        
        const result = await signIn({
          email: loginValues.email,
          password: loginValues.password,
        });

        if (result.isSignedIn) {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
            duration: 3000,
          });
          
          // Prevent multiple redirects
          if (isRedirecting) return;
          setIsRedirecting(true);
          
          // Force a small delay before redirect to ensure auth state is properly updated
          setTimeout(async () => {
            try {
              // Use cached result if available
              if (userExistsResult !== null) {
                console.log('Using cached user existence check result:', userExistsResult);
                
                if (userExistsResult) {
                  router.push("/dashboard");
                } else {
                  router.push("/onboarding");
                }
                return;
              }
              
              console.log('Checking if user exists in database...');
              
              try {
                // Use forceCheckUserExists to ensure we get a fresh result
                // but only on the first check
                const userExists = hasCheckedUserExists 
                  ? await checkUserExists() 
                  : await forceCheckUserExists();
                
                console.log('User exists in database:', userExists);
                
                // Cache the result
                setUserExistsResult(userExists);
                setHasCheckedUserExists(true);
                
                // Update onboarding status in localStorage based on user existence
                if (typeof window !== 'undefined') {
                  localStorage.setItem('onboardingComplete', userExists ? 'true' : 'false');
                  localStorage.setItem('userExistsChecked', 'true');
                }
                
                // Redirect based on whether user exists in database
                if (userExists) {
                  console.log('User exists, redirecting to dashboard...');
                  try {
                    router.push("/dashboard");
                  } catch (routerError) {
                    console.error('Router error during dashboard redirect:', routerError);
                    // Fallback to direct navigation if router.push fails
                    window.location.href = '/dashboard';
                  }
                } else {
                  console.log('User does not exist, redirecting to onboarding...');
                  try {
                    router.push("/onboarding");
                  } catch (routerError) {
                    console.error('Router error during onboarding redirect:', routerError);
                    // Fallback to direct navigation if router.push fails
                    window.location.href = '/onboarding';
                  }
                }
                
                // Add a safety timeout for redirect
                setTimeout(() => {
                  if (window.location.pathname === '/login') {
                    console.log('Still on login page, forcing redirect...');
                    window.location.href = userExists ? '/dashboard' : '/onboarding';
                  }
                }, 1000);
              } catch (checkError) {
                // If checking fails for any reason, assume user doesn't exist
                console.error('Error checking if user exists:', checkError);
                router.push("/onboarding");
              }
            } catch (routerError) {
              console.error('Error during redirect:', routerError);
              // Fallback to direct navigation
              window.location.href = '/onboarding';
            }
          }, 500);
        }
      } catch (error) {
        console.error("Login error:", error);
        
        // Handle specific errors
        if (error instanceof Error && error.name === "UserNotConfirmedException") {
          const loginValues = values as z.infer<typeof loginSchema>;
          setUserEmail(loginValues.email);
          setNeedsConfirmation(true);
          toast({
            title: "Account Not Confirmed",
            description: "Please confirm your account with the code sent to your email",
            duration: 5000,
          });
        } else {
          toast({
            title: "Login Failed",
            description: error instanceof Error ? error.message : "Authentication error",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    }
  }

  async function onConfirmationSubmit(values: ConfirmationValues) {
    console.log("Submitting confirmation with:", values);
    try {
      // Ensure we have a valid email
      const emailToUse = userEmail || values.email;
      console.log("Using email for confirmation:", emailToUse);
      
      const result = await confirmSignUp({
        email: emailToUse,
        confirmationCode: values.confirmationCode,
      });

      console.log("Confirmation result:", result);

      if (result.isSignUpComplete) {
        toast({
          title: "Account Confirmed",
          description: "Your account has been confirmed successfully.",
          duration: 3000,
        });
        
        // Store the email for the login attempt
        const confirmedEmail = emailToUse;
        
        // Wait a moment to ensure everything is processed
        setTimeout(async () => {
          setNeedsConfirmation(false);
          
          try {
            // Get password based on which mode we're in
            let password = '';
            if (mode === 'signup') {
              // Coming from signup flow
              const signupValues = form.getValues() as z.infer<typeof signupSchema>;
              password = signupValues.password;
            } else {
              // Coming from login flow with unconfirmed account
              const loginValues = form.getValues() as z.infer<typeof loginSchema>;
              password = loginValues.password;
            }
            
            if (password) {
              // Attempt to sign in automatically
              const signInResult = await signIn({
                email: confirmedEmail,
                password: password,
              });
              
              if (signInResult.isSignedIn) {
                toast({
                  title: "Auto Login Successful",
                  description: "Welcome! Let's complete your profile setup.",
                  duration: 3000,
                });
                
                // Redirect to onboarding flow instead of login page
                router.push("/onboarding");
                return;
              }
            }
            
            // Fallback if auto-login fails or no password
            router.push("/login");
          } catch (loginError) {
            console.error("Auto-login error:", loginError);
            toast({
              title: "Auto Login Failed",
              description: "Your account is verified but we couldn't log you in automatically. Please log in manually.",
              variant: "destructive",
              duration: 5000,
            });
            router.push("/login");
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error("Confirmation error:", error);
      
      // Log detailed error information to help with debugging
      console.error('Confirmation error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.$metadata?.httpStatusCode
      });
      
      // Handle specific error cases
      let errorMessage = "An error occurred during confirmation";
      
      if (error.name === 'CodeMismatchException') {
        errorMessage = "Invalid confirmation code. Please check and try again.";
      } else if (error.name === 'ExpiredCodeException') {
        errorMessage = "Confirmation code has expired. Please request a new one.";
      } else if (error.name === 'UserLambdaValidationException' && error.message.includes('GraphQL')) {
        errorMessage = "Account was confirmed, but there was an issue with additional setup. You can try logging in.";
        
        // In this case, we might still want to redirect to login
        setTimeout(() => {
          setNeedsConfirmation(false);
          router.push("/login");
        }, 1000);
        
        return; // Exit early after scheduling the redirect
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Confirmation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  }

  if (needsConfirmation) {
    return (
      <Form {...confirmationForm}>
        <form onSubmit={confirmationForm.handleSubmit(onConfirmationSubmit)} className="space-y-6">
          <h2 className="text-2xl font-bold">{t("Confirm Your Account")}</h2>
          <p className="text-muted-foreground">{t("Please enter the confirmation code sent to your email")}</p>
          
          <FormField
            control={confirmationForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Email")}</FormLabel>
                <FormControl>
                  <Input {...field} readOnly value={userEmail} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={confirmationForm.control}
            name="confirmationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Confirmation Code")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("Enter your confirmation code")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={confirmationForm.formState.isSubmitting}>
            {confirmationForm.formState.isSubmitting ? t("Confirming...") : t("Confirm Account")}
          </Button>
        </form>
      </Form>
    );
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
                      <Select 
                        onValueChange={field.onChange} 
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("signup.statePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.code} value={state.code}>
                              {state.name} ({state.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
