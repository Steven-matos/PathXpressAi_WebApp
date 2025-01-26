import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  address: string;
}

interface EventsState {
  events: Event[];
}

const initialState: EventsState = {
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state: EventsState, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state: EventsState, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(
        (event: Event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    removeEvent: (state: EventsState, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event: Event) => event.id !== action.payload
      );
    },
  },
});

export const { addEvent, updateEvent, removeEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
