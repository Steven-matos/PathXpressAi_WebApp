# Custom Hooks

This directory contains custom React hooks that can be used throughout the application.

## Available Hooks

### useApiData

A hook for fetching and managing API data using Redux.

#### Usage

```typescript
const { 
  data, 
  isLoading, 
  error, 
  lastFetched, 
  refresh, 
  clear 
} = useApiData<DataType>(endpoint, params, options);
```

#### Parameters

- `endpoint` (string): The API endpoint to fetch data from
- `params` (object, optional): Parameters for the API request
- `options` (object, optional):
  - `autoFetch` (boolean): Whether to automatically fetch data on mount (default: true)
  - `refreshInterval` (number): Interval in milliseconds to refresh data (default: 0, no refresh)
  - `skipIfAlreadyLoaded` (boolean): Skip fetching if data is already loaded (default: true)

#### Return Value

- `data`: The fetched data (type specified by generic parameter)
- `isLoading` (boolean): Whether the data is currently loading
- `error` (string | null): Error message if the request failed
- `lastFetched` (number | null): Timestamp of when the data was last fetched
- `refresh` (function): Function to manually refresh the data
- `clear` (function): Function to clear the data from the store

#### Example

```typescript
function UserList() {
  const { 
    data: users, 
    isLoading, 
    error, 
    refresh 
  } = useApiData<User[]>('/api/users', {}, { refreshInterval: 60000 });

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### useOnboarding

A hook for managing the user onboarding flow.

#### Usage

```typescript
const {
  currentStep,
  isOnboardingComplete,
  userData,
  updateUserData,
  completeCurrentStep,
  setOnboardingComplete,
  checkUserExists,
  forceCheckUserExists,
  createUserInDatabase,
  resetOnboarding,
  hardResetOnboarding,
  goToPreviousStep,
  setCurrentStep
} = useOnboarding();
```

#### Return Value

- `currentStep` (OnboardingStep): Current step in the onboarding process
- `isOnboardingComplete` (boolean): Whether onboarding is complete
- `userData` (OnboardingData): User data collected during onboarding
- `updateUserData` (function): Update user data during onboarding
- `completeCurrentStep` (function): Move to the next onboarding step
- `setOnboardingComplete` (function): Mark onboarding as complete
- `checkUserExists` (function): Check if user exists in database
- `forceCheckUserExists` (function): Force check user existence
- `createUserInDatabase` (function): Create user record in database
- `resetOnboarding` (function): Reset onboarding state
- `hardResetOnboarding` (function): Hard reset of all onboarding state
- `goToPreviousStep` (function): Move to previous onboarding step
- `setCurrentStep` (function): Set current onboarding step

#### Example

```typescript
function OnboardingStep() {
  const { 
    currentStep, 
    userData, 
    updateUserData, 
    completeCurrentStep 
  } = useOnboarding();

  const handleSubmit = (data: Partial<OnboardingData>) => {
    updateUserData(data);
    completeCurrentStep();
  };

  return (
    <div>
      <h2>Step: {currentStep}</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </div>
  );
}
```

### useAuth

A hook for managing authentication state and operations.

#### Usage

```typescript
const {
  user,
  isLoading,
  isAuthenticated,
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  resetPassword,
  confirmResetPassword
} = useAuth();
```

#### Return Value

- `user` (AuthUser | null): Current authenticated user
- `isLoading` (boolean): Whether auth state is loading
- `isAuthenticated` (boolean): Whether user is authenticated
- `signIn` (function): Sign in user
- `signUp` (function): Sign up new user
- `confirmSignUp` (function): Confirm user signup
- `signOut` (function): Sign out user
- `resetPassword` (function): Reset user password
- `confirmResetPassword` (function): Confirm password reset

#### Example

```typescript
function LoginForm() {
  const { signIn, isLoading, error } = useAuth();

  const handleSubmit = async (credentials: SignInParams) => {
    try {
      await signIn(credentials);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### useTranslation

A hook for managing translations and language preferences.

#### Usage

```typescript
const {
  t,
  setLang,
  language,
  isLoaded
} = useTranslation();
```

#### Return Value

- `t` (function): Translation function
- `setLang` (function): Set current language
- `language` (string): Current language code
- `isLoaded` (boolean): Whether translations are loaded

#### Example

```typescript
function WelcomeMessage() {
  const { t, language } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>Current language: {language}</p>
    </div>
  );
}
```

## Best Practices

1. Always use hooks at the top level of your component
2. Don't call hooks inside loops, conditions, or nested functions
3. Use TypeScript generics for better type safety
4. Handle loading and error states appropriately
5. Clean up any side effects in useEffect
6. Use early returns to handle edge cases
7. Implement proper error boundaries
8. Cache expensive computations with useMemo
9. Memoize callbacks with useCallback when needed
10. Use proper TypeScript types for all parameters and return values

## Error Handling

All hooks implement proper error handling and provide error states. When using these hooks:

1. Always check for error states
2. Implement proper error boundaries
3. Show user-friendly error messages
4. Log errors for debugging
5. Provide fallback UI when errors occur
6. Implement retry mechanisms where appropriate

## Performance Considerations

1. Use proper dependency arrays in useEffect
2. Implement proper memoization
3. Avoid unnecessary re-renders
4. Use proper caching strategies
5. Implement proper loading states
6. Use proper debouncing for frequent updates
7. Implement proper cleanup functions
8. Use proper pagination for large datasets
9. Implement proper error boundaries
10. Use proper TypeScript types for better performance