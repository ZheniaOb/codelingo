import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = (props) => { 
  const { i18n } = useTranslation(); 
  const currentLang = i18n.language.substring(0, 2); 
  const targetLang = currentLang === 'en' ? 'pl' : 'en';
  const changeLanguage = () => {
    i18n.changeLanguage(targetLang);
  };

  return (
    <button 
      onClick={changeLanguage}
      className={`btn btn-primary ${props.className || ''}`} 
      style={{
        background: 'linear-gradient(180deg, var(--green-500), var(--green-400))',
        color: '#fff',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '16px',
        lineHeight: '1',
      }}
    >
      {targetLang.toUpperCase()}
    </button>
  );
};

export default LanguageSwitcher;