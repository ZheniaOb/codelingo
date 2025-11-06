// frontend/src/components/Progress.jsx

import React from 'react';
import { Link } from 'react-router-dom'; 
import "../css/styles.css"; 

// --- Данные ---
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
  // Используем ваши PNG иконки
  { iconPath: "/img/icons/fire.png", title: "Fire Streak", description: "7 day streak!", color: "#10B981" },
  { iconPath: "/img/icons/Sharpshooter.png", title: "Sharpshooter", description: "100% accuracy", color: "#34D399" }, // Предполагаю IT.png для Sharpshooter/Target
  { iconPath: "/img/icons/book.png", title: "Early Bird", description: "Learned before 9am", color: "#059669" }, // Предполагаю book.png для Early Bird/Award
];

// --- Вспомогательные компоненты (замена ShadCN/UI) ---
const StatCard = ({ children, className = '' }) => (
    <div className={`progress-card ${className}`}>{children}</div>
);

const CustomBadge = ({ children, className = '' }) => (
    <div className={`progress-badge ${className}`}>{children}</div>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const Progress = () => {
  // Расчет максимального XP для графика
  const maxXp = Math.max(...weeklyActivity.map((d) => d.xp));
  
  // Общая оболочка с шапкой и подвалом
  const HeaderFooter = ({ children }) => (
    <>
      {/* ⭐ ШАПКА/ХЕДЕР (СКОПИРОВАНО ИЗ home.jsx) */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <img src="/img/big_logo.png" alt="logo" className="brand-logo" />
            <span className="brand-title">Codelingo</span>
          </div>
          <nav className="main-nav" aria-label="Main navigation">
            <ul className="nav-list">
             <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li> 
             <li className="nav-item"><Link className="nav-link" to="/courses">Courses</Link></li>
             <li className="nav-item"><Link className="nav-link" to="/progress">Progress</Link></li>
             <li className="nav-item"><Link className="nav-link" to="/leaderboard">Leaderboard</Link></li>
            </ul>
          </nav>
          <div className="auth-controls">
            <Link className="auth-link" to="/login">Log In</Link>
            <Link className="btn btn-primary" to="/signup">Sign Up</Link>
          </div>
        </div>
      </header>

      <main className="progress-page-wrapper">
        {children}
      </main>

      {/* ⭐ ФУТЕР (СКОПИРОВАНО ИЗ home.jsx) */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand-row">
                <img src="/img/small_logo.png" alt="Codelingo" className="footer-logo" />
                <span className="footer-brand-title">Codelingo</span>
              </div>
              <p className="footer-desc">Learn programming in a fun and effective way. Every day brings you closer to your dream of becoming a developer.</p>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-links"><li><a href="#" className="footer-link">About</a></li><li><a href="#" className="footer-link">Blog</a></li></ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Support</h4>
              <ul className="footer-links"><li><a href="#" className="footer-link">Help</a></li><li><a href="#" className="footer-link">Contact</a></li></ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">© 2025 Codelingo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );


  return (
    <HeaderFooter>
      <div className="progress-container container">
        <h1 className="progress-title">Your Progress</h1>
        
        {/* Stats Grid */}
        <div className="stats-grid">
          
          {/* Streak Card */}
          <StatCard>
            {/* Использование PNG иконки fire.png */}
            <div className="icon-wrapper" style={{ backgroundImage: 'linear-gradient(to bottom right, #10B981, #059669)' }}>
              <img src="/img/icons/fire.png" alt="Streak" className="w-10 h-10 progress-icon" /> 
            </div>
            <h3 className="stat-value">7 Days</h3>
            <p className="stat-label">Current Streak</p>
            <CustomBadge>Record: 15 days</CustomBadge>
          </StatCard>

          {/* XP Card */}
          <StatCard>
            {/* Использование PNG иконки thunder.png */}
            <div className="icon-wrapper" style={{ backgroundImage: 'linear-gradient(to bottom right, #34D399, #10B981)' }}>
              <img src="/img/icons/thunder.png" alt="XP" className="w-10 h-10 progress-icon" />
            </div>
            <h3 className="stat-value">1,240 XP</h3>
            <p className="stat-label">Total Experience</p>
            
            {/* Progress Bar */}
            <div className="custom-progress-bar">
                <div className="custom-progress-fill" style={{ width: '65%' }}></div>
            </div>
            <p className="level-info">260 XP to Level 13</p>
          </StatCard>

          {/* Level Card */}
          <StatCard>
            {/* Использование PNG иконки trophy.png */}
            <div className="icon-wrapper" style={{ backgroundImage: 'linear-gradient(to bottom right, #10B981, #059669)' }}>
              <img src="/img/icons/trophy.png" alt="Trophy" className="w-10 h-10 progress-icon" />
            </div>
            <CustomBadge>Level 12</CustomBadge>
            <h3 className="stat-value" style={{ fontSize: '20px' }}>Junior Coder</h3>
            <p className="level-info">Next: Mid Coder</p>
          </StatCard>
        </div>

        {/* Weekly Activity */}
        <StatCard className="weekly-activity-card">
            <div className="activity-header">
              {/* Использование иконки calendar, если есть, или эмодзи */}
              <span className="icon" role="img" aria-label="Calendar" style={{ color: '#10B981', fontSize: '24px' }}>📅</span>
              <h2 className="text-2xl" style={{ fontWeight: '600', color: '#08121a' }}>Weekly Activity</h2>
            </div>
            <div className="activity-chart">
                {weeklyActivity.map((day) => (
                    <div
                        key={day.day}
                        className="chart-bar-container"
                    >
                        {/* Вычисляем высоту бара на основе XP */}
                        <div 
                            className="chart-bar" 
                            style={{ height: `${(day.xp / maxXp) * 100}%` }}
                        />
                        <span className="chart-day">{day.day}</span>
                        <span className="chart-xp">{day.xp} XP</span>
                    </div>
                ))}
            </div>
        </StatCard>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl mb-6" style={{ fontWeight: '600', color: '#08121a', marginTop: '40px' }}>Recent Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <StatCard key={achievement.title}>
                <div
                  className="achievement-icon-wrapper"
                  style={{ backgroundColor: achievement.color }}
                >
                  {/* Использование PNG иконки для достижений */}
                  <img src={achievement.iconPath} alt={achievement.title} className="w-8 h-8 achievement-icon-img-small" />
                </div>
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-desc">{achievement.description}</p>
              </StatCard>
            ))}
          </div>
        </div>
      </div>
    </HeaderFooter>
  );
};

export default Progress;