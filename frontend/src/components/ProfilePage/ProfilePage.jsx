import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Footer from '../BasicSiteView/Footer/Footer';
import '../ProfilePage/ProfilePage.css';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('/img/small_logo.png');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const availableAvatars = [
    '/img/small_logo.png',
    '/img/avatar/black.png',
    '/img/avatar/purple.png',
    '/img/avatar/pink.png',
    '/img/avatar/red.png',
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
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
          const data = await response.json();
          setUser(data);
          setDisplayName(data.username || data.email?.split('@')[0] || 'User');
          setEmail(data.email || '');
            setSelectedAvatar(data.avatar || '/img/small_logo.png');
        } else {
          // Fallback do localStorage
          const storedEmail = localStorage.getItem('email');
          if (storedEmail) {
            setUser({
              email: storedEmail,
              username: storedEmail.split('@')[0],
              role: localStorage.getItem('role') || 'user',
              xp: 0,
              level: 1,
                lessons_count: 0,
                avatar: '/img/small_logo.png'
            });
            setDisplayName(storedEmail.split('@')[0]);
            setEmail(storedEmail);
              setSelectedAvatar('/img/small_logo.png');
          }
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Fallback do localStorage
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
          setUser({
            email: storedEmail,
            username: storedEmail.split('@')[0],
            role: localStorage.getItem('role') || 'user',
            xp: 0,
            level: 1,
            lessons_count: 0,
            avatar: '/img/small_logo.png'
          });
          setDisplayName(storedEmail.split('@')[0]);
          setEmail(storedEmail);
          setSelectedAvatar('/img/small_logo.png');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateAvatar = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatusMessage({ type: 'error', text: t('profile_not_logged_in') || 'Please log in first.' });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const response = await fetch('http://localhost:5001/api/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: displayName.trim(),
          email: email.trim(),
          avatar: selectedAvatar
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser(data);
      setDisplayName(data.username || '');
      setEmail(data.email || '');
      setSelectedAvatar(data.avatar || '/img/small_logo.png');
      localStorage.setItem('avatar', data.avatar || '/img/small_logo.png');
      window.location.reload();
      setStatusMessage({ type: 'success', text: t('profile_saved') || 'Changes saved!' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <main className="profile-main">
          <div className="profile-container">
            <div className="profile-loading">
              <p>{t('profile_loading') || 'Loading profile...'}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page-wrapper">
        <main className="profile-main">
          <div className="profile-container">
            <div className="profile-card text-center">
              <h2>{t('profile_not_logged_in') || 'You are not logged in'}</h2>
              <p>{t('profile_please_login') || 'Please log in to see your profile.'}</p>
              <a href="/login" className="btn btn-cta" style={{marginTop: '20px'}}>
                {t('nav_login') || 'Log In'}
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Dane z API
  const userXP = user.xp || 0;
  const userLevel = user.level || 1;
  const levelTitle = user.level_title || 'Beginner';
  const nextLevelTitle = user.next_level_title || 'Novice';
  const xpToNextLevel = user.xp_to_next_level || 100;
  const progressPercentage = user.progress_percentage || 0;
  const lessonsCompleted = user.lessons_count || 0;

  return (
    <div className="profile-page-wrapper">
      <main className="profile-main">
        <div className="profile-container-vertical">
          {/* Profile Header Section */}
          <div className="profile-header-section">
            <div className="profile-avatar-wrapper-center">
              <img
                src={selectedAvatar}
                alt="Profile"
                className="profile-avatar-large"
              />
              <button
                className="profile-avatar-edit-btn"
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                title={t('profile_change_avatar') || 'Change avatar'}
              >
                📷
              </button>
            </div>

            <div className="profile-info-section-center">
              <h1 className="profile-name-large">{displayName || user.username}</h1>
              <p className="profile-email-large">{email || user.email}</p>
              <div className="profile-badges-row-center">
                <span className="profile-badge-main">
                  {t('level_badge', { level: userLevel }) || `Level ${userLevel}`}
                </span>
                <span className="profile-badge-secondary">{levelTitle}</span>
                <span className="profile-badge-tertiary">
                  {userXP.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>

          {/* Avatar Selection */}
          {isEditingAvatar && (
            <div className="profile-avatar-selector-card">
              <h3 className="profile-section-title">
                {t('profile_choose_avatar') || 'Choose your avatar'}
              </h3>
              <div className="profile-avatars-grid">
                {availableAvatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`profile-avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                    onClick={() => handleUpdateAvatar(avatar)}
                  >
                    <img src={avatar} alt={`Avatar ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats - Vertical Layout */}
          <div className="profile-stats-vertical">
            <div className="profile-stat-card-vertical">
              <div className="profile-stat-icon-wrapper">
                <img src="/img/icons/thunder.png" alt="XP" className="profile-stat-icon" />
              </div>
              <div className="profile-stat-content">
                <h3 className="profile-stat-value">{userXP.toLocaleString()}</h3>
                <p className="profile-stat-label">{t('stat_xp_label') || 'Total XP'}</p>
                <div className="profile-progress-bar">
                  <div 
                    className="profile-progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="profile-stat-note">
                  {xpToNextLevel} XP {t('profile_to_level') || 'to level'} {userLevel + 1}
                </span>
              </div>
            </div>

            <div className="profile-stat-card-vertical">
              <div className="profile-stat-icon-wrapper">
                <img src="/img/icons/trophy.png" alt="Lessons" className="profile-stat-icon" />
              </div>
              <div className="profile-stat-content">
                <h3 className="profile-stat-value">{lessonsCompleted}</h3>
                <p className="profile-stat-label">{t('profile_lessons_completed') || 'Lessons Completed'}</p>
              </div>
            </div>

            <div className="profile-stat-card-vertical">
              <div className="profile-stat-icon-wrapper">
                <img src="/img/icons/fire.png" alt="Level" className="profile-stat-icon" />
              </div>
              <div className="profile-stat-content">
                <h3 className="profile-stat-value">{userLevel}</h3>
                <p className="profile-stat-label">{t('level_badge', { level: userLevel }) || `Level ${userLevel}`}</p>
                <span className="profile-stat-note">{levelTitle}</span>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="profile-settings-card">
            <h3 className="profile-section-title">
              {t('profile_account_settings') || 'Account Settings'}
            </h3>
            <div className="profile-form">
              <div className="profile-form-group">
                <label className="profile-form-label">
                  {t('profile_display_name') || 'Display Name'}
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="profile-form-group">
                <label className="profile-form-label">
                  {t('profile_email') || 'Email'}
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className="btn btn-cta" onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? (t('profile_saving') || 'Saving...') : (t('profile_save_changes') || 'Save Changes')}
              </button>
              {statusMessage && (
                <p className={`profile-status-message ${statusMessage.type}`}>
                  {statusMessage.text}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="profile-actions-section">
            <h3 className="profile-section-title">
              {t('profile_quick_actions') || 'Quick Actions'}
            </h3>
            <div className="profile-actions-vertical">
              <button
                className="profile-action-btn-vertical"
                onClick={() => navigate('/progress')}
              >
                <img src="/img/icons/book.png" alt="Progress" />
                <span>{t('nav_progress') || 'View Progress'}</span>
              </button>
              <button
                className="profile-action-btn-vertical"
                onClick={() => navigate('/leaderboard')}
              >
                <img src="/img/icons/trophy.png" alt="Leaderboard" />
                <span>{t('nav_leaderboard') || 'Leaderboard'}</span>
              </button>
              <button
                className="profile-action-btn-vertical"
                onClick={() => navigate('/courses')}
              >
                <img src="/img/icons/book.png" alt="Courses" />
                <span>{t('nav_courses') || 'Courses'}</span>
              </button>
              <button
                className="profile-action-btn-vertical"
                onClick={() => navigate('/minigames')}
              >
                <img src="/img/icons/rocket.png" alt="Games" />
                <span>{t('nav_minigames') || 'Mini Games'}</span>
              </button>
              <button
                className="profile-action-btn-vertical"
                onClick={() => navigate('/LessonsHistory')}
              >
                <img src="/img/icons/book.png" alt="Lessons History" />
                <span>{t('nav_LessonsHistory') || 'Lessons History'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
