"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "./locales";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: ["pt", "en"],
      nonExplicitSupportedLngs: true,
      load: "languageOnly",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "i18nextLng",
        convertDetectedLanguage: (lng: string) =>
          lng.toLowerCase().startsWith("pt") ? "pt" : "en",
      },
    });
}

export default i18n;
