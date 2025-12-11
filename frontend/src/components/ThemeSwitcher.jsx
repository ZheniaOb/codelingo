import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/theme.css';

const themes = [
  { code: 'light', color: '#f7f7f7', label: 'Light theme' },
  { code: 'dark', color: '#212835', label: 'Dark theme' },
  { code: 'pink', color: 'rgb(251, 0, 126)', label: 'Pink theme' },
];

const ThemeSwitcher = ({ theme, setTheme, isOpen, onToggle, onClose, className }) => {
  const [pinkUnlocked, setPinkUnlocked] = useState(false);
  const [showPinkModal, setShowPinkModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchThemeOwnership = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/shop/items', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const items = await response.json();
        const pinkTheme = (items || []).find(
          (item) => item.item_type === 'theme' && item.asset_url === 'pink'
        );
        setPinkUnlocked(!!pinkTheme && !!pinkTheme.owned);
      } catch (e) {
        console.error('Error checking theme ownership:', e);
      }
    };

    fetchThemeOwnership();
  }, []);

  const handleThemeClick = (code) => {
    if (code === 'pink' && !pinkUnlocked) {
      setShowPinkModal(true);
      return;
    }
    setTheme(code);
    onClose();
  };

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
          {themes.map((t) => {
            const isLocked = t.code === 'pink' && !pinkUnlocked;
            return (
              <button
                key={t.code}
                onClick={() => handleThemeClick(t.code)}
                className={`color-circle ${t.code} ${theme === t.code ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                aria-label={t.label}
                title={t.label}
                style={{ backgroundColor: t.color }}
              ></button>
            );
          })}
        </div>
      </div>

      {showPinkModal && (
        <div
          className="theme-modal-backdrop"
          onClick={() => setShowPinkModal(false)}
        >
          <div
            className="theme-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="theme-modal-header">
              <div className="theme-modal-icon">🔒</div>
              <div>
                <h4 className="theme-modal-title">Pink theme locked</h4>
                <p className="theme-modal-subtitle">A premium look for your workspace.</p>
              </div>
            </div>

            <p className="theme-modal-text">
              You need to buy the pink theme in the Shop before you can use it.
            </p>

            <div className="theme-modal-actions">
              <button
                className="btn btn-cta theme-modal-btn-secondary"
                onClick={() => setShowPinkModal(false)}
              >
                Close
              </button>
              <button
                className="btn btn-cta theme-modal-btn-primary"
                onClick={() => {
                  setShowPinkModal(false);
                  navigate('/shop');
                }}
              >
                Go to shop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
