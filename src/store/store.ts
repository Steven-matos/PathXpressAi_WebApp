import { configureStore } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import eventsReducer from "./eventsSlice";
import languageReducer from "./languageSlice";
import { useSelector, useDispatch } from "react-redux";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  address: string;
}

const initialState: Event[] = [];

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // Add basic reducers - can be expanded based on needs
    addEvent: (state: Event[], action: PayloadAction<Event>) => {
      state.push(action.payload);
    },
  },
});

export const makeStore = () => {
  return configureStore({
    reducer: {
      events: eventsReducer,
      language: languageReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default makeStore();
