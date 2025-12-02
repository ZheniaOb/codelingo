import React, { useState } from 'react';

const themes = [
  { code: 'light', color: '#f7f7f7', label: 'Light theme' },
  { code: 'dark', color: '#212835', label: 'Dark theme' },
  { code: 'pink', color: 'rgb(251, 0, 126)', label: 'Pink theme' },
];

const ThemeSwitcher = ({ theme, setTheme, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`theme-switcher ${className || ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="switcher-btn"
        aria-label="Choose theme"
      >
        🎨
      </button>

      <div className={`theme-menu ${open ? 'open' : 'closed'}`}>
        <div className="palette">
          {themes.map((t) => (
            <button
              key={t.code}
              onClick={() => { setTheme(t.code); setOpen(false); }}
              className={`color-circle ${t.code} ${theme === t.code ? 'active' : ''}`}
              aria-label={t.label}
              title={t.label}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
