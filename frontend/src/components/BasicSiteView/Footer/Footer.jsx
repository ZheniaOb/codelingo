import React from 'react';
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="brand-row">
                  <img src="/img/small_logo.png" alt="Codelingo" className="footer-logo" />
                  <span className="footer-brand-title">Codelingo</span>
                </div>
                <p className="footer-desc">
                  Learn programming in a fun and effective way. Every day brings you closer to your dream of becoming a developer.
                </p>
              </div>

              <div className="footer-col">
                <h4 className="footer-col-title">Company</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">About</a></li>
                  <li><a href="#" className="footer-link">Blog</a></li>
                  <li><a href="#" className="footer-link">Careers</a></li>
                  <li><a href="#" className="footer-link">Press</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4 className="footer-col-title">Support</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">Help</a></li>
                  <li><a href="#" className="footer-link">Contact</a></li>
                  <li><a href="#" className="footer-link">FAQ</a></li>
                  <li><a href="#" className="footer-link">Community</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="copyright">© 2025 Codelingo. All rights reserved.</p>
              <div className="social-row">
                <a href="#" className="social-link">
                  <img src="/img/icons/facebook.png" alt="" className="social-img" width="18" height="18" />
                </a>
                <a href="#" className="social-link">
                  <img src="/img/icons/twitter.png" alt="" className="social-img" width="18" height="18" />
                </a>
                <a href="#" className="social-link">
                  <img src="/img/icons/instagram.png" alt="" className="social-img" width="18" height="18" />
                </a>
                <a href="#" className="social-link">
                  <img src="/img/icons/youtube.png" alt="" className="social-img" width="18" height="18" />
                </a>
              </div>
            </div>
          </div>
        </footer>
    )
}

export default Footer;