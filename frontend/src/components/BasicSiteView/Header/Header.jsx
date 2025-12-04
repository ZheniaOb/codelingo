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
      avatar: storedAvatar || '/img/small_logo.png'
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
                avatar: userData.avatar || prev?.avatar || storedAvatar
              }));
            } else {
              const storedEmail = localStorage.getItem('email');
              const storedAvatar = localStorage.getItem('avatar') || '/img/small_logo.png';
              setUser({ 
                username: storedEmail?.split('@')[0] || 'User', 
                email: storedEmail || 'user@example.com',
                role: payload.role || 'user',
                avatar: storedAvatar 
              });
            }
          } catch (apiError) {
            const storedEmail = localStorage.getItem('email');
            const storedAvatar = localStorage.getItem('avatar') || '/img/small_logo.png';
            setUser({ 
              username: storedEmail?.split('@')[0] || 'User', 
              email: storedEmail || 'user@example.com',
              role: payload.role || 'user',
              avatar: storedAvatar
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
            <li className="nav-item">
              <Link className="nav-link" to="/courses">{t('nav_courses')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/minigames">{t('nav_minigames')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/progress">{t('nav_progress')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/leaderboard">{t('nav_leaderboard')}</Link>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin_panel">{t('nav_admin_panel')}</Link>
              </li>
            )}
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
            <>
              <Link to="/profile" className="user-profile-trigger" title={t('profile_my_profile') || 'My Profile'}>
                <img 
                  src={user.avatar || '/img/small_logo.png'}
                  alt="Profile" 
                  className="user-profile-avatar-small"
                />
              </Link>
              <button className="btn btn-ghost" onClick={handleLogout}>{t('nav_logout')}</button>
            </>
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
