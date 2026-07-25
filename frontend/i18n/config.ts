"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./locales";

/**
 * Fixed initial language so SSR and the first client render match.
 * Preferred language is applied after mount in Providers (avoids hydration mismatch).
 */
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["pt", "en"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export function detectPreferredLanguage(): "pt" | "en" {
  if (typeof window === "undefined") return "en";

  try {
    const stored = window.localStorage.getItem("i18nextLng");
    if (stored?.toLowerCase().startsWith("pt")) return "pt";
    if (stored?.toLowerCase().startsWith("en")) return "en";
  } catch {
    // ignore
  }

  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export default i18n;
