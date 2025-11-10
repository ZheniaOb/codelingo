
import React from 'react'; 
import "../css/styles.css"; 
import  Header  from './BasicSiteView/Header/Header';
import Footer from './BasicSiteView/Footer/Footer';


const leaderboardData = [
  { rank: 1, name: "Sarah Chen", xp: 2450, streak: 21, avatar: "SC" },
  { rank: 2, name: "Alex Rivera", xp: 2280, streak: 15, avatar: "AR" },
  { rank: 3, name: "Jamie Park", xp: 2150, streak: 18, avatar: "JP" },
  { rank: 4, name: "Morgan Lee", xp: 1980, streak: 12, avatar: "ML" },
  { rank: 5, name: "Taylor Swift", xp: 1850, streak: 9, avatar: "TS" },
  { rank: 6, name: "Jordan Kim", xp: 1720, streak: 14, avatar: "JK" },
  { rank: 7, name: "Casey Brown", xp: 1580, streak: 8, avatar: "CB" },
  { rank: 8, name: "You", xp: 1240, streak: 7, avatar: "YO", isUser: true },
];


const CustomBadge = ({ children, style = {} }) => (
    <div className="podium-badge" style={style}>{children}</div>
);


const Leaderboard = () => {
    
  
    const HeaderFooter = ({ children }) => (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
    
    
    const topThree = [leaderboardData[1], leaderboardData[0], leaderboardData[2]];
   
    const getRankClasses = (rank) => {
        switch (rank) {
            case 1:
                return { 
                    itemClass: 'podium-item-1st',
                    avatarClass: 'podium-avatar-1st avatar-gold', 
                    baseClass: 'podium-base-1st base-gold',
                    iconClass: 'rank-icon-1st icon-gold',
                    iconSrc: '/img/icons/victory_trophy.png',
                    iconAlt: 'Trophy'
                };
            case 2:
                return { 
                    itemClass: '',
                    avatarClass: 'podium-avatar avatar-silver', 
                    baseClass: 'podium-base base-silver',
                    iconClass: 'rank-icon icon-silver',
                    iconSrc: '/img/icons/medal.png',
                    iconAlt: 'Medal'
                };
            case 3:
                return { 
                    itemClass: '',
                    avatarClass: 'podium-avatar avatar-bronze', 
                    baseClass: 'podium-base base-bronze',
                    iconClass: 'rank-icon icon-bronze',
                    iconSrc: '/img/icons/award.png',
                    iconAlt: 'Award'
                };
            default:
                return {};
        }
    };
    
    return (
        <HeaderFooter>
            <div className="leaderboard-container container">
                
                {/* Header */}
                <div className="text-center">
                    <h1 className="leaderboard-title">Leaderboard</h1>
                    <p className="leaderboard-subtitle">Compete with learners worldwide</p>
                </div>
                
                {/* Top 3 Podium  */}
                <div className="podium-section">
                    <div className="podium-flex">
                        {topThree.map((user) => {
                            const { itemClass, avatarClass, baseClass, iconClass, iconSrc, iconAlt } = getRankClasses(user.rank);
                            const textClass = user.rank === 1 ? 'text-gold' : user.rank === 2 ? 'text-silver' : 'text-bronze';
                            
                            return (
                                <div key={user.rank} className={`podium-item ${itemClass}`}>
                                    
                                    {/* Crown for 1st Place  */}
                                    {user.rank === 1 && (
                                        <div className="podium-crown" role="img" aria-label="Crown">
                                            👑
                                        </div>
                                    )}
                                    
                                    {/* Avatar */}
                                    <div className="podium-avatar-wrapper">
                                        <div className={avatarClass}>
                                            {user.avatar}
                                        </div>
                                        {/* Rank Icon */}
                                        <div className={iconClass}>
                                            <img src={iconSrc} alt={iconAlt} />
                                        </div>
                                    </div>
                                    
                                    {/* Podium Base */}
                                    <div className={`podium-base ${baseClass}`}>
                                        {user.rank === 1 && <CustomBadge style={{ marginBottom: '12px' }}>Champion</CustomBadge>}
                                        <h3 className={`text-xl ${user.rank === 1 ? 'text-2xl' : ''} mb-1 ${textClass}`} style={{ fontWeight: 600 }}>
                                            {user.name}
                                        </h3>
                                        <p className={`text-2xl ${user.rank === 1 ? 'text-3xl' : ''} ${textClass} mb-1`} style={{ fontWeight: 700 }}>
                                            {user.xp}
                                        </p>
                                        <p className={`text-sm ${textClass}`}>XP</p>
                                        <div className="flex items-center justify-center gap-1 mt-2">
                                            <span className="list-streak-icon" role="img" aria-label="Flame">🔥</span>
                                            <span className="text-sm">{user.streak} {user.rank === 1 ? 'days' : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
         
                <div className="leaderboard-list">
                    {leaderboardData.slice(3).map((user) => {
                        const isUser = user.isUser;
                        
                        return (
                            <div 
                                key={user.rank} 
                                className={`leaderboard-item ${isUser ? 'leaderboard-item-user' : ''}`}
                            >
                                <div className={`rank-number ${isUser ? 'rank-number-user' : ''}`}>
                                    #{user.rank}
                                </div>
                                <div className={`list-avatar ${isUser ? 'list-avatar-user' : 'list-avatar-default'}`}>
                                    {user.avatar}
                                </div>
                                <div className="list-info">
                                    <h3 className={`list-name ${isUser ? 'list-name-user' : ''}`}>
                                        {user.name}
                                        {isUser && (
                                            <CustomBadge style={{ marginLeft: '8px', backgroundColor: 'var(--green-500)', color: '#fff', fontSize: '10px' }}>You</CustomBadge>
                                        )}
                                    </h3>
                                    <div className="list-streak">
                                        <span className="list-streak-icon" role="img" aria-label="Flame">🔥</span>
                                        <span className="text-sm text-gray-600">{user.streak} day streak</span>
                                    </div>
                                </div>
                                <div className="list-xp">
                                    <p className="list-xp-value">{user.xp}</p>
                                    <p className="list-xp-label">XP</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
            </div>
        </HeaderFooter>
    );
};

export default Leaderboard;