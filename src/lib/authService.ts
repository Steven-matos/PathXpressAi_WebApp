import { signIn, signOut, signUp, confirmSignUp, resetPassword, confirmResetPassword } from 'aws-amplify/auth';

export interface SignUpParams {
  email: string;
  password: string;
  givenName: string;
  address: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface ConfirmSignUpParams {
  email: string;
  confirmationCode: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ConfirmResetPasswordParams {
  email: string;
  confirmationCode: string;
  newPassword: string;
}

export const auth = {
  /**
   * Sign up a new user
   */
  signUp: async ({ email, password, givenName, address }: SignUpParams) => {
    try {
      // Try to sign out any existing sessions first to ensure a clean state
      try {
        await signOut({ global: true });
        console.log('Successfully signed out any existing sessions before signup');
      } catch (signOutError) {
        // Ignore errors from signOut as the user might not be signed in
        console.log('No active session to sign out or error signing out:', signOutError);
      }

      console.log('Attempting to sign up user:', email);
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            given_name: givenName,
            address,
          },
          autoSignIn: true,
        },
      });
      console.log('Sign up result:', result.isSignUpComplete ? 'Complete' : 'Needs confirmation');
      return result;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  /**
   * Confirm sign up with verification code
   */
  confirmSignUp: async ({ email, confirmationCode }: ConfirmSignUpParams) => {
    try {
      const result = await confirmSignUp({
        username: email,
        confirmationCode,
      });
      return result;
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error;
    }
  },

  /**
   * Sign in a user
   */
  signIn: async ({ email, password }: SignInParams) => {
    try {
      // Try to sign out any existing sessions first to prevent "already logged in" errors
      try {
        await signOut({ global: true });
        console.log('Successfully signed out any existing sessions before new login attempt');
      } catch (signOutError) {
        // Ignore errors from signOut as the user might not be signed in
        console.log('No active session to sign out or error signing out:', signOutError);
      }

      // Now proceed with sign in
      console.log('Attempting to sign in user:', email);
      const result = await signIn({
        username: email,
        password,
      });
      console.log('Sign in successful:', result.isSignedIn);
      return result;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Request a password reset
   */
  resetPassword: async ({ email }: ResetPasswordParams) => {
    try {
      const result = await resetPassword({
        username: email,
      });
      return result;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  /**
   * Confirm password reset with verification code
   */
  confirmResetPassword: async ({ email, confirmationCode, newPassword }: ConfirmResetPasswordParams) => {
    try {
      const result = await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });
      return result;
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  },
};