import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Footer from '../BasicSiteView/Footer/Footer';
import './LessonsHistory.css';

const API_URL = "http://localhost:5001/api";

export default function LessonsHistory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setHistory([]);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me/lessons-history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setHistory(data);

      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-page-wrapper">
        <main className="history-main container">
          <div className="loading-spinner"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page-wrapper">
        <main className="history-main container">
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-message">Error: {error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="history-page-wrapper">
      <main className="history-main container">
        <h1 className="history-title">{t('history_title') || 'Completed Lessons'}</h1>

        {/* --- JEŚLI NIE MA DANYCH (PUSTO) --- */}
        {!history || history.length === 0 ? (
          <div className="empty-history-state">
            <div className="empty-icon">📭</div>
            <h3 className="empty-title">{t('history_empty_title') || 'No completed lessons yet'}</h3>
            <p className="empty-description">
              Go to courses and finish your first lesson!
            </p>
            <button
              className="btn-start-learning"
              onClick={() => navigate('/courses')}
            >
              Start Learning
            </button>
          </div>
        ) : (
          /* --- TABELA Z WYNIKAMI --- */
          <div className="table-responsive">
            <table className="lessons-history-table">
              <thead>
                <tr>
                  <th>{t('history_header_lesson') || 'Lesson'}</th>
                  <th>{t('history_header_module') || 'Module'}</th>
                  <th>{t('history_header_language') || 'Language'}</th>
                  <th style={{ textAlign: 'right' }}>{t('history_header_date') || 'Date'}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index}>
                    <td>
                        <div style={{ fontWeight: '600' }}>{item.lesson_title}</div>
                    </td>
                    <td style={{ color: '#666' }}>{item.module_title}</td>
                    <td>
                        <span className="language-badge">{item.language_name}</span>
                    </td>
                    <td style={{ textAlign: 'right', color: '#666' }}>
                        {new Date(item.completed_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}