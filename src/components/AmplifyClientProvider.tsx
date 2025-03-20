'use client';

import { useEffect } from 'react';
import { configureAmplify } from '@/lib/amplifyConfig';
import Script from 'next/script';
import { preloadAllTranslations } from '@/lib/translationLoader';

// Create a script to expose environment variables to client components
const envScript = `
  window.__ENV = {
    NEXT_PUBLIC_USER_POOL_ID: "${process.env['NEXT_PUBLIC_USER_POOL_ID']}",
    NEXT_PUBLIC_USER_POOL_CLIENT_ID: "${process.env['NEXT_PUBLIC_USER_POOL_CLIENT_ID']}",
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: "${process.env['NEXT_PUBLIC_GRAPHQL_ENDPOINT']}",
    NEXT_PUBLIC_IDENTITY_POOL_ID: "${process.env['NEXT_PUBLIC_IDENTITY_POOL_ID']}"
  };
  console.log("Environment variables exposed to client:", window.__ENV);
`;

export default function AmplifyClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Amplify and preload translations on component mount
  useEffect(() => {
    // Configure Amplify
    configureAmplify();
    
    // Preload translations for faster access
    preloadAllTranslations().then(() => {
      console.log('✅ Translations preloaded successfully');
    }).catch(err => {
      console.warn('⚠️ Error preloading translations:', err);
    });
  }, []);

  return (
    <>
      <Script id="env-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: envScript }} />
      {children}
    </>
  );
} 