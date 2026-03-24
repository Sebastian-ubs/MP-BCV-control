import React, { useEffect, useState, createContext, useContext } from 'react';
import { translations, Locale } from './translations';
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}
const I18nContext = createContext<I18nContextType | undefined>(undefined);
export function I18nProvider({ children }: {children: ReactNode;}) {
  const [locale, setLocaleState] = useState<Locale>('en');
  useEffect(() => {
    const saved = localStorage.getItem('app_locale') as Locale;
    if (saved && ['en', 'fr', 'es'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('app_locale', newLocale);
  };
  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) {
      return key;
    }
    return entry[locale] || entry['en'] || key;
  };
  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t
      }}>
      
      {children}
    </I18nContext.Provider>);

}
export function useT() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useT must be used within an I18nProvider');
  }
  return context;
}