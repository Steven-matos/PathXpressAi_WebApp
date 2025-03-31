import { Amplify } from 'aws-amplify';

// Initialize Amplify configuration
export function configureAmplify() {
  console.log('🔄 Configuring Amplify...');
  
  // Get configuration from environment variables
  const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID;
  const userPoolClientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
  const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  const region = process.env['NEXT_PUBLIC_REGION'] || 'us-east-1';

  console.log('🔐 User Pool ID:', userPoolId || 'Not found');
  console.log('🔑 User Pool Client ID:', userPoolClientId || 'Not found');
  console.log('🌐 GraphQL Endpoint:', graphqlEndpoint || 'Not found');

  // Configuration with environment variables
  const config = {
    Auth: {
      Cognito: {
        userPoolId: userPoolId,
        userPoolClientId: userPoolClientId,
        loginWith: {
          email: true,
        },
      },
    },
    API: {
      GraphQL: {
        endpoint: graphqlEndpoint,
        region: region,
        defaultAuthMode: 'userPool',
      },
    },
    Storage: {
      S3: {
        region: region
      }
    }
  };

  console.log('⚙️ Final Amplify config:', {
    userPoolId: config.Auth.Cognito.userPoolId,
    userPoolClientId: config.Auth.Cognito.userPoolClientId,
    endpoint: config.API.GraphQL.endpoint,
    region: config.API.GraphQL.region
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
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: config.Auth.Cognito.userPoolId,
          userPoolClientId: config.Auth.Cognito.userPoolClientId,
          loginWith: {
            email: true,
          },
        },
      },
      API: {
        GraphQL: {
          endpoint: config.API.GraphQL.endpoint,
          region: config.API.GraphQL.region,
          defaultAuthMode: 'userPool' as const,
        },
      },
      Storage: {
        S3: {
          region: config.Storage.S3.region
        }
      }
    });
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