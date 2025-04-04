import { signOut as amplifySignOut } from 'aws-amplify/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/authSlice';

export const signOut = () => async (dispatch: any) => {
  try {
    await amplifySignOut();
    dispatch(setUser(null));
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}; 