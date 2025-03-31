"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { useToast } from '@/components/ui/use-toast';

interface SignUpData {
  username: string;
  password: string;
  email: string;
}

interface SignInData {
  username: string;
  password: string;
}

interface ConfirmSignUpData {
  username: string;
  code: string;
}

export function CognitoTester() {
  const { toast } = useToast();
  const [userPoolId, setUserPoolId] = useState('');
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: '',
    password: '',
    email: ''
  });
  const [signInData, setSignInData] = useState<SignInData>({
    username: '',
    password: ''
  });
  const [confirmSignUpData, setConfirmSignUpData] = useState<ConfirmSignUpData>({
    username: '',
    code: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const testCurrentConfig = async () => {
    setStatus('testing');
    setResultMessage('Testing current Cognito configuration...');
    
    try {
      // Attempt to get current user (will fail if not signed in, but will validate config)
      try {
        const currentUser = await getCurrentUser();
        setResultMessage(`Success! Connected to Cognito. Current user: ${currentUser.username}`);
        setStatus('success');
        return;
      } catch (userError) {
        // This is expected if not signed in
        if (userError.message.includes('No current user')) {
          // Try to fetch auth session (will validate config without requiring sign-in)
          try {
            await fetchAuthSession();
            setResultMessage('Success! Cognito configuration is valid. No user is currently signed in.');
            setStatus('success');
          } catch (sessionError) {
            if (sessionError.message.includes('No current user')) {
              setResultMessage('Cognito configuration appears valid, but no user is signed in.');
              setStatus('success');
            } else {
              throw sessionError;
            }
          }
        } else {
          throw userError;
        }
      }
    } catch (error) {
      console.error('Error testing Cognito configuration:', error);
      setResultMessage(`Error: ${error.message || 'Unknown error'}`);
      setStatus('error');
      
      // Check for specific error types
      if (error.message.includes('Invalid UserPoolId')) {
        setResultMessage('Invalid User Pool ID. Please check your configuration.');
      } else if (error.message.includes('Invalid app client')) {
        setResultMessage('Invalid App Client ID. Please check your configuration.');
      }
    }
  };

  const getConfigDetails = () => {
    if (typeof window !== 'undefined') {
      try {
        // Dynamically import aws-exports to get current config
        import('@/aws-exports').then(awsExports => {
          setUserPoolId(awsExports.default.aws_user_pools_id || 'Not configured');
          setClientId(awsExports.default.aws_user_pools_web_client_id || 'Not configured');
        }).catch(err => {
          console.error('Error loading aws-exports:', err);
          setUserPoolId('Error loading configuration');
          setClientId('Error loading configuration');
        });
      } catch (error) {
        console.error('Error getting config details:', error);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp({
        username: signUpData.username,
        password: signUpData.password,
        options: {
          userAttributes: {
            email: signUpData.email
          }
        }
      });
      toast({
        title: 'Success',
        description: 'Please check your email for the confirmation code.'
      });
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign up',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn({
        username: signInData.username,
        password: signInData.password
      });
      toast({
        title: 'Success',
        description: 'Signed in successfully!'
      });
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await confirmSignUp({
        username: confirmSignUpData.username,
        confirmationCode: confirmSignUpData.code
      });
      toast({
        title: 'Success',
        description: 'Email confirmed successfully!'
      });
    } catch (error) {
      console.error('Error confirming sign up:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to confirm sign up',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast({
        title: 'Success',
        description: 'Signed out successfully!'
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign out',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAuth = async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      toast({
        title: 'Success',
        description: `Currently signed in as: ${user.username}`
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to check auth status',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Cognito Configuration Tester</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              getConfigDetails();
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Hide Details' : 'Show Details'}
          </Button>
        </CardTitle>
        <CardDescription>
          Test your connection to AWS Cognito for authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showForm && (
            <div className="space-y-4 p-4 border rounded-md bg-slate-50">
              <div>
                <Label htmlFor="userPoolId">Current User Pool ID</Label>
                <Input 
                  id="userPoolId" 
                  value={userPoolId} 
                  readOnly 
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="clientId">Current App Client ID</Label>
                <Input 
                  id="clientId" 
                  value={clientId} 
                  readOnly 
                  className="font-mono text-sm"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>These values should be updated in either:</p>
                <ul className="list-disc list-inside mt-1">
                  <li><code className="text-xs font-mono">.env.local</code> as environment variables</li>
                  <li>Or in <code className="text-xs font-mono">src/aws-exports.js</code></li>
                </ul>
              </div>
            </div>
          )}
        
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              {status === 'idle' && <Badge variant="outline">Not Tested</Badge>}
              {status === 'testing' && <Badge className="bg-yellow-500">Testing...</Badge>}
              {status === 'success' && <Badge className="bg-green-500">Success</Badge>}
              {status === 'error' && <Badge variant="destructive">Error</Badge>}
            </div>
            <Button 
              onClick={testCurrentConfig} 
              disabled={status === 'testing'}
            >
              Test Connection
            </Button>
          </div>
          
          {resultMessage && (
            <div className={`p-3 rounded-md mt-2 text-sm ${
              status === 'error' ? 'bg-red-50 text-red-900' : 
              status === 'success' ? 'bg-green-50 text-green-900' : 
              'bg-slate-50'
            }`}>
              {resultMessage}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 