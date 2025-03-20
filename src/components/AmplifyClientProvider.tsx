'use client';

import { useEffect } from 'react';
import { configureAmplify } from '@/lib/amplifyConfig';
import Script from 'next/script';

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
  // Initialize Amplify on component mount
  useEffect(() => {
    configureAmplify();
  }, []);

  return (
    <>
      <Script id="env-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: envScript }} />
      {children}
    </>
  );
} 