import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

/**
 * Check if AWS Amplify is correctly configured
 */
export function checkAmplifyConfig(): { isConfigured: boolean; missingValues: string[] } {
  const missingValues: string[] = [];
  
  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_USER_POOL_ID && typeof window !== 'undefined' && !(window as any).__ENV?.NEXT_PUBLIC_USER_POOL_ID) {
    missingValues.push('NEXT_PUBLIC_USER_POOL_ID');
  }
  
  if (!process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID && typeof window !== 'undefined' && !(window as any).__ENV?.NEXT_PUBLIC_USER_POOL_CLIENT_ID) {
    missingValues.push('NEXT_PUBLIC_USER_POOL_CLIENT_ID');
  }
  
  return {
    isConfigured: missingValues.length === 0,
    missingValues
  };
}

/**
 * Test connection to Amplify/Cognito
 */
export async function testAmplifyConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Try to get current user - this will work if the user is signed in
    await getCurrentUser();
    return { success: true, message: 'Connected to Amplify and user is authenticated.' };
  } catch (userError) {
    // User might not be signed in, which is ok for testing the connection
    try {
      // Try a different API to test connectivity
      await fetchUserAttributes();
      return { success: true, message: 'Connected to Amplify but no user is authenticated.' };
    } catch (error: any) {
      // Check if this is an expected error for unauthenticated users
      if (error.name === 'UserNotAuthenticatedException' || error.name === 'NotAuthorizedException') {
        return { success: true, message: 'Connected to Amplify but no user is authenticated.' };
      }
      
      // Check for configuration errors
      if (error.name === 'TokenProviderNotFoundException') {
        return { 
          success: false, 
          message: 'Configuration error: User Pool credentials may be missing or invalid.'
        };
      }
      
      return { 
        success: false, 
        message: `Error connecting to Amplify: ${error.message || 'Unknown error'}`
      };
    }
  }
} 