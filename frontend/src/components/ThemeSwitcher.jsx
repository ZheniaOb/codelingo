import React from 'react';
const SunIcon = () => <span>☀️</span>; 
const MoonIcon = () => <span>🌙</span>;

const ThemeSwitcher = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-primary"
      style={{
        background: 'linear-gradient(180deg, var(--green-500), var(--green-400))',
        color: '#fff', 
        border: 'none',
        padding: '8px 14px',
        borderRadius: '4px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '18px', 
        lineHeight: '1.2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '46px', 
        minWidth: '46px',
        position: 'relative', 
        zIndex: 100 
      }}
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeSwitcher;