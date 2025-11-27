
import React, { useEffect, useMemo, useState } from 'react'; 
import "../css/styles.css"; 
import Header from './BasicSiteView/Header/Header';
import Footer from './BasicSiteView/Footer/Footer';

const CustomBadge = ({ children, style = {} }) => (
  <div className="podium-badge" style={style}>{children}</div>
);

const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  try {
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) {
      return null;
    }

    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem('token');
      return null;
    }
    return payload.user_id || payload.sub || null;
  } catch (error) {
    console.error('Failed to parse token for leaderboard highlight:', error);
    return null;
  }
};

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUserId = useMemo(() => getCurrentUserId(), []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5001/api/leaderboard?limit=20');
        if (!response.ok) {
          throw new Error('Failed to load leaderboard');
        }
        const data = await response.json();
        const normalized = data.map((entry) => ({
          ...entry,
          isUser: currentUserId != null && entry.id === currentUserId,
        }));
        setLeaders(normalized);
      } catch (err) {
        setError(err.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUserId]);

  const HeaderFooter = ({ children }) => (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );

  const podiumUsers = leaders.slice(0, 3);
  const podiumLayout = useMemo(() => {
    if (podiumUsers.length === 0) return [];
    if (podiumUsers.length === 1) return [podiumUsers[0]];
    if (podiumUsers.length === 2) return [podiumUsers[1], podiumUsers[0]];
    return [podiumUsers[1], podiumUsers[0], podiumUsers[2]];
  }, [podiumUsers]);

  const getRankClasses = (rank) => {
    switch (rank) {
      case 1:
        return {
          itemClass: 'podium-item-1st',
          avatarClass: 'podium-avatar-1st avatar-gold',
          baseClass: 'podium-base-1st base-gold',
          iconClass: 'rank-icon-1st icon-gold',
          iconSrc: '/img/icons/victory_trophy.png',
          iconAlt: 'Trophy',
        };
      case 2:
        return {
          itemClass: '',
          avatarClass: 'podium-avatar avatar-silver',
          baseClass: 'podium-base base-silver',
          iconClass: 'rank-icon icon-silver',
          iconSrc: '/img/icons/medal.png',
          iconAlt: 'Medal',
        };
      case 3:
        return {
          itemClass: '',
          avatarClass: 'podium-avatar avatar-bronze',
          baseClass: 'podium-base base-bronze',
          iconClass: 'rank-icon icon-bronze',
          iconSrc: '/img/icons/award.png',
          iconAlt: 'Award',
        };
      default:
        return {
          itemClass: '',
          avatarClass: 'podium-avatar avatar-silver',
          baseClass: 'podium-base base-silver',
          iconClass: 'rank-icon icon-silver',
          iconSrc: '/img/icons/medal.png',
          iconAlt: 'Medal',
        };
    }
  };

  const renderAvatarContent = (user) => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.username} />;
    }
    return user.initials || user.username?.slice(0, 2).toUpperCase() || '??';
  };

  if (loading) {
    return (
      <HeaderFooter>
        <div className="leaderboard-container container text-center">
          <p>Loading leaderboard...</p>
        </div>
      </HeaderFooter>
    );
  }

  if (error) {
    return (
      <HeaderFooter>
        <div className="leaderboard-container container text-center">
          <p>{error}</p>
        </div>
      </HeaderFooter>
    );
  }

  if (leaders.length === 0) {
    return (
      <HeaderFooter>
        <div className="leaderboard-container container text-center">
          <p>No leaderboard data available yet.</p>
        </div>
      </HeaderFooter>
    );
  }

  return (
    <HeaderFooter>
      <div className="leaderboard-container container">
        <div className="text-center">
          <h1 className="leaderboard-title">Leaderboard</h1>
          <p className="leaderboard-subtitle">Compete with learners worldwide</p>
        </div>

        {podiumLayout.length > 0 && (
          <div className="podium-section">
            <div className="podium-flex">
              {podiumLayout.map((user) => {
                if (!user) return null;
                const { itemClass, avatarClass, baseClass, iconClass, iconSrc, iconAlt } = getRankClasses(user.rank);
                const textClass = user.rank === 1 ? 'text-gold' : user.rank === 2 ? 'text-silver' : 'text-bronze';

                return (
                  <div key={user.rank} className={`podium-item ${itemClass}`}>
                    {user.rank === 1 && (
                      <div className="podium-crown" role="img" aria-label="Crown">
                        👑
                      </div>
                    )}

                    <div className="podium-avatar-wrapper">
                      <div className={avatarClass}>
                        {renderAvatarContent(user)}
                      </div>
                      <div className={iconClass}>
                        <img src={iconSrc} alt={iconAlt} />
                      </div>
                    </div>

                    <div className={`podium-base ${baseClass}`}>
                      {user.rank === 1 && <CustomBadge style={{ marginBottom: '12px' }}>Champion</CustomBadge>}
                      <h3 className={`text-xl ${user.rank === 1 ? 'text-2xl' : ''} mb-1 ${textClass}`} style={{ fontWeight: 600 }}>
                        {user.username}
                      </h3>
                      <p className={`text-2xl ${user.rank === 1 ? 'text-3xl' : ''} ${textClass} mb-1`} style={{ fontWeight: 700 }}>
                        {user.xp.toLocaleString()}
                      </p>
                      <p className={`text-sm ${textClass}`}>XP</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <span className="list-streak-icon" role="img" aria-label="Flame">🔥</span>
                        <span className="text-sm">{user.streak} days</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="leaderboard-list">
          {leaders.slice(3).map((user) => (
            <div
              key={user.rank}
              className={`leaderboard-item ${user.isUser ? 'leaderboard-item-user' : ''}`}
            >
              <div className={`rank-number ${user.isUser ? 'rank-number-user' : ''}`}>
                #{user.rank}
              </div>
              <div className={`list-avatar ${user.isUser ? 'list-avatar-user' : 'list-avatar-default'}`}>
                {renderAvatarContent(user)}
              </div>
              <div className="list-info">
                <h3 className={`list-name ${user.isUser ? 'list-name-user' : ''}`}>
                  {user.username}
                  {user.isUser && (
                    <CustomBadge style={{ marginLeft: '8px', backgroundColor: 'var(--green-500)', color: '#fff', fontSize: '10px' }}>
                      You
                    </CustomBadge>
                  )}
                </h3>
                <div className="list-streak">
                  <span className="list-streak-icon" role="img" aria-label="Flame">🔥</span>
                  <span className="text-sm text-gray-600">{user.streak} day streak</span>
                </div>
              </div>
              <div className="list-xp">
                <p className="list-xp-value">{user.xp.toLocaleString()}</p>
                <p className="list-xp-label">XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HeaderFooter>
  );
};

export default Leaderboard;