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