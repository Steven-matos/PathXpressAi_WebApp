import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { generateClient } from 'aws-amplify/api';

// Define a type for the API data state
export interface ApiDataState {
  data: Record<string, any>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  lastFetched: Record<string, number | null>;
}

// Initial state
const initialState: ApiDataState = {
  data: {},
  loading: {},
  error: {},
  lastFetched: {},
};

// GraphQL queries based on API Reference
const queries = {
  getRouteHistory: /* GraphQL */ `
    query GetRouteHistory($input: GetRouteHistoryInput!) {
      getRouteHistory(input: $input) {
        routes {
          id
          name
          description
          homeBase
          status
          estimatedDuration
          estimatedDistance
          createdAt
        }
        nextToken
      }
    }
  `,
  getDailyRoutes: /* GraphQL */ `
    query GetDailyRoutes($input: GetDailyRoutesInput!) {
      getDailyRoutes(input: $input) {
        routes {
          route {
            id
            name
            description
            estimatedDuration
            estimatedDistance
          }
          weatherConditions {
            temperature
            condition
            windSpeed
            precipitation
            alerts
          }
          personalScore
          recommendationReason
        }
      }
    }
  `,
  getCalendarEvents: /* GraphQL */ `
    query GetCalendarEvents($input: GetCalendarEventsInput!) {
      getCalendarEvents(input: $input) {
        events {
          id
          title
          start
          end
          allDay
          color
          type
          calendarId
          status
        }
        routeSchedules {
          id
          title
          start
          end
          color
          type
          routeId
          status
        }
      }
    }
  `,
  getUser: /* GraphQL */ `
    query GetUser($input: GetUserInput!) {
      getUser(input: $input) {
        id
        email
        name
        homeBase
        language
        preferences
        subscriptionTier
        createdAt
        updatedAt
      }
    }
  `,
  getSubUsers: /* GraphQL */ `
    query GetSubUsers($input: GetSubUsersInput!) {
      getSubUsers(input: $input) {
        subUsers {
          id
          email
          name
          phone
          role
          status
          homeBase
          assignedVehicle
          createdAt
        }
        nextToken
      }
    }
  `,
  getVehicles: /* GraphQL */ `
    query GetVehicles($input: GetVehiclesInput!) {
      getVehicles(input: $input) {
        vehicles {
          id
          name
          make
          model
          year
          licensePlate
          type
          status
          assignedTo
          mileage
          createdAt
        }
        nextToken
      }
    }
  `,
};

// Create an async thunk for fetching data from API
export const fetchApiData = createAsyncThunk(
  'apiData/fetchData',
  async ({ endpoint, params }: { endpoint: string, params?: any }, { rejectWithValue }) => {
    try {
      // Find the matching query
      const query = queries[endpoint];
      if (!query) {
        return rejectWithValue(`Unknown endpoint: ${endpoint}`);
      }
      
      // Create a client for API interaction
      const client = generateClient();
      
      // Execute GraphQL query with Amplify
      const response = await client.graphql({
        query,
        variables: { input: params }
      });
      
      // Extract the data from the response
      const data = response.data[endpoint];
      return { endpoint, data };
    } catch (error: any) {
      // Handle different types of GraphQL errors
      if (error.errors) {
        // GraphQL errors
        const errorMessages = error.errors.map(err => `${err.errorType}: ${err.message}`).join(', ');
        return rejectWithValue(errorMessages);
      } else if (error.message) {
        // Regular errors
        return rejectWithValue(error.message);
      } else {
        // Unknown error format
        return rejectWithValue('Unknown error occurred');
      }
    }
  }
);

// Create the slice
const apiDataSlice = createSlice({
  name: "apiData",
  initialState,
  reducers: {
    clearApiData: (state, action: PayloadAction<string>) => {
      const endpoint = action.payload;
      delete state.data[endpoint];
      delete state.loading[endpoint];
      delete state.error[endpoint];
      delete state.lastFetched[endpoint];
    },
    clearAllApiData: (state) => {
      state.data = {};
      state.loading = {};
      state.error = {};
      state.lastFetched = {};
    },
    setApiData: (state, action: PayloadAction<{ endpoint: string, data: any }>) => {
      const { endpoint, data } = action.payload;
      state.data[endpoint] = data;
      state.loading[endpoint] = false;
      state.error[endpoint] = null;
      state.lastFetched[endpoint] = Date.now();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiData.pending, (state, action) => {
        const endpoint = action.meta.arg.endpoint;
        state.loading[endpoint] = true;
        state.error[endpoint] = null;
      })
      .addCase(fetchApiData.fulfilled, (state, action) => {
        const { endpoint, data } = action.payload;
        state.data[endpoint] = data;
        state.loading[endpoint] = false;
        state.error[endpoint] = null;
        state.lastFetched[endpoint] = Date.now();
      })
      .addCase(fetchApiData.rejected, (state, action) => {
        const endpoint = action.meta.arg.endpoint;
        state.loading[endpoint] = false;
        state.error[endpoint] = action.payload as string;
      });
  },
});

// Export actions
export const { clearApiData, clearAllApiData, setApiData } = apiDataSlice.actions;

// Export selectors
export const selectApiData = (endpoint: string) => (state: RootState) => state.apiData.data[endpoint];
export const selectApiLoading = (endpoint: string) => (state: RootState) => state.apiData.loading[endpoint] || false;
export const selectApiError = (endpoint: string) => (state: RootState) => state.apiData.error[endpoint] || null;
export const selectApiLastFetched = (endpoint: string) => (state: RootState) => state.apiData.lastFetched[endpoint] || null;

// Export reducer
export default apiDataSlice.reducer; 