"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAuthSession, getCurrentUser, type AuthUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { auth } from '@/lib/authService';
import { SignInParams, SignUpParams, ConfirmSignUpParams } from '@/lib/authService';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (params: SignInParams) => Promise<any>;
  signUp: (params: SignUpParams) => Promise<any>;
  confirmSignUp: (params: ConfirmSignUpParams) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastAuthCheck, setLastAuthCheck] = useState(Date.now());

  useEffect(() => {
    // Check for existing authenticated user
    checkAuthState();

    // Set up listener for auth events
    const hubListener = Hub.listen('auth', async ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          await checkAuthState();
          break;
        case 'signedOut':
          setUser(null);
          setIsAuthenticated(false);
          break;
        case 'tokenRefresh':
          // Token has been refreshed, re-check auth state
          await checkAuthState();
          break;
        case 'tokenRefresh_failure':
          // Token refresh failed, user might need to sign in again
          console.warn('Auth token refresh failed, attempting to recover session...');
          // Wait a moment and try to recover
          setTimeout(async () => {
            try {
              await fetchAuthSession();
              await checkAuthState();
            } catch (error) {
              console.error('Session recovery failed, signing out:', error);
              await auth.signOut();
              setUser(null);
              setIsAuthenticated(false);
            }
          }, 1000);
          break;
        default:
          break;
      }
    });

    // Set up a periodic check to ensure auth state is fresh
    const intervalId = setInterval(() => {
      // Only re-check if it's been more than 5 minutes since last check
      if (Date.now() - lastAuthCheck > 5 * 60 * 1000) {
        checkAuthState();
        setLastAuthCheck(Date.now());
      }
    }, 60 * 1000); // Check every minute if time threshold is met

    return () => {
      hubListener();
      clearInterval(intervalId);
    };
  }, [lastAuthCheck]);

  async function checkAuthState() {
    setIsLoading(true);
    try {
      // Check if there's an authenticated user
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
      
      // Fetch the session to make sure it's valid
      await fetchAuthSession();
      setLastAuthCheck(Date.now());
    } catch (err) {
      console.log('Auth check error:', err);
      setUser(null);
      setIsAuthenticated(false);
      
      // If this is an error related to an existing session, try to sign out cleanly
      const error = err as any; // Type assertion for error properties
      if (error.name === 'TokenRefreshError' || 
          (typeof error.message === 'string' && error.message.includes('sign-in session has expired'))) {
        try {
          console.log('Clearing expired session...');
          await auth.signOut();
        } catch (signOutError) {
          console.error('Error during cleanup signout:', signOutError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    signIn: auth.signIn,
    signUp: auth.signUp,
    confirmSignUp: auth.confirmSignUp,
    signOut: async () => {
      await auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    },
    resetPassword: (email: string) => auth.resetPassword({ email }),
    confirmResetPassword: (email: string, confirmationCode: string, newPassword: string) => 
      auth.confirmResetPassword({ email, confirmationCode, newPassword }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 