import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import '../../../css/styles.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';
import ThemeSwitcher from '../../ThemeSwitcher'; 

const getInitialUserState = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) throw new Error('Invalid token structure');

    const payload = JSON.parse(atob(payloadBase64));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      return null;
    }

    const storedEmail = localStorage.getItem('email');
    const storedAvatar = localStorage.getItem('avatar');
    const usernameFromEmail = (emailValue) =>
      emailValue?.split('@')[0] || payload.username || 'User';

    const email = storedEmail || payload.email || null;
    return {
      username: usernameFromEmail(email),
      email: email || 'user@example.com',
      role: payload.role || 'user',
      avatar: storedAvatar || '/img/small_logo.png',
      coins: 0
    };
  } catch (error) {
    console.error('Failed to parse token:', error);
    localStorage.removeItem('token');
    return null;
  }
};

const Header = ({ theme, setTheme }) => { 
  const { t } = useTranslation(); 
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getInitialUserState());
  const [openMenu, setOpenMenu] = useState(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) {
            localStorage.removeItem('token');
            setUser(null);
            return;
          }
          
          try {
            const response = await fetch('http://localhost:5001/api/me', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              const storedAvatar = localStorage.getItem('avatar') || '/img/small_logo.png';
              setUser(prev => ({ 
                username: userData.email?.split('@')[0] || 'User', 
                email: userData.email || 'user@example.com',
                role: userData.role || payload.role || 'user',
                avatar: userData.avatar || prev?.avatar || storedAvatar,
                coins: typeof userData.coins === 'number' ? userData.coins : (prev?.coins ?? 0)
              }));
            } else {
              const storedEmail = localStorage.getItem('email');
              const storedAvatar = localStorage.getItem('avatar') || '/img/small_logo.png';
              setUser({ 
                username: storedEmail?.split('@')[0] || 'User', 
                email: storedEmail || 'user@example.com',
                role: payload.role || 'user',
                avatar: storedAvatar,
                coins: 0
              });
            }
          } catch (apiError) {
            const storedEmail = localStorage.getItem('email');
            const storedAvatar = localStorage.getItem('avatar') || '/img/small_logo.png';
            setUser({ 
              username: storedEmail?.split('@')[0] || 'User', 
              email: storedEmail || 'user@example.com',
              role: payload.role || 'user',
              avatar: storedAvatar,
              coins: 0
            });
          }
        } catch (err) {
          console.error('Invalid token:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setOpenMenu(null);
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img 
            src="/img/big_logo.png" 
            alt="logo" 
            className="brand-logo" 
            style={theme === 'dark' ? { filter: 'brightness(0.7) saturate(0.95)' } : {}}
          />
          <span className="brand-title">Codelingo</span>
        </Link>

        <nav 
          className="main-nav" 
          aria-label={t('nav_main_aria')}
          style={theme !== 'light' ? { color: 'var(--color-text-primary)' } : {}}
        >
          <ul className="nav-list">
            {/* Learn dropdown */}
            <li className="nav-item nav-dropdown">
              <button
                type="button"
                className="nav-link nav-dropdown-trigger"
                onClick={() => setOpenMenu(openMenu === 'learn' ? null : 'learn')}
              >
                Learn
                <span className="nav-dropdown-caret">▾</span>
              </button>
              {openMenu === 'learn' && (
                <ul className="nav-dropdown-menu">
                  <li>
                    <Link className="nav-dropdown-link" to="/courses" onClick={() => setOpenMenu(null)}>
                      {t('nav_courses')}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Play dropdown */}
            <li className="nav-item nav-dropdown">
              <button
                type="button"
                className="nav-link nav-dropdown-trigger"
                onClick={() => setOpenMenu(openMenu === 'play' ? null : 'play')}
              >
                Play
                <span className="nav-dropdown-caret">▾</span>
              </button>
              {openMenu === 'play' && (
                <ul className="nav-dropdown-menu">
                  <li>
                    <Link className="nav-dropdown-link" to="/minigames" onClick={() => setOpenMenu(null)}>
                      {t('nav_minigames')}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Community dropdown */}
            <li className="nav-item nav-dropdown">
              <button
                type="button"
                className="nav-link nav-dropdown-trigger"
                onClick={() => setOpenMenu(openMenu === 'community' ? null : 'community')}
              >
                Community
                <span className="nav-dropdown-caret">▾</span>
              </button>
              {openMenu === 'community' && (
                <ul className="nav-dropdown-menu">
                  <li>
                    <Link className="nav-dropdown-link" to="/leaderboard" onClick={() => setOpenMenu(null)}>
                      {t('nav_leaderboard')}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Shop as standalone CTA */}
            <li className="nav-item">
              <Link className="nav-link nav-link-shop" to="/shop">
                Shop
              </Link>
            </li>
          </ul>
        </nav>

        <div className="auth-controls">
          <ThemeSwitcher
            className="square-switcher-btn"
            theme={theme}
            setTheme={setTheme}
            isOpen={openMenu === 'theme'}
            onToggle={() => setOpenMenu(openMenu === 'theme' ? null : 'theme')}
            onClose={() => setOpenMenu(null)}
          />
          <LanguageSwitcher
            className="square-switcher-btn"
            isOpen={openMenu === 'language'}
            onToggle={() => setOpenMenu(openMenu === 'language' ? null : 'language')}
            onClose={() => setOpenMenu(null)}
          /> 

          {user ? (
            <div className="user-menu">
              <button
                type="button"
                className="user-profile-trigger"
                onClick={() => setOpenMenu(openMenu === 'user' ? null : 'user')}
                title={t('profile_my_profile') || 'My Profile'}
              >
                <img 
                  src={user.avatar || '/img/small_logo.png'}
                  alt="Profile" 
                  className="user-profile-avatar-small"
                />
              </button>
              {openMenu === 'user' && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-balance">
                    <span className="user-menu-balance-label">Coins</span>
                    <span className="user-menu-balance-value">{user.coins ?? 0}</span>
                  </div>
                  <div className="user-menu-separator" />
                  <Link to="/profile" className="user-menu-item" onClick={() => setOpenMenu(null)}>
                    {t('profile_my_profile') || 'Profile'}
                  </Link>
                  <Link to="/progress" className="user-menu-item" onClick={() => setOpenMenu(null)}>
                    {t('nav_progress')}
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin_panel" className="user-menu-item" onClick={() => setOpenMenu(null)}>
                      {t('nav_admin_panel')}
                    </Link>
                  )}
                  <button type="button" className="user-menu-item user-menu-item-danger" onClick={handleLogout}>
                    {t('nav_logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="auth-link auth-btn" to="/login">{t('nav_login')}</Link>
              <Link className="btn btn-primary auth-btn" to="/signup">{t('nav_signup')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
