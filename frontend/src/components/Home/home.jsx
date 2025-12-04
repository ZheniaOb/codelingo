import React, { useState, useEffect } from "react";
import "../Home/Home.css";
import { useTranslation } from 'react-i18next';
import Footer from '../BasicSiteView/Footer/Footer';

const API_URL = "http://localhost:5001/api";

const getRobotImageSrc = (theme) => {
  if (theme === 'pink') {
    return "/img/avatar/pink.png";
  }
  if (theme === 'dark') {
    return "/img/avatar/black.png";
  }
  return "/img/small_logo.png";
};

const getRobotContainerStyle = (theme) => {
  const baseStyle = { transition: 'filter 0.5s ease, background-color 0.5s ease' };
  const transparentBackground = { backgroundColor: 'transparent' };

  // Здесь может быть дополнительная логика фильтрации, но мы оставим ее чистой
  return { ...baseStyle, ...transparentBackground };
};


function Home({ theme, toggleTheme }) {
  const { t } = useTranslation();
  const robotSrc = getRobotImageSrc(theme);
  const robotStyle = getRobotContainerStyle(theme);

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_URL}/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserData();
  }, []);

  const currentXP = userData?.xp || 0;
  const currentLevel = userData?.level || 1;
  const levelTitle = userData?.level_title || t('level_title') || "Beginner";
  const xpToNextLevel = userData?.xp_to_next_level || 100;
  const progressPercent = userData?.progress_percentage || 0;
  const currentStreak = userData?.streak || 0;

  return (
    <div>

      <main>
        <section className="hero container" id="home">
          <div className="hero-content">
            <h1 className="hero-title">{t('hero_title')}</h1>
            <p className="hero-subtitle">{t('hero_subtitle')}</p>
            <a className="btn btn-cta" href="#get-started">{t('get_started_btn')}</a >
          </div>

          <div className="hero-media">
            <div
              className="hero-card"
              style={robotStyle}
            >
              <img
                src={robotSrc}
                alt="project preview"
                className="hero-image"
              />
            </div>
          </div>
        </section>
        <section className="stats-section container" aria-label={t('stats_aria_label')}>
          <div className="stats-grid">
            <article className="stat-card" aria-labelledby="streak-title">
              <div className="stat-icon-wrap">
                <div className="stat-icon-circle">
                  <img src="/img/icons/fire.png" alt="" className="stat-icon-img" width="40" height="40" />
                  <span className="icon-ring"></span>
                </div>
              </div>
                <h3 id="streak-title" className="stat-title">7 {t('days_unit')}</h3>
                <p className="stat-subtitle">{t('stat_streak_label')} 🔥</p>
            </article>

            <article className="stat-card" aria-labelledby="xp-title">
              <div className="stat-icon-wrap">
                <div className="stat-icon-circle alt">
                  <img src="/img/icons/thunder.png" alt="" className="stat-icon-img" width="40" height="40" />
                </div>
              </div>

              <h3 id="xp-title" className="stat-title">{currentXP.toLocaleString()} XP</h3>
              <p className="stat-subtitle">{t('stat_xp_label')}</p>

              <div className="progress-wrap" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressPercent}>
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="progress-note">{xpToNextLevel} XP {t('to_next_level')}</p>
            </article>

            <article className="stat-card" aria-labelledby="level-title">
              <div className="stat-icon-wrap">
                <div className="stat-icon-circle alt2">
                  <img src="/img/icons/trophy.png" alt="" className="stat-icon-img" width="40" height="40" />
                </div>
              </div>

              <div className="level-badge">{t('level_badge', { level: currentLevel })}</div>
              <h3 id="level-title" className="stat-title small">{levelTitle}</h3>
            </article>
          </div>
        </section>

        <section className="languages-section container" aria-labelledby="languages-title">
          <div className="languages-header text-center">
            <h2 id="languages-title" className="languages-title">{t('languages_title')}</h2>
            <p className="languages-subtitle">{t('languages_subtitle')}</p>
          </div>

          <div className="languages-grid" role="list">
            <article className="language-card" role="listitem">
              <div className="card-bg-overlay"></div>
              <div className="language-icon bg-gradient-python">
                <img src="/img/icons/py.png" alt="Python icon" className="language-icon-img" width="28" height="28" />
              </div>
              <div className="card-body">
                <h3 className="lang-name">Python</h3>
                <p className="lang-desc">{t('lang_desc_beginner')}</p>
                <div className="lesson-row">
                  <span className="lesson-note">{t('lesson_progress', { current: 5, total: 30 })}</span>
                  <span className="lesson-percent">17%</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-fill" style={{ width: "17%" }}></div>
                </div>
                <a className="btn btn-continue" href="/courses/python">{t('continue_btn')}</a>
              </div>
            </article>
            <article className="language-card" role="listitem">
              <div className="card-bg-overlay"></div>
              <div className="language-icon bg-gradient-js">
                <img src="/img/icons/js.png" alt="JavaScript icon" className="language-icon-img" width="40" height="40" />
              </div>
              <div className="card-body">
                <h3 className="lang-name">JavaScript</h3>
                <p className="lang-desc">{t('lang_desc_webdev')}</p>
                <div className="lesson-row">
                  <span className="lesson-note">{t('lesson_progress', { current: 12, total: 30 })}</span>
                  <span className="lesson-percent">40%</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-fill" style={{ width: "40%" }}></div>
                </div>
                <a className="btn btn-continue" href="#javascript">{t('continue_btn')}</a>
              </div>
            </article>

            <article className="language-card" role="listitem">
              <div className="card-bg-overlay"></div>
              <div className="language-icon bg-gradient-html">
                <img src="/img/icons/html_css.png" alt="HTML/CSS icon" className="language-icon-img" width="28" height="28" />
              </div>
              <div className="card-body">
                <h3 className="lang-name">HTML/CSS</h3>
                <p className="lang-desc">{t('lang_desc_webbasics')}</p>
                <div className="lesson-row">
                  <span className="lesson-note">{t('lesson_progress', { current: 18, total: 30 })}</span>
                  <span className="lesson-percent">60%</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-fill" style={{ width: "60%" }}></div>
                </div>
                <a className="btn btn-continue" href="#htmlcss">{t('continue_btn')}</a>
              </div>
            </article>
            <article className="language-card" role="listitem">
              <div className="card-bg-overlay"></div>
              <div className="language-icon bg-gradient-java">
                <img src="/img/icons/java.png" alt="Java icon" className="language-icon-img" width="28" height="28" />
              </div>
              <div className="card-body">
                <h3 className="lang-name">Java</h3>
                <p className="lang-desc">{t('lang_desc_enterprise')}</p>
                <div className="lesson-row">
                  <span className="lesson-note">{t('lesson_progress', { current: 3, total: 30 })}</span>
                  <span className="lesson-percent">10%</span>
                </div>
                <div className="progress-wrap">
                  <div className="progress-fill" style={{ width: "10%" }}></div>
                </div>
                <a className="btn btn-continue" href="#java">{t('continue_btn')}</a>
              </div>
            </article>
          </div>
        </section>

        <section id="how" className="how-section container" aria-labelledby="how-title">
          <div className="how-header">
            <h2 id="how-title" className="how-title">{t('how_it_works_title')}</h2>
            <p className="how-sub">{t('how_it_works_subtitle')}</p>
          </div>

          <div className="how-grid" role="list">
            <span className="how-line"></span>

            <article className="how-step" role="listitem">
              <span className="step-number">1</span>
              <h3 className="step-title">{t('step_1_title')}</h3>
              <p className="step-desc">{t('step_1_desc')}</p>
            </article>

            <article className="how-step" role="listitem">
              <span className="step-number">2</span>
              <h3 className="step-title">{t('step_2_title')}</h3>
              <p className="step-desc">{t('step_2_desc')}</p>
            </article>

            <article className="how-step" role="listitem">
              <span className="step-number">3</span>
              <h3 className="step-title">{t('step_3_title')}</h3>
              <p className="step-desc">{t('step_3_desc')}</p>
            </article>
          </div>
        </section>
      <Footer />
      </main>
    </div>
  );
}

export default Home;