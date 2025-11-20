import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation(); 
  const currentLang = i18n.language.substring(0, 2); 
  const targetLang = currentLang === 'en' ? 'pl' : 'en';
  const changeLanguage = () => {
    i18n.changeLanguage(targetLang);
  };

  return (
    <button 
      onClick={changeLanguage}
      className="btn btn-primary" 
    >
      {targetLang.toUpperCase()}
    </button>
  );
};

export default LanguageSwitcher;