"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAuthSession, getCurrentUser, type AuthUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { auth } from '@/lib/authService';
import { SignInParams, SignUpParams, ConfirmSignUpParams } from '@/lib/authService';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  // Function to handle successful authentication
  const handleAuthSuccess = (currentUser: AuthUser) => {
    setUser(currentUser);
    setIsAuthenticated(true);
    setLastAuthCheck(Date.now());
    
    // Store user info in localStorage for persistence
    try {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('lastAuthTime', Date.now().toString());
      localStorage.setItem('userEmail', currentUser.username);
      
      // Update the URL to include user ID if we're in the browser
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath === '/dashboard') {
          // Only change the URL if we're on the dashboard
          window.history.replaceState(
            {}, 
            '', 
            `/dashboard/${currentUser.username}`
          );
        }
      }
    } catch (error) {
      console.error('Error storing auth data:', error);
      // Ignore localStorage errors (might be in incognito mode)
    }
  };

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
          // Clear stored auth data
          try {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('lastAuthTime');
            localStorage.removeItem('userEmail');
          } catch (error) {
            // Ignore localStorage errors
          }
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
      // First check localStorage for quick UI response
      const isStoredAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const lastAuthTime = parseInt(localStorage.getItem('lastAuthTime') || '0', 10);
      const isRecentAuth = Date.now() - lastAuthTime < 24 * 60 * 60 * 1000; // 24 hours
      
      if (isStoredAuthenticated && isRecentAuth) {
        // Temporarily set authenticated for better UX while we verify with Amplify
        setIsAuthenticated(true);
      }
      
      // Check if there's an authenticated user
      const currentUser = await getCurrentUser();
      
      // User is authenticated, update state
      handleAuthSuccess(currentUser);
      
      // Fetch the session to make sure it's valid
      await fetchAuthSession();
      
      // Update URL if we're on dashboard (this ensures URL is updated after page refresh)
      if (typeof window !== 'undefined' && window.location.pathname === '/dashboard') {
        window.history.replaceState(
          {}, 
          '', 
          `/dashboard/${currentUser.username}`
        );
      }
    } catch (err) {
      console.log('Auth check error:', err);
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear stored auth data
      try {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('lastAuthTime');
        localStorage.removeItem('userEmail');
      } catch (storageError) {
        // Ignore localStorage errors
      }
      
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