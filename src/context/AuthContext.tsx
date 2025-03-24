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

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted
    let isCheckingAuth = false; // Flag to prevent concurrent auth checks
    
    // Function to safely check auth state
    const safeCheckAuthState = async () => {
      if (!isMounted || isCheckingAuth) return;
      
      // Set flag to prevent concurrent checks
      isCheckingAuth = true;
      setIsLoading(true);
      
      try {
        // Check localStorage for quick UI response
        if (typeof window !== 'undefined') {
          const isStoredAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
          const lastAuthTime = parseInt(localStorage.getItem('lastAuthTime') || '0', 10);
          const isRecentAuth = Date.now() - lastAuthTime < 24 * 60 * 60 * 1000; // 24 hours
          
          if (isStoredAuthenticated && isRecentAuth && isMounted) {
            // Temporarily set authenticated for better UX while we verify
            setIsAuthenticated(true);
          }
        }
        
        // Use try/catch specifically for the getCurrentUser call
        try {
          // Check if there's an authenticated user
          const currentUser = await getCurrentUser();
          
          if (isMounted) {
            // Update state only if still mounted
            setUser(currentUser);
            setIsAuthenticated(true);
            setLastAuthCheck(Date.now());
            
            // Store user info in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('lastAuthTime', Date.now().toString());
              localStorage.setItem('userEmail', currentUser.username);
              
              // Update URL if needed
              const currentPath = window.location.pathname;
              if (currentPath === '/dashboard') {
                window.history.replaceState({}, '', `/dashboard/${currentUser.username}`);
              }
            }
            
            // Only fetch session if we successfully got the current user
            try {
              // Fetch session to validate
              await fetchAuthSession();
            } catch (sessionError) {
              console.log('Session validation error (non-critical):', sessionError);
              // Don't throw here - continue with the current user
            }
          }
        } catch (userError: any) {
          console.log('Get current user error:', userError);
          
          // Handle rate limiting specifically
          if (userError.name === 'TooManyRequestsException') {
            console.warn('Rate limit exceeded for auth requests - backing off');
            // If we hit rate limits, don't clear user state if we already have it
            // Just update the last check time and exit
            if (user && isAuthenticated) {
              setLastAuthCheck(Date.now());
              return;
            }
          }
          
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            
            // Clear stored auth data
            if (typeof window !== 'undefined') {
              try {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('lastAuthTime');
                localStorage.removeItem('userEmail');
              } catch (storageError) {
                // Ignore localStorage errors
              }
            }
          }
        }
      } catch (err) {
        console.log('Auth check error:', err);
        
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          
          // Clear stored auth data
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('lastAuthTime');
              localStorage.removeItem('userEmail');
            } catch (storageError) {
              // Ignore localStorage errors
            }
          }
          
          // Handle expired session
          const error = err as any;
          if (error.name === 'TokenRefreshError' || 
              (typeof error.message === 'string' && error.message.includes('sign-in session has expired'))) {
            try {
              console.log('Clearing expired session...');
              await auth.signOut();
            } catch (signOutError) {
              console.error('Error during cleanup signout:', signOutError);
            }
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
        isCheckingAuth = false;
      }
    };
    
    // Initial auth check with a small delay to prevent immediate rate limiting
    const initialCheckTimeout = setTimeout(() => {
      safeCheckAuthState();
    }, 100);
    
    // Use a debounced version of the auth check for Hub events
    let hubCheckTimeout: NodeJS.Timeout | null = null;
    const debouncedAuthCheck = () => {
      if (hubCheckTimeout) {
        clearTimeout(hubCheckTimeout);
      }
      hubCheckTimeout = setTimeout(() => {
        safeCheckAuthState();
      }, 300);
    };
    
    // Set up listener for auth events
    const hubListener = Hub.listen('auth', async ({ payload }) => {
      if (!isMounted) return;
      
      switch (payload.event) {
        case 'signedIn':
          debouncedAuthCheck();
          break;
        case 'signedOut':
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            // Clear stored auth data
            if (typeof window !== 'undefined') {
              try {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('lastAuthTime');
                localStorage.removeItem('userEmail');
              } catch (error) {
                // Ignore localStorage errors
              }
            }
          }
          break;
        case 'tokenRefresh':
          debouncedAuthCheck();
          break;
        case 'tokenRefresh_failure':
          console.warn('Auth token refresh failed, attempting to recover session...');
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              await fetchAuthSession();
              debouncedAuthCheck();
            } catch (error) {
              console.error('Session recovery failed, signing out:', error);
              await auth.signOut();
              if (isMounted) {
                setUser(null);
                setIsAuthenticated(false);
              }
            }
          }, 1000);
          break;
      }
    });
    
    // Set up periodic check - with much longer interval
    const intervalId = setInterval(() => {
      // Only check if component is mounted and enough time has passed (30 minutes)
      if (isMounted && Date.now() - lastAuthCheck > 30 * 60 * 1000) {
        safeCheckAuthState();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes if time threshold is met
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (hubCheckTimeout) {
        clearTimeout(hubCheckTimeout);
      }
      clearTimeout(initialCheckTimeout);
      hubListener();
      clearInterval(intervalId);
    };
  }, [lastAuthCheck, user, isAuthenticated]);

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