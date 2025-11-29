import React from 'react'; 
import "../css/styles.css"; 
import Header from './BasicSiteView/Header/Header';
import Footer from './BasicSiteView/Footer/Footer';
import { useTranslation } from 'react-i18next';

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
  const maxXp = Math.max(...weeklyActivity.map((d) => d.xp));
  const HeaderFooter = ({ children }) => (
    <>
      <Header />
      <main className="progress-page-wrapper">
        {children}
      </main>
      <Footer />
    </>
  );

  return (
    <HeaderFooter>
      <div className="progress-container container">
        <h1 className="progress-title">{t('progress_title')}</h1>
        
        <div className="stats-grid">

          <StatCard>
            <div className="icon-wrapper" style={{ backgroundImage: 'linear-gradient(to bottom right, #10B981, #059669)' }}>
              <img src="/img/icons/fire.png" alt="Streak" className="w-10 h-10 progress-icon" /> 
            </div>
            <h3 className="stat-value">7 {t('days_unit')}</h3>
            <p className="stat-label">{t('progress_current_streak')}</p>
            <CustomBadge>{t('progress_record', { value: 15 })}</CustomBadge>
          </StatCard>

          <StatCard>
            <div className="icon-wrapper" style={{ backgroundImage: 'linear-gradient(to bottom right, #34D399, #10B981)' }}>
              <img src="/img/icons/thunder.png" alt="XP" className="w-10 h-10 progress-icon" />
            </div>
            <h3 className="stat-value">1,240 XP</h3>
            <p className="stat-label">{t('progress_total_experience')}</p>
            
            <div className="custom-progress-bar">
                <div className="custom-progress-fill" style={{ width: '65%' }}></div>
            </div>
            <p className="level-info">{t('progress_to_next_level', { xp: 260, level: 13 })}</p>
          </StatCard>

          <StatCard>
            <div className="icon-wrapper" style={{ backgroundImage: 'linear-gradient(to bottom right, #10B981, #059669)' }}>
              <img src="/img/icons/trophy.png" alt="Trophy" className="w-10 h-10 progress-icon" />
            </div>
            <CustomBadge>{t('progress_level_badge', { level: 12 })}</CustomBadge>
            <h3 className="stat-value" style={{ fontSize: '20px' }}>{t('progress_level_title_junior')}</h3>
            <p className="level-info">{t('progress_next_level_title')}</p>
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
