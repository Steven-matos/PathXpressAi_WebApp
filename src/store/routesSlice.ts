import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Route {
  title: string;
  start: string;
  end: string;
  address: string;
  description: string;
}

interface RoutesState {
  tomorrow: Route[];
}

const initialState: RoutesState = {
  tomorrow: [], // Default empty routes
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setRoutes: (state, action: PayloadAction<Route[]>) => {
      state.tomorrow = action.payload;
    },
  },
});

export const { setRoutes } = routesSlice.actions;
export default routesSlice.reducer;
