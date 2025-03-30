import { Amplify } from 'aws-amplify';
import { ResourcesConfig } from '@aws-amplify/core';
import awsconfig from '../aws-exports';

interface AmplifyConfig {
  Auth: {
    Cognito: {
      userPoolId: string;
      userPoolClientId: string;
      signUpVerificationMethod: string;
    };
  };
  API: {
    GraphQL: {
      endpoint: string;
      region: string;
      authenticationType: string;
    };
  };
}

const defaultConfig: AmplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
      signUpVerificationMethod: 'code',
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '',
      region: process.env.NEXT_PUBLIC_REGION || 'us-east-1',
      authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    },
  },
};

// Initialize Amplify configuration
export function configureAmplify(overrideConfig?: Partial<AmplifyConfig>) {
  console.log('🔄 Configuring Amplify...');
  
  // In a client component, access environment variables via window
  const userPoolId = getUserPoolId();
  const userPoolClientId = getUserPoolClientId();
  const graphqlEndpoint = getGraphQLEndpoint();

  console.log('🔐 User Pool ID:', userPoolId || 'Not found');
  console.log('🔑 User Pool Client ID:', userPoolClientId || 'Not found');
  console.log('🌐 GraphQL Endpoint:', graphqlEndpoint || 'Not found');

  // Hard-coded fallback values as a last resort (for development only)
  const finalUserPoolId = userPoolId || awsconfig.aws_user_pools_id || 'us-east-1_ZNwA1XBAt';
  const finalUserPoolClientId = userPoolClientId || awsconfig.aws_user_pools_web_client_id || '1mlmpcdgqovg1i55vvfki35b1v';
  const finalGraphqlEndpoint = graphqlEndpoint || awsconfig.aws_appsync_graphqlEndpoint || 'https://fqhs2y3vlvfndk46swuyvklnrm.appsync-api.us-east-1.amazonaws.com/graphql';
  const region = awsconfig.aws_appsync_region || 'us-east-1';

  // Configuration with our best attempt at getting the values
  const config: AmplifyConfig = {
    ...defaultConfig,
    ...overrideConfig
  };

  console.log('⚙️ Final Amplify config:', {
    userPoolId: config.Auth.Cognito.userPoolId || defaultConfig.Auth.Cognito.userPoolId || '',
    userPoolClientId: config.Auth.Cognito.userPoolClientId || defaultConfig.Auth.Cognito.userPoolClientId || '',
    endpoint: config.API.GraphQL.endpoint || defaultConfig.API.GraphQL.endpoint || '',
    region: config.API.GraphQL.region || defaultConfig.API.GraphQL.region || ''
  });

  // Validate required configuration
  if (!config.Auth.Cognito.userPoolId) {
    throw new Error('User Pool ID is required');
  }
  if (!config.Auth.Cognito.userPoolClientId) {
    throw new Error('User Pool Client ID is required');
  }
  if (!config.API.GraphQL.endpoint) {
    throw new Error('GraphQL endpoint is required');
  }

  // Configure Amplify with our configuration
  try {
    Amplify.configure(config);
    console.log('✅ Amplify configured successfully');

    // Generate GraphQL client to ensure it's ready for post-confirmation Lambda
    setupGraphQLClient();

    // Quick test to see if basic setup is working
    testAmplifySetup();
  } catch (error) {
    console.error('❌ Error configuring Amplify:', error);
  }
}

// Setup GraphQL client to ensure it's available for Lambda functions
async function setupGraphQLClient() {
  if (typeof window === 'undefined') return; // Only run in browser
  
  try {
    const { generateClient } = await import('aws-amplify/api');
    const client = generateClient();
    console.log('✅ GraphQL client successfully generated');
    return client;
  } catch (error) {
    console.error('❌ Error generating GraphQL client:', error);
    return null;
  }
}

// Test function to check if Amplify is correctly set up
async function testAmplifySetup() {
  if (typeof window === 'undefined') return; // Only run in browser
  
  try {
    // Try to import and use Amplify dynamically to see if it's properly configured
    const { fetchUserAttributes } = await import('aws-amplify/auth');
    
    try {
      // This will fail if not signed in, but it will test the Cognito connection
      await fetchUserAttributes();
      console.log('✅ Amplify auth is working properly - able to contact Cognito');
    } catch (error: any) {
      // Expected error if not signed in
      if (error.name === 'NotAuthorizedException' || error.name === 'UserNotConfirmedException') {
        console.log('✅ Amplify auth is working properly - not signed in but connection to Cognito is good');
      } else if (error.name === 'TokenProviderNotFoundException') {
        console.error('❌ Amplify auth token provider not found - check your Cognito configuration');
      } else {
        console.error('❌ Amplify auth error:', error.name, error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error testing Amplify setup:', error);
  }
}

const getUserPoolId = () => {
  return typeof window !== 'undefined'
    ? (window as any).__ENV?.NEXT_PUBLIC_USER_POOL_ID || process.env.NEXT_PUBLIC_USER_POOL_ID
    : process.env.NEXT_PUBLIC_USER_POOL_ID;
};

const getUserPoolClientId = () => {
  return typeof window !== 'undefined'
    ? (window as any).__ENV?.NEXT_PUBLIC_USER_POOL_CLIENT_ID || process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID
    : process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
};

const getGraphQLEndpoint = () => {
  return typeof window !== 'undefined'
    ? (window as any).__ENV?.NEXT_PUBLIC_GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
    : process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
}; 