"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { generateClient } from 'aws-amplify/api';

// Define the subscription tier options
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

// Define the onboarding steps
export type OnboardingStep = 'profile' | 'address' | 'subscription' | 'complete';

interface OnboardingContextType {
  // Current status
  currentStep: OnboardingStep;
  isOnboardingComplete: boolean;
  
  // User data collected during onboarding
  userData: {
    name: string;
    language: 'en' | 'es';
    address: string;
    city: string;
    state: string;
    zip: string;
    subscriptionTier: SubscriptionTier;
  };
  
  // Methods to update onboarding
  updateUserData: (data: Partial<OnboardingContextType['userData']>) => void;
  completeCurrentStep: () => void;
  setOnboardingComplete: () => void;
  checkUserExists: () => Promise<boolean>;
  forceCheckUserExists: () => Promise<boolean>;
  createUserInDatabase: () => Promise<void>;
  resetOnboarding: () => void;
  hardResetOnboarding: () => void;
}

const defaultUserData = {
  name: '',
  language: 'en' as 'en' | 'es',
  address: '',
  city: '',
  state: '',
  zip: '',
  subscriptionTier: 'free' as SubscriptionTier,
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
        console.log("User not authenticated, using default onboarding state");
        setCurrentStep('profile');
        return;
      }

      const storedOnboardingComplete = localStorage.getItem('onboardingComplete');
      console.log("Loaded onboardingComplete from localStorage:", storedOnboardingComplete);
      
      if (storedOnboardingComplete === 'true') {
        setIsOnboardingComplete(true);
      } else {
        // If onboarding is not complete, ensure we start from profile step
        console.log("Onboarding not complete, ensuring we start from profile step");
        setCurrentStep('profile');
      }

      // Try to load saved onboarding progress
      const storedOnboardingData = localStorage.getItem('onboardingData');
      console.log("Found stored onboarding data:", storedOnboardingData ? "yes" : "no");
      
      if (storedOnboardingData) {
        try {
          const parsedData = JSON.parse(storedOnboardingData);
          
          // Log the loaded onboarding data for debugging
          console.log("Loading onboarding data from localStorage:", parsedData);

          // Only proceed with stored data if onboarding is not complete
          if (storedOnboardingComplete !== 'true') {
            // Set user data
            setUserData(parsedData.userData || defaultUserData);
            
            // Set the current step with validation
            const savedStep = parsedData.currentStep;
            if (savedStep) {
              // Validate that the step is one of our valid steps
              if (['profile', 'address', 'subscription', 'complete'].includes(savedStep)) {
                console.log("Setting current step to:", savedStep);
                setCurrentStep(savedStep);
              } else {
                // Invalid step - reset to profile
                console.log("Invalid step found in localStorage:", savedStep, "- resetting to 'profile'");
                setCurrentStep('profile');
              }
            } else {
              // No step found - use profile as default
              console.log("No step found in localStorage - using default 'profile'");
              setCurrentStep('profile');
            }
          } else {
            console.log("Onboarding complete, ignoring saved step data");
          }
        } catch (error) {
          console.error('Error parsing stored onboarding data:', error);
          // On error, ensure we reset to the first step
          setCurrentStep('profile');
        }
      } else {
        // No data in localStorage, ensure we're on the first step
        console.log("No onboarding data in localStorage - resetting to first step");
        setCurrentStep('profile');
      }
    }
  }, [isAuthenticated, user]);

  // Save onboarding state to localStorage whenever it changes
  useEffect(() => {
    // Skip saving if in server-side rendering
    if (typeof window === 'undefined') return;
    
    // Save current onboarding state
    try {
      localStorage.setItem('onboardingData', JSON.stringify({
        currentStep,
        userData,
      }));
      console.log("Saved onboarding data to localStorage:", { currentStep, userData });
    } catch (error) {
      console.error("Error saving onboarding data to localStorage:", error);
    }
  }, [currentStep, userData]);

  // Function to check if user exists in the database
  const checkUserExists = async (): Promise<boolean> => {
    let tempClient = null;
    
    try {
      // First check - if no user, return false immediately 
      if (!user || !user.username) {
        return false;
      }
      
      // Extract email from user object
      const email = user.username;
      
      // Add extra protection against API errors
      try {
        // Try to generate client outside of the main GraphQL operation
        // This isolates client generation errors
        tempClient = generateClient();
        
        // Additional safety check before proceeding with GraphQL operation
        if (!tempClient) {
          console.warn('GraphQL client could not be generated');
          return false;
        }
        
        // Try to make the GraphQL query with timeout protection
        const queryPromise = tempClient.graphql({
          query: getUserQuery,
          variables: { 
            input: { email } 
          }
        });
        
        // Set a timeout to prevent hanging on API calls
        const timeoutPromise = new Promise<any>(resolve => {
          setTimeout(() => {
            resolve({ timedOut: true });
          }, 3000); // 3 second timeout
        });
        
        // Race between actual query and timeout
        const response = await Promise.race([queryPromise, timeoutPromise]);
        
        // If we got a timeout result, return false
        if (response && 'timedOut' in response) {
          console.warn('GraphQL query timed out');
          return false;
        }
        
        // Extra safety checks for response structure
        if (response && 
            typeof response === 'object' && 
            'data' in response && 
            response.data && 
            typeof response.data === 'object') {
          // Safely check if user exists in the response
          if (response.data && 
              'getUser' in response.data) {
            return !!response.data.getUser;
          }
          
          return false;
        }
        
        return false;
      } catch (graphqlError) {
        console.error('GraphQL operation failed:', graphqlError);
        
        // Instead of throwing, just return false to continue the flow
        return false;
      }
    } catch (error) {
      // Catch-all for any unexpected errors
      console.error('Unexpected error in checkUserExists:', error);
      return false;
    }
  };
  
  // Function to create user in the database
  const createUserInDatabase = async (): Promise<void> => {
    let tempClient = null;
    
    try {
      // Validate user exists
      if (!user || !user.username) {
        throw new Error('No authenticated user available');
      }
      
      const email = user.username;
      
      // Prepare user data for creation
      const homeBase = `${userData.address}, ${userData.city}, ${userData.state} ${userData.zip}`;
      
      try {
        // Generate client with error handling
        tempClient = generateClient();
        
        if (!tempClient) {
          throw new Error('Failed to initialize GraphQL client');
        }
        
        // Set up a timeout to prevent hanging operations
        const mutationPromise = tempClient.graphql({
          query: createUserMutation,
          variables: { 
            input: {
              email,
              name: userData.name,
              homeBase,
              language: userData.language,
              subscriptionTier: userData.subscriptionTier,
              preferences: '{}'  // Default empty preferences
            }
          }
        });
        
        // Create a timeout promise
        const timeoutPromise = new Promise<any>((_, reject) => {
          setTimeout(() => {
            reject(new Error('GraphQL operation timed out'));
          }, 5000); // 5 second timeout
        });
        
        // Race between the actual operation and timeout
        await Promise.race([mutationPromise, timeoutPromise]);
        
      } catch (graphqlError) {
        console.error('GraphQL error creating user:', graphqlError);
        // Re-throw for the caller to handle
        throw graphqlError;
      }
    } catch (error) {
      console.error('Error creating user in database:', error);
      throw error;
    }
  };

  const updateUserData = (data: Partial<OnboardingContextType['userData']>) => {
    setUserData(prevData => ({ ...prevData, ...data }));
  };

  const completeCurrentStep = () => {
    // Move to the next step based on the current step
    switch (currentStep) {
      case 'profile':
        setCurrentStep('address');
        break;
      case 'address':
        setCurrentStep('subscription');
        break;
      case 'subscription':
        setCurrentStep('complete');
        setOnboardingComplete();
        break;
      case 'complete':
        // Already complete
        break;
    }
  };

  const setOnboardingComplete = async () => {
    try {
      // Set onboarding as complete
      setIsOnboardingComplete(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingComplete', 'true');
      }
      
      // Redirect to dashboard after completion if we have a user
      if (user) {
        router.push(`/dashboard/${user.username}`);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still set onboarding complete locally even if API fails
      setIsOnboardingComplete(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingComplete', 'true');
      }
      
      // Redirect to dashboard
      if (user) {
        router.push(`/dashboard/${user.username}`);
      }
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
      console.error('Error in forced user existence check:', error);
      
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
      console.log("Onboarding progress has been completely reset");
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