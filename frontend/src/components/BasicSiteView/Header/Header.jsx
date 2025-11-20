import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import '../../../css/styles.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher'; 

const Header = () => {
  const { t } = useTranslation(); 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.username || 'User', role: payload.role || 'user' });
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
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
          <img src="/img/big_logo.png" alt="logo" className="brand-logo" />
          <span className="brand-title">Codelingo</span>
        </Link>

        <nav className="main-nav" aria-label={t('nav_main_aria')}>
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
          <LanguageSwitcher /> 
          {user ? (
            <>
              <span className="user-name">{t('nav_hello_user', { username: user.username })}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>{t('nav_logout')}</button>
            </>
          ) : (
            <>
              <Link className="auth-link" to="/login">{t('nav_login')}</Link>
              <Link className="btn btn-primary" to="/signup">{t('nav_signup')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;