import React from 'react';

const SunIcon = () => <span>☀️</span>; 
const MoonIcon = () => <span>🌙</span>;
const PinkIcon = () => <span>💖</span>;

const ThemeSwitcher = (props) => { 
  const { theme, toggleTheme } = props; 
  
  let icon;
  let label;

  if (theme === 'light') {
    icon = <MoonIcon />;
    label = 'Switch to dark theme';
  } else if (theme === 'dark') {
    icon = <PinkIcon />;
    label = 'Switch to pink theme';
  } else {
    icon = <SunIcon />;
    label = 'Switch to light theme';
  }

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-primary ${props.className || ''}`} 
      aria-label={label}
      style={{
        background: 'linear-gradient(180deg, var(--green-500), var(--green-400))',
        color: '#fff', 
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '18px', 
        lineHeight: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </button>
  );
};

export default ThemeSwitcher;