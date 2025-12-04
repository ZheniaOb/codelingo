import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./MiniGames.css";

const LANGUAGES = [
  { id: "python", icon: "/img/icons/py.png" },
  { id: "javascript", icon: "/img/icons/js.png" },
  { id: "java", icon: "/img/icons/java.png" },
  { id: "htmlcss", icon: "/img/icons/html_css.png" }
];

export function LanguageSelector({ onSelect, onBack }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const { t } = useTranslation();

  const handleContinue = () => {
    if (selectedLanguage) {
      onSelect(selectedLanguage);
    }
  };

  return (
    <div className="game-container">
      <div className="language-select-wrapper">
        <div className="game-header">
          <h2 className="game-title">{t("minigames.choose_language")}</h2>
          <button onClick={onBack} className="game-btn game-btn-secondary">
            {t("minigames.back")}
          </button>
        </div>

        <div className="game-card">
          <h3 className="language-select-title">{t("minigames.select_title")}</h3>
          <p className="language-select-subtitle">
            {t("minigames.select_subtitle")}
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
                    alt={t(`minigames.languages.${lang.id}`)}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <span style={{ display: "none", fontSize: "2rem" }}>💻</span>
                </div>

                <div className="language-select-info">
                  <h4>
                    {t(`minigames.languages.${lang.id}`)}
                  </h4>
                  <p>
                    {t(`minigames.languages.${lang.id}_desc`)}
                  </p>
                </div>

                {selectedLanguage === lang.id && (
                  <div className="language-select-check">✓</div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className="game-btn game-btn-primary language-select-cta"
          >
            {selectedLanguage
              ? t("minigames.continue_with", {
                  language: t(`minigames.languages.${selectedLanguage}`)
                })
              : t("minigames.continue_select")}
          </button>
        </div>
      </div>
    </div>
  );
}
