// Debug script to test Amplify configuration
require('dotenv').config({ path: '.env.local' });

console.log('Environment variables:');
console.log('USER_POOL_ID:', process.env.NEXT_PUBLIC_USER_POOL_ID);
console.log('USER_POOL_CLIENT_ID:', process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID);
console.log('GRAPHQL_ENDPOINT:', process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT);
console.log('IDENTITY_POOL_ID:', process.env.NEXT_PUBLIC_IDENTITY_POOL_ID);

// Check if all required variables are present
if (!process.env.NEXT_PUBLIC_USER_POOL_ID || !process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID) {
  console.error('ERROR: Missing required AWS Cognito credentials in .env.local');
} else {
  console.log('All required AWS Cognito variables are present');
}

// Show mock Amplify configuration
console.log('\nAmplify configuration that would be used:');
console.log({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
      loginWith: { email: true }
    }
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      defaultAuthMode: 'userPool',
      region: 'us-east-1'
    }
  }
}); 