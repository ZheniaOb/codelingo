import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './BasicSiteView/Footer/Footer';
import '../css/styles.css';

const Admin_Panel = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Panel</h1>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>
            Manage users, lessons and games from here
          </p>
        </section>

        <section
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link
            to="/admin_panel/manage_users"
            style={{
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              minWidth: '200px',
              textAlign: 'center',
            }}
            className="btn btn-cta"
          >
            Manage Users
          </Link>

          <Link
            to="/admin_panel/manage_lessons"
            style={{
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              minWidth: '200px',
              textAlign: 'center',
            }}
            className="btn btn-cta"
          >
            Manage Lessons
          </Link>

          <Link
            to="/admin_panel/manage_games"
            style={{
              padding: '1.5rem 2rem',
              fontSize: '1.2rem',
              minWidth: '200px',
              textAlign: 'center',
            }}
            className="btn btn-cta"
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
