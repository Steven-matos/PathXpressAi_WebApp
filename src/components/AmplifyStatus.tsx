"use client";

import { useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useToast } from '@/components/ui/use-toast';

interface AmplifyConfig {
  Auth?: {
    Cognito?: {
      userPoolId: string;
      userPoolClientId: string;
    };
  };
  API?: {
    GraphQL?: {
      endpoint: string;
      region: string;
    };
  };
}

interface StatusState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  config: AmplifyConfig | null;
}

export function AmplifyStatus() {
  const { toast } = useToast();
  const [status, setStatus] = useState<StatusState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    config: null
  });

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      // Check authentication status
      const user = await getCurrentUser();
      
      // Get auth session to check token validity
      const session = await fetchAuthSession();
      
      // Get Amplify configuration
      const config = (window as any).__AMPLIFY_CONFIG as AmplifyConfig;
      
      setStatus({
        isAuthenticated: !!user && !!session.tokens,
        isLoading: false,
        error: null,
        config
      });
    } catch (error) {
      console.error('Error checking Amplify status:', error);
      setStatus({
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to check Amplify status',
        config: null
      });
    }
  };

  if (status.isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Checking Amplify status...</p>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-600">{status.error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Amplify Status</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Authentication Status</h4>
          <p className={`mt-1 text-sm ${status.isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
            {status.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </p>
        </div>

        {status.config && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Configuration</h4>
            <div className="mt-1 text-sm text-gray-600">
              <p>User Pool ID: {status.config.Auth?.Cognito?.userPoolId || 'Not configured'}</p>
              <p>Client ID: {status.config.Auth?.Cognito?.userPoolClientId || 'Not configured'}</p>
              <p>GraphQL Endpoint: {status.config.API?.GraphQL?.endpoint || 'Not configured'}</p>
              <p>Region: {status.config.API?.GraphQL?.region || 'Not configured'}</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={checkStatus}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Refresh Status
      </button>
    </div>
  );
} 