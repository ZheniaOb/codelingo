import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./BasicSiteView/Header/Header";
import Footer from "./BasicSiteView/Footer/Footer";
import "../css/styles.css";

const games = [
  {
    id: "memory-code",
    icon: "/img/icons/book.png",
    iconFallback: "🧠",
    title: "Memory of Code",
    description: "Remember and reproduce code fragments",
    colorClass: "game-gradient-1",
    difficulty: "Easy"
  },
  {
    id: "refactor-rush",
    icon: "/img/icons/star.png",
    iconFallback: "✨",
    title: "Refactor Rush",
    description: "Fix and simplify bad code",
    colorClass: "game-gradient-2",
    difficulty: "Medium"
  },
  {
    id: "variable-hunt",
    icon: "/img/icons/award.png",
    iconFallback: "🔍",
    title: "Variable Hunt",
    description: "Find incorrectly used variables",
    colorClass: "game-gradient-3",
    difficulty: "Medium"
  },
  {
    id: "bug-infection",
    icon: "/img/icons/thunder.png",
    iconFallback: "🐛",
    title: "Bug Infection",
    description: "Stop bugs from spreading in code",
    colorClass: "game-gradient-4",
    difficulty: "Hard"
  }
];

const MiniGamesPage = () => {
  const navigate = useNavigate();
  const [iconErrors, setIconErrors] = React.useState({});

  const handleSelectGame = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  const handleIconError = (gameId) => {
    setIconErrors(prev => ({ ...prev, [gameId]: true }));
  };

  const getDifficultyClass = (difficulty) => {
    if (difficulty === "Easy") return "difficulty-easy";
    if (difficulty === "Medium") return "difficulty-medium";
    return "difficulty-hard";
  };

  return (
    <div className="minigames-page">
      <Header />

      <div className="minigames-container">
        <div className="minigames-header">
          <h1 className="minigames-title">Mini Games</h1>
          <p className="minigames-subtitle">Learn through play and challenge yourself!</p>
        </div>

        <div className="minigames-grid">
          {games.map((game, index) => (
            <div
              key={game.id}
              className="minigame-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`minigame-card-overlay ${game.colorClass}`}></div>
              
              <div className="minigame-card-content">
                <div className={`minigame-icon-wrapper ${game.colorClass}`}>
                  {iconErrors[game.id] ? (
                    <span className="minigame-icon-fallback">{game.iconFallback || '🎮'}</span>
                  ) : (
                    <img 
                      src={game.icon} 
                      alt={game.title}
                      className="minigame-icon"
                      onError={() => handleIconError(game.id)}
                    />
                  )}
                </div>

                <h3 className="minigame-title">{game.title}</h3>
                <p className="minigame-description">{game.description}</p>

                <div className="minigame-meta">
                  <span className={`minigame-difficulty ${getDifficultyClass(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                  <span className="minigame-xp">+50 XP</span>
                </div>

                <button
                  onClick={() => handleSelectGame(game.id)}
                  className={`btn minigame-play-btn ${game.colorClass}`}
                >
                  <span className="play-icon">▶</span>
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MiniGamesPage;

