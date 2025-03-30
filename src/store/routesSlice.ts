import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Route {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'pending' | 'in_progress' | 'completed';
  driver?: string;
  vehicle?: string;
}

interface RoutesState {
  tomorrow: Route[];
  today: Route[];
  past: Route[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RoutesState = {
  tomorrow: [],
  today: [],
  past: [],
  isLoading: false,
  error: null
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setRoutes: (state, action: PayloadAction<{ tomorrow: Route[]; today: Route[]; past: Route[] }>) => {
      state.tomorrow = action.payload.tomorrow;
      state.today = action.payload.today;
      state.past = action.payload.past;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearRoutes: (state) => {
      state.tomorrow = [];
      state.today = [];
      state.past = [];
      state.error = null;
    }
  },
});

export const { setRoutes, setLoading, setError, clearRoutes } = routesSlice.actions;
export default routesSlice.reducer;
