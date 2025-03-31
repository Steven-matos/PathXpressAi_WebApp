import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from "./clientStore";
import { generateClient } from 'aws-amplify/api';

interface ApiResponse<T> {
  data: {
    [key: string]: T;
  };
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
    path: string[];
    extensions?: Record<string, any>;
  }>;
}

interface ApiDataState {
  data: Record<keyof ApiData, any>;
  loading: Record<keyof ApiData, boolean>;
  error: Record<keyof ApiData, string | null>;
  lastFetched: Record<keyof ApiData, number | null>;
}

interface RouteHistory {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'pending' | 'in_progress' | 'completed';
  driver?: string;
  vehicle?: string;
}

interface DailyRoutes {
  date: string;
  routes: RouteHistory[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SubUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface ApiData {
  getRouteHistory: RouteHistory[];
  getDailyRoutes: DailyRoutes[];
  getCalendarEvents: CalendarEvent[];
  getUser: User;
  getSubUsers: SubUser[];
  getVehicles: Vehicle[];
}

const initialState: ApiDataState = {
  data: {} as Record<keyof ApiData, any>,
  loading: {} as Record<keyof ApiData, boolean>,
  error: {} as Record<keyof ApiData, string | null>,
  lastFetched: {} as Record<keyof ApiData, number | null>
};

const queries: Record<keyof ApiData, string> = {
  getRouteHistory: `query GetRouteHistory {
    getRouteHistory {
      id
      title
      start
      end
      status
      driver
      vehicle
    }
  }`,
  getDailyRoutes: `query GetDailyRoutes {
    getDailyRoutes {
      date
      routes {
        id
        title
        start
        end
        status
        driver
        vehicle
      }
    }
  }`,
  getCalendarEvents: `query GetCalendarEvents {
    getCalendarEvents {
      id
      title
      start
      end
      type
    }
  }`,
  getUser: `query GetUser {
    getUser {
      id
      name
      email
      role
    }
  }`,
  getSubUsers: `query GetSubUsers {
    getSubUsers {
      id
      name
      email
      role
    }
  }`,
  getVehicles: `query GetVehicles {
    getVehicles {
      id
      name
      type
      status
    }
  }`
};

export const fetchApiData = createAsyncThunk(
  'apiData/fetchData',
  async ({ endpoint, params }: { endpoint: keyof ApiData; params?: Record<string, any> }) => {
    const client = generateClient();
    const query = queries[endpoint];
    
    const response = await client.graphql({
      query,
      variables: params
    }) as unknown as ApiResponse<ApiData[keyof ApiData]>;
    
    return { endpoint, data: response.data[endpoint] };
  }
);

const apiDataSlice = createSlice({
  name: 'apiData',
  initialState,
  reducers: {
    clearApiData: (state, action) => {
      const endpoint = action.payload as keyof ApiData;
      state.data[endpoint] = null;
      state.error[endpoint] = null;
    },
    clearAllApiData: (state) => {
      state.data = {} as Record<keyof ApiData, any>;
      state.error = {} as Record<keyof ApiData, string | null>;
    },
    setApiData: (state, action) => {
      const { endpoint, data } = action.payload;
      state.data[endpoint as keyof ApiData] = data;
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
        state.loading[endpoint] = false;
        state.data[endpoint] = data;
        state.lastFetched[endpoint] = Date.now();
      })
      .addCase(fetchApiData.rejected, (state, action) => {
        const endpoint = action.meta.arg.endpoint;
        state.loading[endpoint] = false;
        state.error[endpoint] = action.error.message || 'An error occurred';
      });
  }
});

export const { clearApiData, clearAllApiData, setApiData } = apiDataSlice.actions;

export const selectApiData = (endpoint: keyof ApiData) => (state: RootState) => state.apiData.data[endpoint];
export const selectApiLoading = (endpoint: keyof ApiData) => (state: RootState) => state.apiData.loading[endpoint] || false;
export const selectApiError = (endpoint: keyof ApiData) => (state: RootState) => state.apiData.error[endpoint] || null;
export const selectApiLastFetched = (endpoint: keyof ApiData) => (state: RootState) => state.apiData.lastFetched[endpoint] || null;

export default apiDataSlice.reducer; 