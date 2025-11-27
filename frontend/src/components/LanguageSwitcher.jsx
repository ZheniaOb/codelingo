import React, { useEffect } from 'react'; 
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation(); 
  const currentLang = i18n.language.substring(0, 2); 
  const targetLang = currentLang === 'en' ? 'pl' : 'en';
  useEffect(() => {
    console.log("LanguageSwitcher: MOUNTED.");
    return () => console.log("LanguageSwitcher: UNMOUNTED.");
  }, []);
  
  const changeLanguage = () => {
    console.log(`Language button clicked. Attempting to switch to: ${targetLang}`);
    i18n.changeLanguage(targetLang);
  };

  return (
    <button 
      onClick={changeLanguage}
      className="btn btn-primary" 
      style={{
        background: 'linear-gradient(180deg, var(--green-500), var(--green-400))',
        color: '#fff',
        border: 'none',
        padding: '8px 14px',
        borderRadius: '4px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '14px',
        lineHeight: '1.2',
        width: '46px', 
        minWidth: '46px',
        position: 'relative', 
        zIndex: 100, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {targetLang.toUpperCase()}
    </button>
  );
};

export default LanguageSwitcher;