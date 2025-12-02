import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../BasicSiteView/Footer/Footer';
import './AdminPanel.css';

const Admin_Panel = () => {
  return (
    <div className="admin-page">

      <main className="admin-main">
        <section className="admin-header">
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-subtitle">
            Manage users, lessons and games from here
          </p>
        </section>

        <section className="admin-actions">
          <Link
            to="/admin_panel/manage_users"
            className="btn btn-cta admin-link"
          >
            Manage Users
          </Link>

          <Link
            to="/admin_panel/manage_lessons"
            className="btn btn-cta admin-link"
          >
            Manage Lessons
          </Link>

          <Link
            to="/admin_panel/manage_games"
            className="btn btn-cta admin-link"
          >
            Manage Games
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Admin_Panel;
