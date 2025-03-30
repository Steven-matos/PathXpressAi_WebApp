"use client";

import { Provider } from 'react-redux';
import store from '@/store/clientStore';
import { TranslationProvider } from '@/context/TranslationContext';
import { AuthProvider } from '@/context/AuthContext';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { AmplifyClientProvider } from '@/features/auth';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AmplifyClientProvider>
        <AuthProvider>
          <OnboardingProvider>
            <TranslationProvider>
              {children}
            </TranslationProvider>
          </OnboardingProvider>
        </AuthProvider>
      </AmplifyClientProvider>
    </Provider>
  );
} 