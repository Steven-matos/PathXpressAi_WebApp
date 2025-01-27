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
    // Load language from local storage on client side
    const savedLanguage = localStorage.getItem("language");
    console.log("savedLanguage", savedLanguage);
    const initialLanguage = savedLanguage || translationConfig.defaultLanguage;
    console.log("initialLanguage", initialLanguage);
    store.dispatch(setLanguage(initialLanguage));
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
