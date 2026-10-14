import React, { createContext, useContext, useState } from 'react';
import { TRANSLATIONS, LANGUAGES } from '../translations/strings';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState('en');

  const t = (key) => {
    const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage: setCurrentLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
