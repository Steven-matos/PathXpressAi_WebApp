import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { translationConfig } from '@/context/translationConfig';

interface Translations {
  [key: string]: any;
}

interface LanguageState {
  currentLanguage: string;
  translations: {
    [key: string]: Translations;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: LanguageState = {
  currentLanguage: translationConfig.defaultLanguage,
  translations: {},
  isLoading: false,
  error: null
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'es'>) => {
      state.currentLanguage = action.payload;
    },
    loadTranslations: (state, action: PayloadAction<{ [key: string]: Translations }>) => {
      state.translations = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
});

export const { setLanguage, loadTranslations, setLoading, setError } = languageSlice.actions;
export default languageSlice.reducer;
