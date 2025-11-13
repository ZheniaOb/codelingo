import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../BasicSiteView/Header/Header';
import Footer from '../BasicSiteView/Footer/Footer';
import '../../css/styles.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:5001/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          // upewniamy się, że data.users istnieje i jest tablicą
          setUsers(Array.isArray(data.users) ? data.users : []);
        } else {
          setError(data.error || "Failed to fetch users");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBack = () => {
    navigate(-1); // cofa o jeden poziom w historii (czyli do panelu admina)
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ margin: 0 }}>Manage Users</h2>
          <button
            onClick={handleBack}
            className="btn btn-ghost"
            style={{ padding: '0.6rem 1.2rem', fontSize: '1rem' }}
          >
            ← Back
          </button>
        </div>

        {loading && <p>Loading users...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          users.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>ID</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Email</th>
                  <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{u.id}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{u.email}</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ManageUsers;
