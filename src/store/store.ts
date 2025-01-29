import { configureStore } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import routesReducer from "./routesSlice";
import languageReducer from "./languageSlice";
import userReducer from "./userSlice";
import { useSelector, useDispatch } from "react-redux";

// Strongly typed language state
interface LanguageState {
  currentLang: 'en' | 'es';
  translations: Record<string, any>;
}

const initialState: LanguageState = {
  currentLang: 'en',
  translations: {},
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'es'>) => {
      state.currentLang = action.payload;
    },
    loadTranslations: (state, action: PayloadAction<Record<string, any>>) => {
      state.translations = action.payload;
    }
  },
});

export const { setLanguage, loadTranslations } = languageSlice.actions;
export const selectCurrentLanguage = (state: RootState) => state.language.currentLang;
export const selectTranslations = (state: RootState) => state.language.translations;

export const makeStore = () => {
  return configureStore({
    reducer: {
      routes: routesReducer,
      language: languageSlice.reducer,
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
