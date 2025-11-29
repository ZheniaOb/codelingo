import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEn from './locales/en/translation.json';
import translationPl from './locales/pl/translation.json';
import translationZh from './locales/zh/translation.json';
import translationRu from './locales/ru/translation.json';
import translationUk from './locales/uk/translation.json';
import translationEs from './locales/es/translation.json';
import translationFr from './locales/fr/translation.json';   
import translationHi from './locales/hi/translation.json';   
import translationAr from './locales/ar/translation.json'; 

const resources = {
  en: { translation: translationEn },
  pl: { translation: translationPl },
  zh: { translation: translationZh },
  ru: { translation: translationRu },
  uk: { translation: translationUk },
  es: { translation: translationEs },
  fr: { translation: translationFr },
  hi: { translation: translationHi },
  ar: { translation: translationAr },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'pl', 'zh', 'ru', 'uk', 'es', 'fr', 'hi', 'ar'], 
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
