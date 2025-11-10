import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import '../../../css/styles.css'

const Header = () => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" >
          <img src="/img/big_logo.png" alt="logo" className="brand-logo" />
          <span className="brand-title">Codelingo</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <Link className="nav-link" to="/courses">Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/progress">Progress</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
            </li>
          </ul>
        </nav>

        <div className="auth-controls">
          <Link className="auth-link" to="/login">Log In</Link>
          <Link className="btn btn-primary" to="/signup">Sign Up</Link>
        </div>
      </div>
    </header>
  )
}

export default Header;