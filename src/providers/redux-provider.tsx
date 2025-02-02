"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../store/store";
import { setLanguage } from "../store/languageSlice";
import { translationConfig } from "../context/translationConfig";

const store = makeStore();

export const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const langFromCookie = document.cookie.match(/preferredLang=([^;]+)/)?.[1];
    const initialLanguage = langFromCookie || translationConfig.defaultLanguage;
    store.dispatch(setLanguage(initialLanguage));
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
