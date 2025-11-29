import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import Header from "./BasicSiteView/Header/Header";
import Footer from "./BasicSiteView/Footer/Footer";
import "../css/styles.css";

const games = [
  {
    id: "memory-code",
    icon: "/img/icons/book.png",
    iconFallback: "🧠",
    titleKey: "game_memory_title",
    descriptionKey: "game_memory_desc",
    colorClass: "game-gradient-1",
    difficultyKey: "difficulty_easy"
  },
  {
    id: "refactor-rush",
    icon: "/img/icons/star.png",
    iconFallback: "✨",
    titleKey: "game_refactor_title",
    descriptionKey: "game_refactor_desc",
    colorClass: "game-gradient-2",
    difficultyKey: "difficulty_medium"
  },
  {
    id: "variable-hunt",
    icon: "/img/icons/award.png",
    iconFallback: "🔍",
    titleKey: "game_variable_title",
    descriptionKey: "game_variable_desc",
    colorClass: "game-gradient-3",
    difficultyKey: "difficulty_medium"
  },
  {
    id: "bug-infection",
    icon: "/img/icons/thunder.png",
    iconFallback: "🐛",
    titleKey: "game_bug_title",
    descriptionKey: "game_bug_desc",
    colorClass: "game-gradient-4",
    difficultyKey: "difficulty_hard"
  }
];

const MiniGamesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [iconErrors, setIconErrors] = React.useState({});

  const handleSelectGame = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  const handleIconError = (gameId) => {
    setIconErrors(prev => ({ ...prev, [gameId]: true }));
  };

  const getDifficultyClass = (difficultyKey) => {
    if (difficultyKey === "difficulty_easy") return "difficulty-easy";
    if (difficultyKey === "difficulty_medium") return "difficulty-medium";
    return "difficulty-hard";
  };

  return (
    <div className="minigames-page">
      <Header />

      <div className="minigames-container">
        <div className="minigames-header">
          <h1 className="minigames-title">{t('minigames_title')}</h1>
          <p className="minigames-subtitle">{t('minigames_subtitle')}</p>
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
                      alt={t(game.titleKey)}
                      className="minigame-icon"
                      onError={() => handleIconError(game.id)}
                    />
                  )}
                </div>

                <h3 className="minigame-title">{t(game.titleKey)}</h3>
                <p className="minigame-description">{t(game.descriptionKey)}</p>

                <div className="minigame-meta">
                  <span className={`minigame-difficulty ${getDifficultyClass(game.difficultyKey)}`}>
                    {t(game.difficultyKey)}
                  </span>
                  <span className="minigame-xp">+50 XP</span>
                </div>

                <button
                  onClick={() => handleSelectGame(game.id)}
                  className={`btn minigame-play-btn ${game.colorClass}`}
                >
                  <span className="play-icon">▶</span>
                  {t('play_now')}
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
