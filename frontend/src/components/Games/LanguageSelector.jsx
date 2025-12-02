import { useState } from "react";
import "./MiniGames.css";

const LANGUAGES = [
  { id: "python", name: "Python", icon: "/img/icons/py.png", description: "Great for beginners" },
  { id: "javascript", name: "JavaScript", icon: "/img/icons/js.png", description: "Web development" },
  { id: "java", name: "Java", icon: "/img/icons/java.png", description: "Enterprise development" },
  { id: "htmlcss", name: "HTML/CSS", icon: "/img/icons/html_css.png", description: "Web basics" },
];

export function LanguageSelector({ onSelect, onBack }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleContinue = () => {
    if (selectedLanguage) {
      onSelect(selectedLanguage);
    }
  };

  return (
    <div className="game-container">
      <div className="language-select-wrapper">
        <div className="game-header">
          <h2 className="game-title">Choose Programming Language</h2>
          <button onClick={onBack} className="game-btn game-btn-secondary">
            1 Back
          </button>
        </div>

        <div className="game-card">
          <h3 className="language-select-title">Select a language to play</h3>
          <p className="language-select-subtitle">
            Choose the programming language you want to practice. Tasks will be in your selected language.
          </p>

          <div className="language-select-grid">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`language-select-btn ${
                  selectedLanguage === lang.id ? "language-select-btn-selected" : ""
                }`}
              >
                <div className="language-select-icon">
                  <img 
                    src={lang.icon} 
                    alt={lang.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span style={{ display: 'none', fontSize: '2rem' }}>💻</span>
                </div>
                <div className="language-select-info">
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--color-text-primary)' }}>
                    {lang.name}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>{lang.description}</p>
                </div>
                {selectedLanguage === lang.id && (
                  <div className="language-select-check">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className="game-btn game-btn-primary language-select-cta"
          >
            {selectedLanguage ? `Continue with ${LANGUAGES.find(l => l.id === selectedLanguage)?.name}` : "Select a language to continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

