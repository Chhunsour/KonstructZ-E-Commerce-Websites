import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  defaultLanguage,
  dictionaries,
  languageOptions,
  languageStorageKey,
  type LanguageCode,
  type LanguageOption,
} from "../i18n/dictionaries";

type TranslationValues = Record<string, string | number>;

interface TranslateOptions {
  fallback?: string;
  values?: TranslationValues;
}

interface I18nContextValue {
  language: LanguageCode;
  languageOption: LanguageOption;
  languages: LanguageOption[];
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, options?: TranslateOptions) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const isLanguageCode = (value: string | null): value is LanguageCode =>
  !!value && languageOptions.some((language) => language.code === value);

const formatTranslation = (value: string, values?: TranslationValues) => {
  if (!values) return value;
  return value.replace(/\{(\w+)\}/g, (match, token) =>
    values[token] === undefined ? match : String(values[token]),
  );
};

const getInitialLanguage = (): LanguageCode => {
  if (typeof window === "undefined") return defaultLanguage;
  const stored = window.localStorage.getItem(languageStorageKey);
  return isLanguageCode(stored) ? stored : defaultLanguage;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);

  const setLanguage = useCallback((nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(languageStorageKey, language);
    const current = languageOptions.find((option) => option.code === language) ?? languageOptions[0];
    document.documentElement.lang = current.htmlLang;

    // Dynamically inject language-specific Google Fonts on-demand
    const loadFont = (id: string, href: string) => {
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    };

    if (language === "JP") {
      loadFont("google-font-ja", "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap");
    } else if (language === "KR") {
      loadFont("google-font-ko", "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap");
    } else if (language === "CN") {
      loadFont("google-font-zh", "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap");
    }
  }, [language]);

  const t = useCallback(
    (key: string, options?: TranslateOptions) => {
      const translated =
        dictionaries[language]?.[key] ??
        dictionaries[defaultLanguage]?.[key] ??
        options?.fallback ??
        key;

      return formatTranslation(translated, options?.values);
    },
    [language],
  );

  const value = useMemo<I18nContextValue>(() => {
    const languageOption =
      languageOptions.find((option) => option.code === language) ?? languageOptions[0];

    return {
      language,
      languageOption,
      languages: languageOptions,
      setLanguage,
      t,
    };
  }, [language, setLanguage, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
