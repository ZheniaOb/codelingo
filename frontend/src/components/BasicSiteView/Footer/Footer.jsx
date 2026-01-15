import React from 'react';
import "./Footer.css";
import { useTranslation } from 'react-i18next'; 

const Footer = () => {
    const { t } = useTranslation(); 

    return (
        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="brand-row">
                  <img src="/img/small_logo.png" alt="Codelingo" className="footer-logo" />
                  <span className="brand-title">Codelingo</span>
                </div>
                {/* TŁUMACZENIE: Opis */}
                <p className="footer-desc">
                  {t('footer_desc')}
                </p>
              </div>

              <div className="footer-col">
                {/* TŁUMACZENIE: Firma */}
                <h4 className="footer-col-title">{t('footer_company_title')}</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">{t('footer_link_about')}</a></li>
                  <li><a href="#" className="footer-link">{t('footer_link_blog')}</a></li>
                  <li><a href="#" className="footer-link">{t('footer_link_careers')}</a></li>
                  <li><a href="#" className="footer-link">{t('footer_link_press')}</a></li>
                </ul>
              </div>

              <div className="footer-col">
                {/* TŁUMACZENIE: Wsparcie */}
                <h4 className="footer-col-title">{t('footer_support_title')}</h4>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">{t('footer_link_help')}</a></li>
                  <li><a href="#" className="footer-link">{t('footer_link_contact')}</a></li>
                  <li><a href="#" className="footer-link">{t('footer_link_faq')}</a></li>
                  <li><a href="#" className="footer-link">{t('footer_link_community')}</a></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              {/* TŁUMACZENIE: Prawa autorskie */}
              <p className="copyright">{t('footer_copyright')}</p>
              <div className="social-row">
                {/* Ikony społecznościowe pozostają bez tłumaczenia */}
                <a href="#" className="social-link">
                  <img src="/img/icons/facebook.png" alt="Facebook" className="social-img" width="18" height="18" />
                </a>
                <a href="#" className="social-link">
                  <img src="/img/icons/twitter.png" alt="Twitter" className="social-img" width="18" height="18" />
                </a>
                <a href="#" className="social-link">
                  <img src="/img/icons/instagram.png" alt="Instagram" className="social-img" width="18" height="18" />
                </a>
                <a href="#" className="social-link">
                  <img src="/img/icons/youtube.png" alt="YouTube" className="social-img" width="18" height="18" />
                </a>
              </div>
            </div>
          </div>
        </footer>
    )
}

export default Footer;