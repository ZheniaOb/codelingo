import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/styles.css"; // Оставил оригинальный путь

const SignUp = () => {
  const navigate = useNavigate();

  // --- НАЧАЛО ЛОГИКИ ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const secretCode = formData.name.toLowerCase() === 'admin' ? 'MY_ADMIN_SECRET' : undefined;

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          secret_code: secretCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsError(false);
        setMessage(`Success! Registered as ${data.role}. Redirecting to login...`);
        setFormData({ name: "", email: "", password: "" });

        // redirect to login page after short delay
        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } else {
        setIsError(true);
        setMessage(data.error || "Registration failed.");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Network error. Is the backend running on port 5001?");
    }
  };
  // --- КОНЕЦ ЛОГИКИ ---

  return (
    <main className="login-page-wrapper">
      <div className="login-container">
        <header className="login-header">
          <img src="/img/big_logo.png" alt="Codelingo" className="login-logo" />
          <h1 className="title">Join Codelingo!</h1>
          <p className="subtitle">Start your coding adventure today</p>
        </header>

        <section className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            {message && (
              <div style={{
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
                fontWeight: 500,
                backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
                color: isError ? '#b91c1c' : '#166534',
                marginBottom: '1rem'
              }}>
                {message}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">Name (Type 'admin' for admin role)</label>
              <div className="input-wrapper">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <input type="text" id="name" name="name" placeholder="Your name" className="input-field" required value={formData.name} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-wrapper">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                <input type="email" id="email" name="email" placeholder="your@email.com" className="input-field" required value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input type="password" id="password" name="password" placeholder="••••••••" className="input-field" required value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn btn-cta btn-full">Create Account</button>

            <footer className="form-footer">
              <p className="footer-text">Already have an account? <a href="/login" className="auth-link">Log in</a></p>
              <a href="/" className="btn btn-ghost">Back to home</a>
            </footer>
          </form>
        </section>
      </div>
    </main>
  );
};

export default SignUp;
