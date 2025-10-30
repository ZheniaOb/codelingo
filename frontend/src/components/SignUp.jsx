import React from "react";
import "../css/styles.css";

const SignUp = () => {
  return (
    <main className="login-page-wrapper">
      <div className="login-container">
        <header className="login-header">
          <img
            src="/img/big_logo.png"
            alt="Codelingo"
            className="login-logo"
          />
          <h1 className="title">Join Codelingo!</h1>
          <p className="subtitle">Start your coding adventure today</p>
        </header>

        <section className="login-card">
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-cta btn-full">
              Create Account
            </button>

            <footer className="form-footer">
              <p className="footer-text">
                Already have an account?{" "}
                <a href="/login" className="auth-link">
                  Log in
                </a>
              </p>
              <a href="/" className="btn btn-ghost">
                Back to home
              </a>
            </footer>
          </form>
        </section>
      </div>
    </main>
  );
};

export default SignUp;

