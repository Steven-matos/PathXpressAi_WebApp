"use client";

import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import apiDataReducer from './apiDataSlice';
import authReducer from './authSlice';
import routesReducer from './routesSlice';
// Create RTK Query API
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API service
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    // Define endpoints here when needed
  }),
});

// Create the store instance
const store = configureStore({
  reducer: {
    language: languageReducer,
    apiData: apiDataReducer,
    auth: authReducer,
    routes: routesReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export the store instance
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 