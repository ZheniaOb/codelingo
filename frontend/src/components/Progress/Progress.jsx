import React, { useState, useEffect } from 'react';
import "./Progress.css";
import Footer from '../BasicSiteView/Footer/Footer';
import { useTranslation } from 'react-i18next';

const API_URL = "http://localhost:5001/api";

const weeklyActivity = [
  { day: "Mon", xp: 50 },
  { day: "Tue", xp: 30 },
  { day: "Wed", xp: 45 },
  { day: "Thu", xp: 60 },
  { day: "Fri", xp: 40 },
  { day: "Sat", xp: 55 },
  { day: "Sun", xp: 35 },
];

const achievements = [
  { iconPath: "/img/icons/fire.png", titleKey: "achievement_fire_title", descriptionKey: "achievement_fire_desc", color: "#10B981" },
  { iconPath: "/img/icons/Sharpshooter.png", titleKey: "achievement_sharp_title", descriptionKey: "achievement_sharp_desc", color: "#34D399" },
  { iconPath: "/img/icons/book.png", titleKey: "achievement_early_title", descriptionKey: "achievement_early_desc", color: "#059669" },
];

const StatCard = ({ children, className = '' }) => (
    <div className={`progress-card ${className}`}>{children}</div>
);

const CustomBadge = ({ children, className = '' }) => (
    <div className={`progress-badge ${className}`}>{children}</div>
);

const Progress = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const maxXp = Math.max(...weeklyActivity.map((d) => d.xp));

  const HeaderFooter = ({ children }) => (
    <>
      <main className="progress-page-wrapper">
        {children}
      </main>
      <Footer />
    </>
  );

  if (loading) {
    return (
      <HeaderFooter>
        <div className="progress-container container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
           <div className="loading-spinner"></div>
        </div>
      </HeaderFooter>
    );
  }

  const currentXP = userData?.xp || 0;
  const currentLevel = userData?.level || 1;
  const levelTitle = userData?.level_title || "Beginner";
  const nextLevelTitle = userData?.next_level_title || "Next Level";
  const xpToNextLevel = userData?.xp_to_next_level || 100;
  const progressPercent = userData?.progress_percentage || 0;
  const currentStreak = userData?.streak || 0;

  return (
    <HeaderFooter>
      <div className="progress-container container">
        <h1 className="progress-title">{t('progress_title')}</h1>

        <div className="stats-grid">

          <StatCard>
            <div className="icon-wrapper" style={{ backgroundImage: 'linear-gradient(to bottom right, #10B981, #059669)' }}>
              <img src="/img/icons/fire.png" alt="Streak" className="w-10 h-10 progress-icon" />
            </div>
            <h3 className="stat-value">{currentStreak} {t('days_unit')}</h3>
            <p className="stat-label">{t('progress_current_streak')}</p>
            <CustomBadge>{t('progress_record', { value: 15 })}</CustomBadge>
          </StatCard>

          <StatCard>
            <div className="icon-wrapper" style={{ backgroundImage: 'linear-gradient(to bottom right, #34D399, #10B981)' }}>
              <img src="/img/icons/thunder.png" alt="XP" className="w-10 h-10 progress-icon" />
            </div>
            <h3 className="stat-value">{currentXP.toLocaleString()} XP</h3>
            <p className="stat-label">{t('progress_total_experience')}</p>

            <div className="custom-progress-bar">
                <div className="custom-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="level-info">{t('progress_to_next_level', { xp: xpToNextLevel, level: currentLevel + 1 })}</p>
          </StatCard>

          <StatCard>
            <div className="icon-wrapper" style={{ backgroundImage: 'linear-gradient(to bottom right, #10B981, #059669)' }}>
              <img src="/img/icons/trophy.png" alt="Trophy" className="w-10 h-10 progress-icon" />
            </div>
            <CustomBadge>{t('progress_level_badge', { level: currentLevel })}</CustomBadge>
            <h3 className="stat-value" style={{ fontSize: '20px' }}>{levelTitle}</h3>
            <p className="level-info">{nextLevelTitle}</p>
          </StatCard>
        </div>

        <StatCard className="weekly-activity-card">
            <div className="activity-header">
              <span className="icon" role="img" aria-label="Calendar" style={{ color: '#10B981', fontSize: '24px' }}>📅</span>
              <h2 className="text-2xl" style={{ fontWeight: '600', color: '#08121a' }}>{t('progress_weekly_activity')}</h2>
            </div>
            <div className="activity-chart">
                {weeklyActivity.map((day) => (
                    <div key={day.day} className="chart-bar-container">
                        <div
                            className="chart-bar"
                            style={{ height: `${(day.xp / maxXp) * 100}%` }}
                        />
                        <span className="chart-day">{t(`day_${day.day.toLowerCase()}`)}</span>
                        <span className="chart-xp">{day.xp} XP</span>
                    </div>
                ))}
            </div>
        </StatCard>

        <div>
          <h2 className="text-2xl mb-6" style={{ fontWeight: '600', color: '#08121a', marginTop: '40px' }}>{t('progress_recent_achievements')}</h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <StatCard key={achievement.titleKey}>
                <div className="achievement-icon-wrapper" style={{ backgroundColor: achievement.color }}>
                  <img src={achievement.iconPath} alt={t(achievement.titleKey)} className="w-8 h-8 achievement-icon-img-small" />
                </div>
                <h3 className="achievement-title">{t(achievement.titleKey)}</h3>
                <p className="achievement-desc">{t(achievement.descriptionKey)}</p>
              </StatCard>
            ))}
          </div>
        </div>
      </div>
    </HeaderFooter>
  );
};

export default Progress;