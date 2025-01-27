import { configureStore } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import routesReducer from "./routesSlice";
import languageReducer from "./languageSlice";
import userReducer from "./userSlice";
import { useSelector, useDispatch } from "react-redux";

export const makeStore = () => {
  return configureStore({
    reducer: {
      routes: routesReducer,
      language: languageReducer,
      user: userReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default makeStore();
