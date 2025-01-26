import { configureStore } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

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

const eventsReducer = eventsSlice.reducer;

const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
