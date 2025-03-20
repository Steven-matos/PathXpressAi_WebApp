// src/components/Settings.tsx
"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setName } from "@/store/userSlice";
import { setLanguage } from "@/store/languageSlice";
import Navigation from "@/features/navigation";
import { useTranslation } from "@/context/TranslationContext";

export default function Settings() {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.user.name);
  const lang = useSelector((state: RootState) => state.language.currentLang);
  const { t, setLang } = useTranslation();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setName(e.target.value));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    dispatch(setLanguage(selectedLanguage));
    setLang(selectedLanguage);
  };

  return (
    <div>
      <Navigation />
      <div className="container mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold">{t("settings")}</h1>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            {t("name")}
          </label>
          <input
            type="text"
            value={username}
            onChange={handleNameChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            {t("language")}
          </label>
          <select
            value={lang}
            onChange={handleLanguageChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="en">{t("english")}</option>
            <option value="es">{t("spanish")}</option>
            {/* Add more languages as needed */}
          </select>
        </div>
      </div>
    </div>
  );
}
