# Redux Store

This directory contains the Redux store configuration and state slices for the application.

## Store Structure

The Redux store consists of the following slices:

- **languageSlice**: Manages the application's language state and translations
- **routesSlice**: Stores route information 
- **userSlice**: Handles user-related state
- **apiDataSlice**: Manages API data, loading states, and errors

## API Data Management

The `apiDataSlice` provides a centralized way to handle API data in the application:

### State Structure

```typescript
interface ApiDataState {
  data: Record<string, unknown>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  lastFetched: Record<string, number | null>;
}
```

### Async Thunk

The `fetchApiData` thunk handles API requests and stores the results in the Redux store:

```typescript
fetchApiData({ endpoint, params })
```

### Reducers

- `clearApiData`: Clears data for a specific endpoint
- `clearAllApiData`: Clears all API data
- `setApiData`: Manually sets data for a specific endpoint

### Usage with Custom Hook

For easier integration, use the `useApiData` hook:

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