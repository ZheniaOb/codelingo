import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MemoryCodeGame } from "./MemoryCodeGame";
import { RefactorRushGame } from "./RefactorRushGame";
import { VariableHuntGame } from "./VariableHuntGame";
import { BugInfectionGame } from "./BugInfectionGame";
import { LanguageSelector } from "./LanguageSelector";
import Header from "../BasicSiteView/Header/Header";
import Footer from "../BasicSiteView/Footer/Footer";
import "../../css/styles.css";

const gameComponents = {
  "memory-code": MemoryCodeGame,
  "refactor-rush": RefactorRushGame,
  "variable-hunt": VariableHuntGame,
  "bug-infection": BugInfectionGame,
};

export function GameWrapper() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const GameComponent = gameComponents[gameId];

  if (!GameComponent) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl text-red-500 mb-4">Game not found</h2>
            <button onClick={() => navigate("/minigames")} className="btn btn-cta">
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleComplete = (xp) => {
    setEarnedXP(xp);
    setShowCompletion(true);
  };

  const handleBack = () => {
    navigate("/minigames");
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleBackToLanguageSelect = () => {
    setSelectedLanguage(null);
  };

  // Show language selector if language not selected
  if (!selectedLanguage) {
    return (
      <div>
        <Header />
        <LanguageSelector 
          onSelect={handleLanguageSelect} 
          onBack={handleBack}
        />
        <Footer />
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div>
        <Header />
        <div className="game-container">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="game-card text-center max-w-lg" style={{ animation: 'bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
              <div className="result-success-icon" style={{ fontSize: '8rem', marginBottom: '1.5rem' }}>🎉</div>
              <h2 className="game-title" style={{ marginBottom: '1rem' }}>Game Complete!</h2>
              <p style={{ fontSize: '1.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                You earned
              </p>
              <div className="game-stat-badge" style={{ 
                display: 'inline-flex', 
                fontSize: '2rem', 
                padding: '1rem 2rem',
                marginBottom: '2rem'
              }}>
                <span>⭐</span>
                <span>{earnedXP} XP</span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Great job! Keep practicing to improve your skills!
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCompletion(false);
                    window.location.reload();
                  }}
                  className="game-btn game-btn-primary flex-1"
                >
                  🔄 Play Again
                </button>
                <button onClick={handleBack} className="game-btn game-btn-secondary">
                  ← Back to Games
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <GameComponent 
        onComplete={handleComplete} 
        onBack={handleBackToLanguageSelect}
        language={selectedLanguage}
      />
      <Footer />
    </div>
  );
}

