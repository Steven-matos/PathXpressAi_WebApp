"use client";

import { useEffect, useState } from "react";
import { testAmplifyConnection, checkAmplifyConfig } from "@/lib/amplifyHelpers";

export default function AmplifyStatus() {
  const [status, setStatus] = useState<{
    userPoolId?: string;
    userPoolClientId?: string;
    graphqlEndpoint?: string;
    envSource?: string;
  }>({});

  useEffect(() => {
    // Get environment variables from window.__ENV or process.env
    const windowEnv = (window as any).__ENV || {};
    
    setStatus({
      userPoolId: windowEnv.NEXT_PUBLIC_USER_POOL_ID || process.env.NEXT_PUBLIC_USER_POOL_ID || 'Not found',
      userPoolClientId: windowEnv.NEXT_PUBLIC_USER_POOL_CLIENT_ID || process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || 'Not found',
      graphqlEndpoint: windowEnv.NEXT_PUBLIC_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'Not found',
      envSource: (window as any).__ENV ? 'window.__ENV' : 'process.env',
    });
    
    // Check configuration
    const config = checkAmplifyConfig();
    if (config.isConfigured) {
      testConnection();
    }
  }, []);

  async function testConnection() {
    try {
      const result = await testAmplifyConnection();
      console.log('Connection test result:', result);
    } catch (error) {
      console.error('Failed to test connection:', error);
    }
  }

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-2 right-2 bg-black/80 text-white p-2 text-xs rounded-md max-w-xs z-50 opacity-80 hover:opacity-100">
      <h3 className="font-bold mb-1">Amplify Config (Debug)</h3>
      <div>Source: {status.envSource}</div>
      <div className="truncate">
        <span className="font-bold">User Pool ID:</span> {maskString(status.userPoolId)}
      </div>
      <div className="truncate">
        <span className="font-bold">Client ID:</span> {maskString(status.userPoolClientId)}
      </div>
    </div>
  );
}

// Utility to mask sensitive values for display
function maskString(str?: string): string {
  if (!str || str === 'Not found') return str;
  const length = str.length;
  if (length <= 8) return '********';
  return str.substring(0, 4) + '****' + str.substring(length - 4);
} 