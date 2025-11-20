import React from "react";
import "../css/styles.css";
// Импорт для локализации
import { useTranslation } from 'react-i18next'; 
import Header from './BasicSiteView/Header/Header';
import Footer from './BasicSiteView/Footer/Footer';
function Home() {
  const { t } = useTranslation(); 

  return (
    <div>
      <Header />

      <main>
        <section className="hero container" id="home">
          <div className="hero-content">
            {/* ПЕРЕВОД: Learn coding like a game! */}
            <h1 className="hero-title">{t('hero_title')}</h1> 
            {/* ПЕРЕВОД: Daily lessons, streaks, XP points and real-world projects */}
            <p className="hero-subtitle">{t('hero_subtitle')}</p> 
            {/* ПЕРЕВОД: Get Started Free */}
            <a className="btn btn-cta" href="#get-started">{t('get_started_btn')}</a> 
          </div>

          <div className="hero-media">
            <div className="hero-card">
              <img src="/img/small_logo.png" alt="project preview" className="hero-image" />
            </div>
          </div>
        </section>
        <section className="stats-section container" aria-label={t('stats_aria_label')}> {/* ПЕРЕВОД: Quick user stats */}
          <div className="stats-grid">

            {/* Streak */}
            <article className="stat-card" aria-labelledby="streak-title">
              <div className="stat-icon-wrap">
                <div className="stat-icon-circle">
                  <img src="/img/icons/fire.png" alt="" className="stat-icon-img" width="40" height="40" />
                  <span className="icon-ring"></span>
                </div>
              </div>
              {/* NOTE: 7 days - это динамическое значение, но "Streak" переводим */}
              <h3 id="streak-title" className="stat-title">7 {t('days_unit')}</h3>
              <p className="stat-subtitle">{t('stat_streak_label')} 🔥</p>
            </article>

            {/* XP Points */}
            <article className="stat-card" aria-labelledby="xp-title">
              <div className="stat-icon-wrap">
                <div className="stat-icon-circle alt">
                  <img src="/img/icons/thunder.png" alt="" className="stat-icon-img" width="40" height="40" />
                </div>
              </div>

              <h3 id="xp-title" className="stat-title">1,240 XP</h3>
              {/* ПЕРЕВОД: Experience Points */}
              <p className="stat-subtitle">{t('stat_xp_label')}</p>

              <div className="progress-wrap" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="65">
                <div className="progress-fill" style={{ width: "65%" }}></div>
              </div>
              {/* ПЕРЕВОД: To next level: 260 XP */}
              <p className="progress-note">{t('to_next_level')}</p>
            </article>

            {/* Level */}
            <article className="stat-card" aria-labelledby="level-title">
              <div className="stat-icon-wrap">
                <div className="stat-icon-circle alt2">
                  <img src="/img/icons/trophy.png" alt="" className="stat-icon-img" width="40" height="40" />
                </div>
              </div>

              <div className="level-badge">{t('level_badge', { level: 12 })}</div> {/* ПЕРЕВОД: Level 12 */}
              {/* ПЕРЕВОД: Junior Coder */}
              <h3 id="level-title" className="stat-title small">{t('level_title')}</h3>
            </article>
          </div>
        </section>

        {/* --- Languages Section --- */}
        <section className="languages-section container" aria-labelledby="languages-title">
          <div className="languages-header text-center">
            {/* ПЕРЕВОД: Choose your programming language */}
            <h2 id="languages-title" className="languages-title">{t('languages_title')}</h2> 
            {/* ПЕРЕВОД: Start your coding journey */}
            <p className="languages-subtitle">{t('languages_subtitle')}</p>
          </div>

          <div className="languages-grid" role="list">
            {/* Python */}
            <article className="language-card" role="listitem">
              <div className="card-bg-overlay"></div>
              {/* ... Icons remain static ... */}
              <div className="card-body">
                <h3 className="lang-name">Python</h3>
                {/* ПЕРЕВОД: For beginners */}
                <p className="lang-desc">{t('lang_desc_beginner')}</p> 
                <div className="lesson-row">
                  {/* ПЕРЕВОД: Lesson 5/30 */}
                  <span className="lesson-note">{t('lesson_progress', { current: 5, total: 30 })}</span> 
                  <span className="lesson-percent">17%</span>
                </div>
                {/* ... Progress bar remains static ... */}
                {/* ПЕРЕВОД: Continue */}
                <a className="btn btn-continue" href="/courses/python">{t('continue_btn')}</a> 
              </div>
            </article>
            
            {/* JavaScript */}
            <article className="language-card" role="listitem">
               {/* ... */}
              <div className="card-body">
                <h3 className="lang-name">JavaScript</h3>
                {/* ПЕРЕВОД: Web development */}
                <p className="lang-desc">{t('lang_desc_webdev')}</p> 
                <div className="lesson-row">
                  <span className="lesson-note">{t('lesson_progress', { current: 12, total: 30 })}</span>
                  <span className="lesson-percent">40%</span>
                </div>
                {/* ... */}
                <a className="btn btn-continue" href="#javascript">{t('continue_btn')}</a> 
              </div>
            </article>

            {/* HTML / CSS */}
            <article className="language-card" role="listitem">
              {/* ... */}
              <div className="card-body">
                <h3 className="lang-name">HTML/CSS</h3>
                {/* ПЕРЕВОД: Web basics */}
                <p className="lang-desc">{t('lang_desc_webbasics')}</p> 
                <div className="lesson-row">
                  <span className="lesson-note">{t('lesson_progress', { current: 18, total: 30 })}</span>
                  <span className="lesson-percent">60%</span>
                </div>
                {/* ... */}
                <a className="btn btn-continue" href="#htmlcss">{t('continue_btn')}</a> 
              </div>
            </article>

            {/* Java */}
            <article className="language-card" role="listitem">
              {/* ... */}
              <div className="card-body">
                <h3 className="lang-name">Java</h3>
                {/* ПЕРЕВОД: Enterprise development */}
                <p className="lang-desc">{t('lang_desc_enterprise')}</p> 
                <div className="lesson-row">
                  <span className="lesson-note">{t('lesson_progress', { current: 3, total: 30 })}</span>
                  <span className="lesson-percent">10%</span>
                </div>
                {/* ... */}
                <a className="btn btn-continue" href="#java">{t('continue_btn')}</a> 
              </div>
            </article>
          </div>
        </section>

        {/* --- How Section --- */}
        <section id="how" className="how-section container" aria-labelledby="how-title">
          <div className="how-header">
            {/* ПЕРЕВОД: How it works */}
            <h2 id="how-title" className="how-title">{t('how_it_works_title')}</h2> 
            {/* ПЕРЕВОД: Three simple steps to success */}
            <p className="how-sub">{t('how_it_works_subtitle')}</p> 
          </div>

          <div className="how-grid" role="list">
            <span className="how-line"></span>

            <article className="how-step" role="listitem">
              <span className="step-number">1</span>
              {/* ... */}
              {/* ПЕРЕВОД: Short lessons */}
              <h3 className="step-title">{t('step_1_title')}</h3> 
              {/* ПЕРЕВОД: 5–10 minutes a day — learn theory in small portions */}
              <p className="step-desc">{t('step_1_desc')}</p> 
            </article>

            <article className="how-step" role="listitem">
              <span className="step-number">2</span>
              {/* ... */}
              {/* ПЕРЕВОД: Practice in browser */}
              <h3 className="step-title">{t('step_2_title')}</h3> 
              {/* ПЕРЕВОД: Write code right here — no installation required */}
              <p className="step-desc">{t('step_2_desc')}</p> 
            </article>

            <article className="how-step" role="listitem">
              <span className="step-number">3</span>
              {/* ... */}
              {/* ПЕРЕВОД: Real projects */}
              <h3 className="step-title">{t('step_3_title')}</h3> 
              {/* ПЕРЕВОД: Build real applications and add them to your portfolio */}
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