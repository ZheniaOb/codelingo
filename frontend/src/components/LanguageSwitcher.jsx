import React from 'react';
import { useTranslation } from 'react-i18next';
import '../css/LanguageSwitcher.css';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

const LanguageSwitcher = ({ className, isOpen, onToggle, onClose }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.substring(0, 2);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    onClose(); 
  };

  return (
    <div className={`language-switcher ${className || ''}`}>
      <button className="lang-btn" onClick={onToggle}>
        <span className="flag">
          {languages.find(l => l.code === currentLang)?.flag || '🌐'}
        </span>
        <span className="lang-code">{currentLang.toUpperCase()}</span>
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
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