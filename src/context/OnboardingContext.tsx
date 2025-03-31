"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { generateClient } from 'aws-amplify/api';
import { toast } from '@/components/ui/use-toast';

// Define the subscription tier options
export type SubscriptionTier = 'free' | 'monthly' | 'yearly';
export interface SubscriptionPlan {
  id: string;
  type: SubscriptionTier;
}

// Define the onboarding steps
export type OnboardingStep = 'profile' | 'address' | 'subscription' | 'review' | 'complete';

interface OnboardingData {
  name: string;
  language: "en" | "es";
  address: string;
  city: string;
  state: string;
  zip: string;
  subscriptionPlan: SubscriptionPlan;
  terms: boolean;
  privacy_policy: boolean;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  homeBase: string;
  language: string;
  preferences: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

interface GraphQLResponse<T> {
  data: {
    [key: string]: T;
  };
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
    path: string[];
    extensions?: Record<string, any>;
  }>;
}

interface OnboardingContextType {
  // Current status
  currentStep: OnboardingStep;
  isOnboardingComplete: boolean;
  
  // User data collected during onboarding
  userData: OnboardingData;
  
  // Methods to update onboarding
  updateUserData: (data: Partial<OnboardingData>) => void;
  completeCurrentStep: () => void;
  setOnboardingComplete: () => void;
  checkUserExists: () => Promise<boolean>;
  forceCheckUserExists: () => Promise<boolean>;
  createUserInDatabase: () => Promise<void>;
  resetOnboarding: () => void;
  hardResetOnboarding: () => void;
  goToPreviousStep: () => void;
  setCurrentStep: (step: OnboardingStep) => void;
}

const defaultUserData: OnboardingData = {
  name: '',
  language: 'en',
  address: '',
  city: '',
  state: '',
  zip: '',
  subscriptionPlan: {
    id: '1',
    type: 'free'
  },
  terms: false,
  privacy_policy: false,
};

// GraphQL queries
const getUserQuery = /* GraphQL */ `
  query GetUser($input: GetUserInput!) {
    getUser(input: $input) {
      id
      email
      name
      homeBase
      language
      preferences
      subscriptionTier
      createdAt
      updatedAt
    }
  }
`;

const createUserMutation = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      name
      homeBase
      language
      preferences
      subscriptionTier
      createdAt
      updatedAt
    }
  }
`;

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('profile');
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [userData, setUserData] = useState(defaultUserData);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isCheckingUserStatus, setIsCheckingUserStatus] = useState(false);
  const [hasCheckedUserExists, setHasCheckedUserExists] = useState(false);
  const [skipAutoCheck, setSkipAutoCheck] = useState(false);

  // Check if user exists in the database and set onboarding status accordingly
  useEffect(() => {
    // Skip if we're not authenticated, no user, already checking, already checked, or explicitly skipped
    if (!isAuthenticated || !user || isCheckingUserStatus || hasCheckedUserExists || skipAutoCheck) return;

    // Only proceed if user is fully authenticated (prevent checks during initial render)
    if (!user.username) return;
    
    // Mark that we're checking to avoid duplicate calls
    setIsCheckingUserStatus(true);
    
    async function checkOnboardingStatus() {
      try {
        // Check if we have a stored result in localStorage first
        if (typeof window !== 'undefined') {
          const storedResult = localStorage.getItem('userExistsChecked');
          if (storedResult === 'true') {
            // If we've already checked before, use the stored value
            const storedComplete = localStorage.getItem('onboardingComplete') === 'true';
            setIsOnboardingComplete(storedComplete);
            setHasCheckedUserExists(true);
            setIsCheckingUserStatus(false);
            return;
          }
        }
        
        // If no stored result, check the database
        const userExists = await checkUserExists();
        
        if (userExists) {
          // User exists in the database, so onboarding is complete
          setIsOnboardingComplete(true);
          
          // Store onboarding state
          if (typeof window !== 'undefined') {
            localStorage.setItem('onboardingComplete', 'true');
            localStorage.setItem('userExistsChecked', 'true');
          }
        } else {
          // User doesn't exist, needs to go through onboarding
          setIsOnboardingComplete(false);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('onboardingComplete', 'false');
            localStorage.setItem('userExistsChecked', 'true');
          }
        }
        // Mark that we've checked user existence
        setHasCheckedUserExists(true);
      } catch (error) {
        // On error, assume onboarding is not complete to be safe
        setIsOnboardingComplete(false);
        
        // For errors, we still consider the check as attempted
        if (typeof window !== 'undefined') {
          localStorage.setItem('userExistsChecked', 'false');
        }
      } finally {
        // Reset the checking status flag
        setIsCheckingUserStatus(false);
      }
    }
    
    // Add a small delay to ensure auth state is fully resolved
    const timer = setTimeout(() => {
      checkOnboardingStatus();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, hasCheckedUserExists, skipAutoCheck]);

  // Check localStorage for onboarding status when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only load saved onboarding state if the user is authenticated
      if (!isAuthenticated || !user) {
        setCurrentStep('profile');
        return;
      }

      const storedOnboardingComplete = localStorage.getItem('onboardingComplete');
      
      if (storedOnboardingComplete === 'true') {
        setIsOnboardingComplete(true);
      } else {
        setCurrentStep('profile');
      }

      // Try to load saved onboarding progress
      const storedOnboardingData = localStorage.getItem('onboardingData');
      
      if (storedOnboardingData) {
        try {
          const parsedData = JSON.parse(storedOnboardingData);

          // Only proceed with stored data if onboarding is not complete
          if (storedOnboardingComplete !== 'true') {
            // Set user data
            setUserData(parsedData.userData || defaultUserData);
            
            // Set the current step with validation
            const savedStep = parsedData.currentStep;
            if (savedStep) {
              // Validate that the step is one of our valid steps
              if (['profile', 'address', 'subscription', 'review', 'complete'].includes(savedStep)) {
                setCurrentStep(savedStep);
              } else {
                setCurrentStep('profile');
              }
            } else {
              setCurrentStep('profile');
            }
          }
        } catch (error) {
          console.error('Error parsing stored onboarding data:', error);
          setCurrentStep('profile');
        }
      } else {
        setCurrentStep('profile');
      }
    }
  }, [isAuthenticated, user]);

  // Save onboarding data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingData', JSON.stringify({
        currentStep,
        userData,
        isOnboardingComplete
      }));
    }
  }, [currentStep, userData, isOnboardingComplete]);

  // Function to check if user exists in the database
  const checkUserExists = async (): Promise<boolean> => {
    let tempClient = null;
    
    try {
      if (!user || !user.username) {
        return false;
      }
      
      const email = user.username;
      
      try {
        tempClient = generateClient();
        
        if (!tempClient) {
          return false;
        }
        
        const response = await tempClient.graphql({
          query: getUserQuery,
          variables: { 
            input: { email } 
          }
        }) as unknown as GraphQLResponse<UserResponse>;
        
        const timeoutPromise = new Promise<{ timedOut: true }>(resolve => {
          setTimeout(() => {
            resolve({ timedOut: true });
          }, 3000);
        });
        
        const result = await Promise.race([response, timeoutPromise]);
        
        if ('timedOut' in result) {
          return false;
        }
        
        return !!result.data['getUser'];
      } catch (graphqlError) {
        const error = graphqlError as { name?: string };
        if (error.name === 'ApiError' || 
            error.name === 'NetworkError' || 
            error.name === 'UnauthorizedException') {
          return false;
        }
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  
  // Function to create user in the database
  const createUserInDatabase = async (): Promise<void> => {
    let tempClient = null;
    
    try {
      if (!user || !user.username) {
        throw new Error('No authenticated user available');
      }
      
      const email = user.username;
      const homeBase = `${userData.address}, ${userData.city}, ${userData.state} ${userData.zip}`;
      
      try {
        tempClient = generateClient();
        
        if (!tempClient) {
          throw new Error('Failed to initialize GraphQL client');
        }
        
        const response = await tempClient.graphql({
          query: createUserMutation,
          variables: { 
            input: {
              email,
              name: userData.name,
              homeBase,
              language: userData.language,
              subscriptionPlan: userData.subscriptionPlan,
              preferences: '{}'
            }
          }
        }) as unknown as GraphQLResponse<UserResponse>;
        
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('GraphQL operation timed out'));
          }, 5000);
        });
        
        await Promise.race([response, timeoutPromise]);
      } catch (graphqlError) {
        throw graphqlError;
      }
    } catch (error) {
      throw error;
    }
  };
  const updateUserData = (data: Partial<OnboardingData>) => {
    setUserData(prevData => {
      if (!prevData) return data as OnboardingData;
      return {
        ...prevData,
        ...data
      };
    });
  };

  const completeCurrentStep = () => {
    // Define the order of steps
    const stepOrder: OnboardingStep[] = ['profile', 'address', 'subscription', 'review', 'complete'];
    
    // Find the current step's index
    const currentIndex = stepOrder.indexOf(currentStep);
    
    // If we're not at the last step, move to the next one
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  };

  const goToPreviousStep = () => {
    // Define the order of steps
    const stepOrder: OnboardingStep[] = ['profile', 'address', 'subscription', 'review', 'complete'];
    
    // Find the current step's index
    const currentIndex = stepOrder.indexOf(currentStep);
    
    // If we're not at the first step, move to the previous one
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1];
      if (prevStep) {
        setCurrentStep(prevStep);
      }
    }
  };

  const setOnboardingComplete = async () => {
    try {
      // Create user in database first
      await createUserInDatabase();
      
      // Set onboarding as complete
      setIsOnboardingComplete(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingComplete', 'true');
        
        // Clean up temporary data
        localStorage.removeItem('onboardingData');
        localStorage.removeItem('userAttributes');
      }
      
      // Redirect to dashboard after completion if we have a user
      if (user) {
        router.push(`/dashboard/${user.username}`);
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      // Don't proceed with completion if database creation failed
      return;
    }
  };

  // Force a check of user existence regardless of previous checks
  const forceCheckUserExists = async (): Promise<boolean> => {
    // Skip the automatic check since we're doing it manually
    setSkipAutoCheck(true);
    
    try {
      setIsCheckingUserStatus(true);
      const userExists = await checkUserExists();
      
      // Update state based on result
      setIsOnboardingComplete(userExists);
      setHasCheckedUserExists(true);
      
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingComplete', userExists ? 'true' : 'false');
        localStorage.setItem('userExistsChecked', 'true');
      }
      
      return userExists;
    } catch (error) {
      // Default to false if there's an error
      setIsOnboardingComplete(false);
      
      return false;
    } finally {
      setIsCheckingUserStatus(false);
    }
  };

  const resetOnboarding = () => {
    // Reset to initial state
    setCurrentStep('profile');
    setUserData(defaultUserData);
    setIsOnboardingComplete(false);
    
    // Clear all onboarding data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboardingData');
      localStorage.removeItem('onboardingComplete');
      localStorage.removeItem('userExistsChecked');
    }
  };

  // Hard reset function that can be used to completely reset all state
  // This is more aggressive than the normal reset and should only be used
  // for troubleshooting severe issues
  const hardResetOnboarding = () => {
    console.log("PERFORMING HARD RESET OF ALL ONBOARDING STATE");
    
    // Reset all state
    setCurrentStep('profile');
    setUserData(defaultUserData);
    setIsOnboardingComplete(false);
    setHasCheckedUserExists(false);
    setSkipAutoCheck(false);
    
    // Clear all localStorage related to onboarding
    if (typeof window !== 'undefined') {
      try {
        // Clear specific onboarding keys
        localStorage.removeItem('onboardingData');
        localStorage.removeItem('onboardingComplete');
        localStorage.removeItem('userExistsChecked');
        
        // Force a page reload to ensure clean state
        console.log("Hard reset complete - reloading page");
        window.location.reload();
      } catch (error) {
        console.error("Error during hard reset:", error);
      }
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        isOnboardingComplete,
        userData,
        updateUserData,
        completeCurrentStep,
        setOnboardingComplete,
        checkUserExists,
        forceCheckUserExists,
        createUserInDatabase,
        resetOnboarding,
        hardResetOnboarding,
        goToPreviousStep,
        setCurrentStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
} 