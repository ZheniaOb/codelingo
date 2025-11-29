import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/LanguageSwitcher.css';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

const LanguageSwitcher = ({ className }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const currentLang = i18n.language.substring(0, 2);

  return (
    <div className={`language-switcher ${className || ''}`}>
      <button 
        className="lang-btn" 
        onClick={() => setOpen(!open)}
      >
        <span className="flag">
          {languages.find(l => l.code === currentLang)?.flag || '🌐'}
        </span>
        <span className="lang-code">{currentLang.toUpperCase()}</span>
        <span className="arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul className="lang-dropdown">
          {languages.map((lang) => (
            <li 
              key={lang.code} 
              onClick={() => changeLanguage(lang.code)}
              className={`lang-option ${currentLang === lang.code ? 'active' : ''}`}
            >
              <span className="flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;