import React from 'react';
import '../css/theme.css';

const themes = [
  { code: 'light', color: '#f7f7f7', label: 'Light theme' },
  { code: 'dark', color: '#212835', label: 'Dark theme' },
  { code: 'pink', color: 'rgb(251, 0, 126)', label: 'Pink theme' },
];

const ThemeSwitcher = ({ theme, setTheme, isOpen, onToggle, onClose, className }) => {
  return (
    <div className={`theme-switcher ${className || ''}`}>
      <button
        onClick={onToggle}
        className="switcher-btn"
        aria-label="Choose theme"
      >
        🎨
      </button>

      <div className={`theme-menu ${isOpen ? 'open' : 'closed'}`}>
        <div className="palette">
          {themes.map((t) => (
            <button
              key={t.code}
              onClick={() => { setTheme(t.code); onClose(); }}
              className={`color-circle ${t.code} ${theme === t.code ? 'active' : ''}`}
              aria-label={t.label}
              title={t.label}
              style={{ backgroundColor: t.color }}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
