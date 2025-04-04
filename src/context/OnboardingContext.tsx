"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { generateClient } from 'aws-amplify/api';
import { toast } from '@/components/ui/use-toast';
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';

// Define the subscription tier options
export type SubscriptionTier = 'free' | 'monthly' | 'yearly';
export interface SubscriptionPlan {
  id: string;
  type: SubscriptionTier;
}

// Define the subscription plan structure for the server
export interface ServerSubscriptionPlan {
  current: {
    planId: string;
    tier: SubscriptionTier;
    startDate: string;
    endDate: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED';
  };
  history: any[];
}

// Define the user preferences structure
export interface UserPreferences {
  fleetManagementEnabled: boolean;
  notifications: {
    email: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark';
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
  subscriptionPlans: ServerSubscriptionPlan;
  onboarded: boolean;
  isEnterprise: boolean;
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
  currentStep: OnboardingStep;
  isOnboardingComplete: boolean;
  userData: OnboardingData;
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
      authUserId
      preferences
      subscriptionPlans
      onboarded
      isEnterprise
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
      authUserId
      preferences
      subscriptionPlans
      onboarded
      isEnterprise
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

  useEffect(() => {
    if (!isAuthenticated || !user || isCheckingUserStatus || hasCheckedUserExists || skipAutoCheck) return;
    if (!user.username) return;
    
    setIsCheckingUserStatus(true);
    
    async function checkOnboardingStatus() {
      try {
        if (typeof window !== 'undefined') {
          const storedResult = localStorage.getItem('userExistsChecked');
          if (storedResult === 'true') {
            const storedComplete = localStorage.getItem('onboardingComplete') === 'true';
            setIsOnboardingComplete(storedComplete);
            setHasCheckedUserExists(true);
            setIsCheckingUserStatus(false);
            return;
          }
        }
        
        const userExists = await checkUserExists();
        
        if (userExists) {
          setIsOnboardingComplete(true);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('onboardingComplete', 'true');
            localStorage.setItem('userExistsChecked', 'true');
          }
        } else {
          setIsOnboardingComplete(false);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('onboardingComplete', 'false');
            localStorage.setItem('userExistsChecked', 'true');
          }
        }
        setHasCheckedUserExists(true);
      } catch (error) {
        setIsOnboardingComplete(false);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('userExistsChecked', 'false');
        }
      } finally {
        setIsCheckingUserStatus(false);
      }
    }
    
    const timer = setTimeout(() => {
      checkOnboardingStatus();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, hasCheckedUserExists, skipAutoCheck]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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

      const storedOnboardingData = localStorage.getItem('onboardingData');
      
      if (storedOnboardingData) {
        try {
          const parsedData = JSON.parse(storedOnboardingData);

          if (storedOnboardingComplete !== 'true') {
            setUserData(parsedData.userData || defaultUserData);
            
            const savedStep = parsedData.currentStep;
            if (savedStep) {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboardingData', JSON.stringify({
        currentStep,
        userData,
        isOnboardingComplete
      }));
    }
  }, [currentStep, userData, isOnboardingComplete]);

  const checkUserExists = async (): Promise<boolean> => {
    let tempClient = null;
    
    try {
      if (!user || !user.username) {
        return false;
      }
      
      console.log('Full Cognito Auth User:', JSON.stringify(user, null, 2));
      
      const email = user.signInDetails?.loginId || user.username;
      
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

  const createUserInDatabase = async (): Promise<void> => {
    let tempClient = null;
    
    try {
      if (!user || !user.username) {
        throw new Error('No authenticated user available');
      }

      // First, ensure we have a valid session
      const session = await fetchAuthSession();
      console.log('Current session:', session);

      if (!session.tokens?.idToken) {
        // If no valid token, try to refresh the session
        try {
          await signOut({ global: true });
          await signIn({ username: user.username });
          // Get fresh session
          const newSession = await fetchAuthSession();
          if (!newSession.tokens?.idToken) {
            throw new Error('Failed to refresh authentication session');
          }
        } catch (error) {
          console.error('Authentication refresh failed:', error);
          throw new Error('Please sign in again to continue.');
        }
      }

      // Get a fresh session after potential refresh
      const currentSession = await fetchAuthSession();
      const idToken = currentSession.tokens?.idToken?.toString();
      
      if (!idToken) {
        throw new Error('No valid authentication token found');
      }

      const email = user.signInDetails?.loginId || user.username;
      const homeBase = `${userData.address}, ${userData.city}, ${userData.state} ${userData.zip}`;
      const authUserId = user.userId;

      if (!authUserId || !email) {
        throw new Error('Missing required user information');
      }

      // Create the subscription plans object with proper AWSJSON format
      const subscriptionPlansData = {
        current: {
          planId: userData.subscriptionPlan.id,
          tier: userData.subscriptionPlan.type.toUpperCase(),
          startDate: new Date().toISOString(),
          endDate: null,
          status: 'ACTIVE'
        },
        history: []
      };

      // Create the preferences object with proper AWSJSON format
      const preferencesData = {
        notifications: {
          email: true,
          push: true
        },
        theme: 'light',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      // Create the input data with all required fields
      const inputData = {
        email: email,
        name: userData.name,
        homeBase,
        language: userData.language,
        authUserId: authUserId,
        preferences: JSON.stringify(preferencesData),
        onboarded: true,
        terms: userData.terms || false,
        privacy_policy: userData.privacy_policy || false,
        subscriptionPlans: JSON.stringify(subscriptionPlansData),
        isEnterprise: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Creating user with data:', inputData);

      // Initialize the API client with the current session
      tempClient = generateClient({
        authMode: 'userPool',
        authToken: idToken
      });

      if (!tempClient) {
        throw new Error('Failed to initialize GraphQL client');
      }

      // Make the API call
      const response = await tempClient.graphql({
        query: createUserMutation,
        variables: { input: inputData },
        authMode: 'userPool',
        authToken: idToken
      }) as unknown as GraphQLResponse<UserResponse>;

      console.log('GraphQL response:', response);

      if (response.errors?.length) {
        console.error('GraphQL errors:', response.errors);
        const error = response.errors[0];
        if (error?.message?.includes('Not Authorized')) {
          throw new Error('Authorization error. Please sign out and sign in again.');
        }
        if (error?.message?.includes('already exists')) {
          throw new Error('User already exists in the database.');
        }
        throw new Error(error?.message || 'Unknown error occurred');
      }

      // Verify the user was created successfully
      const createdUser = response.data?.['createUser'];
      if (!createdUser) {
        throw new Error('Failed to create user in database');
      }

      // Verify all required fields are present in the response
      const requiredFields: (keyof UserResponse)[] = ['id', 'email', 'name'];
      const missingFields = requiredFields.filter(field => !createdUser[field]);
      if (missingFields.length > 0) {
        throw new Error(`User creation incomplete. Missing fields: ${missingFields.join(', ')}`);
      }

    } catch (error) {
      console.error('Error in createUserInDatabase:', error);
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
    const stepOrder: OnboardingStep[] = ['profile', 'address', 'subscription', 'review', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    }
  };

  const goToPreviousStep = () => {
    const stepOrder: OnboardingStep[] = ['profile', 'address', 'subscription', 'review', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1];
      if (prevStep) {
        setCurrentStep(prevStep);
      }
    }
  };

  const setOnboardingComplete = async () => {
    try {
      // Check if user is authenticated
      const session = await fetchAuthSession();
      if (!session.tokens?.idToken) {
        throw new Error('You must be signed in to complete onboarding');
      }

      // Create user in database
      await createUserInDatabase();
      
      // Verify user creation with retries
      let userExists = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!userExists && retryCount < maxRetries) {
        try {
          userExists = await checkUserExists();
          if (userExists) break;
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          retryCount++;
        } catch (error) {
          console.error(`Error checking user existence (attempt ${retryCount + 1}):`, error);
          retryCount++;
        }
      }
      
      if (!userExists) {
        throw new Error('Failed to verify user creation. Please try again.');
      }

      // Update state and storage
      setIsOnboardingComplete(true);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.removeItem('onboardingData');
        localStorage.removeItem('userAttributes');
      }
      
      // Navigate to dashboard
      if (user?.username) {
        try {
          await router.push(`/dashboard/${user.username}`);
        } catch (routerError) {
          console.error('Router navigation error:', routerError);
          // Fallback to direct navigation
          window.location.href = `/dashboard/${user.username}`;
        }
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "There was a problem creating your account. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      
      // Reset state
      setIsOnboardingComplete(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingComplete', 'false');
      }
      
      // Don't throw the error to prevent unhandled promise rejection
      // Instead, return a success flag
      return false;
    }
    
    return true;
  };

  const forceCheckUserExists = async (): Promise<boolean> => {
    setSkipAutoCheck(true);
    
    try {
      setIsCheckingUserStatus(true);
      const userExists = await checkUserExists();
      
      setIsOnboardingComplete(userExists);
      setHasCheckedUserExists(true);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardingComplete', userExists ? 'true' : 'false');
        localStorage.setItem('userExistsChecked', 'true');
      }
      
      return userExists;
    } catch (error) {
      setIsOnboardingComplete(false);
      return false;
    } finally {
      setIsCheckingUserStatus(false);
    }
  };

  const resetOnboarding = () => {
    setCurrentStep('profile');
    setUserData(defaultUserData);
    setIsOnboardingComplete(false);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboardingData');
      localStorage.removeItem('onboardingComplete');
      localStorage.removeItem('userExistsChecked');
    }
  };

  const hardResetOnboarding = () => {
    console.log("PERFORMING HARD RESET OF ALL ONBOARDING STATE");
    
    setCurrentStep('profile');
    setUserData(defaultUserData);
    setIsOnboardingComplete(false);
    setHasCheckedUserExists(false);
    setSkipAutoCheck(false);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('onboardingData');
        localStorage.removeItem('onboardingComplete');
        localStorage.removeItem('userExistsChecked');
        
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