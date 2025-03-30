"use client";

import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { configureAmplify } from '@/lib/amplifyConfig';
import Script from 'next/script';
import { preloadAllTranslations } from '@/lib/translationLoader';

// Create a script to expose environment variables to client components
const envScript = `
  window.__ENV = {
    NEXT_PUBLIC_USER_POOL_ID: "${process.env['NEXT_PUBLIC_USER_POOL_ID']}",
    NEXT_PUBLIC_USER_POOL_CLIENT_ID: "${process.env['NEXT_PUBLIC_USER_POOL_CLIENT_ID']}",
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: "${process.env['NEXT_PUBLIC_GRAPHQL_ENDPOINT']}",
    NEXT_PUBLIC_IDENTITY_POOL_ID: "${process.env['NEXT_PUBLIC_IDENTITY_POOL_ID']}",
    NEXT_PUBLIC_API_REGION: "us-east-1"
  };
  console.log("Environment variables exposed to client:", window.__ENV);
`;

export function AmplifyClientProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAmplify = async () => {
      try {
        // Configure Amplify with specific PathXpressAI API settings
        await configureAmplify();
        
        // Verify configuration
        if (!Amplify.getConfig().Auth?.Cognito?.userPoolId) {
          throw new Error('Amplify Auth configuration is missing');
        }
        
        setIsInitialized(true);
        console.log('✅ PathXpressAI API connection configured successfully');
      } catch (error) {
        console.error('❌ Failed to configure PathXpressAI API connection:', error);
      }
    };

    initAmplify();
  }, []);

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Script id="env-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: envScript }} />
      {children}
    </>
  );
} 