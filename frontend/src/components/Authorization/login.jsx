import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Authorization.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", formData.email);

        navigate("/");
        window.location.reload();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Is the backend running on port 5001?");
    }
  };

  return (
    <main className="login-page-wrapper">
      <div className="login-container">
        <header className="login-header">
          <div className="brand">
            <img src="/img/big_logo.png" alt="Codelingo" className="login-logo" />
          </div>
          <h1 className="title">Welcome back!</h1>
          <p className="subtitle">Continue your coding journey</p>
        </header>

        <section className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-wrapper">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-cta btn-full">Log In</button>

            <footer className="form-footer">
              <p className="footer-text">
                Don't have an account? <a href="/signup" className="auth-link">Sign up</a>
              </p>
              <a href="/" className="btn btn-ghost">Back to home</a>
            </footer>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
