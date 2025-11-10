import React from "react";
import "../css/styles.css";
import  Header  from './BasicSiteView/Header/Header';
import Footer from './BasicSiteView/Footer/Footer';
const Home = () => {
  return (
    <div>
      <Header />

      <main>
        <section className="hero container" id="home">
          <div className="hero-content">
            <h1 className="hero-title">Learn coding like a game!</h1>
            <p className="hero-subtitle">Daily lessons, streaks, XP points and real-world projects</p>
            <a className="btn btn-cta" href="#get-started">Get Started Free</a>
          </div>

          <div className="hero-media">
            <div className="hero-card">
              <img src="/img/small_logo.png" alt="project preview" className="hero-image" />
            </div>
          </div>
        </section>

        {/* --- Stats Section --- */}
        <section className="stats-section container" aria-label="Quick user stats">
          <div className="stats-grid">

            {/* Streak */}
            <article className="stat-card" aria-labelledby="streak-title">
              <div className="stat-icon-wrap">
                <div className="stat-icon-circle">
                  <img src="/img/icons/fire.png" alt="" className="stat-icon-img" width="40" height="40" />
                  <span className="icon-ring"></span>
                </div>
              </div>
              <h3 id="streak-title" className="stat-title">7 days</h3>
              <p className="stat-subtitle">Streak 🔥</p>
            </article>

            {/* XP Points */}
            <article className="stat-card" aria-labelledby="xp-title">
              <div className="stat-icon-wrap">
                <div className="stat-icon-circle alt">
                  <img src="/img/icons/thunder.png" alt="" className="stat-icon-img" width="40" height="40" />
                </div>
              </div>

              <h3 id="xp-title" className="stat-title">1,240 XP</h3>
              <p className="stat-subtitle">Experience Points</p>

              <div className="progress-wrap" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="65">
                <div className="progress-fill" style={{ width: "65%" }}></div>
              </div>
              <p className="progress-note">To next level: 260 XP</p>
            </article>

            {/* Level */}
            <article className="stat-card" aria-labelledby="level-title">
              <div className="stat-icon-wrap">
                <div className="stat-icon-circle alt2">
                  <img src="/img/icons/trophy.png" alt="" className="stat-icon-img" width="40" height="40" />
                </div>
              </div>

              <div className="level-badge">Level 12</div>
              <h3 id="level-title" className="stat-title small">Junior Coder</h3>
            </article>
          </div>
        </section>

        {/* --- Languages Section --- */}
        <section className="languages-section container" aria-labelledby="languages-title">
          <div className="languages-header text-center">
            <h2 id="languages-title" className="languages-title">Choose your programming language</h2>
            <p className="languages-subtitle">Start your coding journey</p>
          </div>

          <div className="languages-grid" role="list">
            {/* Python */}
            <article className="language-card" role="listitem">
              <div className="card-bg-overlay"></div>
              <div className="language-icon bg-gradient-python">
                <img src="/img/icons/py.png" alt="" className="language-icon-img" width="28" height="28" />
              </div>
              <div className="card-body">
                <h3 className="lang-name">Python</h3>
                <p className="lang-desc">For beginners</p>
                <div className="lesson-row">
                  <span className="lesson-note">Lesson 5/30</span>
                  <span className="lesson-percent">17%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "17%" }}></div>
                </div>
                <a className="btn btn-continue" href="#python">Continue</a>
              </div>
            </article>

            {/* JavaScript */}
            <article className="language-card" role="listitem">
              <div className="card-bg-overlay"></div>
              <div className="language-icon bg-gradient-js">
                <img src="/img/icons/js.png" alt="" className="language-icon-img" width="40" height="40" />
              </div>
              <div className="card-body">
                <h3 className="lang-name">JavaScript</h3>
                <p className="lang-desc">Web development</p>
                <div className="lesson-row">
                  <span className="lesson-note">Lesson 12/30</span>
                  <span className="lesson-percent">40%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "10%" }}></div>
                </div>
                <a className="btn btn-continue" href="#javascript">Continue</a>
              </div>
            </article>

            {/* HTML / CSS */}
            <article className="language-card" role="listitem">
              <div className="card-bg-overlay"></div>
              <div className="language-icon bg-gradient-html">
                <img src="/img/icons/html_css.png" alt="" className="language-icon-img" width="28" height="28" />
              </div>
              <div className="card-body">
                <h3 className="lang-name">HTML/CSS</h3>
                <p className="lang-desc">Web basics</p>
                <div className="lesson-row">
                  <span className="lesson-note">Lesson 18/30</span>
                  <span className="lesson-percent">60%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "60%" }}></div>
                </div>
                <a className="btn btn-continue" href="#htmlcss">Continue</a>
              </div>
            </article>

            {/* Java */}
            <article className="language-card" role="listitem">
              <div className="card-bg-overlay"></div>
              <div className="language-icon bg-gradient-java">
                <img src="/img/icons/java.png" alt="" className="language-icon-img" width="28" height="28" />
              </div>
              <div className="card-body">
                <h3 className="lang-name">Java</h3>
                <p className="lang-desc">Enterprise development</p>
                <div className="lesson-row">
                  <span className="lesson-note">Lesson 3/30</span>
                  <span className="lesson-percent">10%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "10%" }}></div>
                </div>
                <a className="btn btn-continue" href="#java">Continue</a>
              </div>
            </article>
          </div>
        </section>

        {/* --- How Section --- */}
        <section id="how" className="how-section container" aria-labelledby="how-title">
          <div className="how-header">
            <h2 id="how-title" className="how-title">How it works</h2>
            <p className="how-sub">Three simple steps to success</p>
          </div>

          <div className="how-grid" role="list">
            <span className="how-line"></span>

            <article className="how-step" role="listitem">
              <span className="step-number">1</span>
              <div className="step-icon bg-gradient-book">
                <img src="/img/icons/book.png" alt="" className="step-icon-img" width="28" height="28" />
              </div>
              <h3 className="step-title">Short lessons</h3>
              <p className="step-desc">5–10 minutes a day — learn theory in small portions</p>
            </article>

            <article className="how-step" role="listitem">
              <span className="step-number">2</span>
              <div className="step-icon bg-gradient-code">
                <img src="/img/icons/IT.png" alt="" className="step-icon-img" width="28" height="28" />
              </div>
              <h3 className="step-title">Practice in browser</h3>
              <p className="step-desc">Write code right here — no installation required</p>
            </article>

            <article className="how-step" role="listitem">
              <span className="step-number">3</span>
              <div className="step-icon bg-gradient-rocket">
                <img src="/img/icons/rocket.png" alt="" className="step-icon-img" width="28" height="28" />
              </div>
              <h3 className="step-title">Real projects</h3>
              <p className="step-desc">Build real applications and add them to your portfolio</p>
            </article>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default Home;
