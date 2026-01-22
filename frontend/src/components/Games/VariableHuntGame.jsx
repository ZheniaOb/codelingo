import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./MiniGames.css";

const API_URL = "http://localhost:5001/api";

export function VariableHuntGame({ onComplete, onBack, language = 'javascript' }) {
  const { i18n } = useTranslation();
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedVariable, setSelectedVariable] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const [hint, setHint] = useState(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  useEffect(() => {
    loadNewTask();
  }, []);

  const loadNewTask = async () => {
    try {
      setLoading(true);
      setError(null);
      setHint(null);
      setAiFeedback(null);
      const response = await fetch(`${API_URL}/games/variable-hunt/tasks/random?language=${language}`);
      if (!response.ok) {
        throw new Error("Failed to load task");
      }
      const task = await response.json();
      setCurrentTask(task);
      setSelectedVariable("");
      setShowResult(false);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getHint = async () => {
    if (!currentTask || isHintLoading) return;
    setIsHintLoading(true);
    try {
      const response = await fetch(`${API_URL}/ai/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentTask.task_data.code,
          language: i18n.language,
          game_type: 'variable_hunt'
        })
      });
      const data = await response.json();
      setHint(data.hint);
    } catch (e) {
      console.error(e);
    } finally {
      setIsHintLoading(false);
    }
  };

  const getFeedback = async (userChoice, correctChoice) => {
    setIsFeedbackLoading(true);
    try {
      const response = await fetch(`${API_URL}/ai/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_code: `Selected variable: ${userChoice}`,
          correct_code: `Correct incorrect variable: ${correctChoice}`,
          language: i18n.language,
          game_type: 'variable_hunt'
        })
      });
      const data = await response.json();
      setAiFeedback(data.feedback);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const checkAnswer = () => {
      if (!currentTask || !selectedVariable) return;
      const correctVariable = currentTask.task_data.correct_variable || "";
      const isCorrect = selectedVariable.trim() === correctVariable.trim();
      if (isCorrect) {
        setScore(score + 50);
      } else {
        getFeedback(selectedVariable, correctVariable);
      }
      setShowResult(true);
    };

  const nextRound = () => {
    if (round < 3) {
      setRound(round + 1);
      loadNewTask();
    } else {
      onComplete(score);
    }
  };

  if (loading && !currentTask) {
    return (
      <div className="game-container">
        <div className="game-loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading game...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-container">
        <div className="game-error">
          <div className="error-icon">⚠️</div>
          <div className="error-text">Error: {error}</div>
          <button onClick={onBack} className="game-btn game-btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  if (!currentTask) {
    return null;
  }

  const variables = currentTask.task_data.variables || [];
  const isCorrect = selectedVariable === (currentTask.task_data.correct_variable || "");

  return (
    <div className="game-container">
      <div className="max-w-4xl mx-auto">
        <div className="game-header">
          <h2 className="game-title">Variable Hunt</h2>
          <div className="game-stats">
            <div className="game-stat-badge">
              <span>📊</span>
              <span>Round {round}/3</span>
            </div>
            <div className="game-stat-badge">
              <span>⭐</span>
              <span>{score} XP</span>
            </div>
          </div>
        </div>

        {!showResult ? (
          <div className="game-card">
            <h3>🔍 Find the incorrectly used variable!</h3>
            <p className="text-center mb-6">{currentTask.task_data.instruction || "Which variable is used incorrectly in this code?"}</p>
            <div className="mb-6">
              <div className="code-block">
                <pre>{currentTask.task_data.code}</pre>
              </div>
            </div>
            <div className="mb-6">
              <p className="mb-4 font-semibold text-center" style={{ color: '#374151', fontSize: '1.1rem' }}>Select the incorrect variable:</p>
              <div className="grid grid-cols-2 gap-4">
                {variables.map((variable, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariable(variable)}
                    className={`variable-btn ${selectedVariable === variable ? 'variable-btn-selected' : ''}`}
                  >
                    <code>{variable}</code>
                  </button>
                ))}
              </div>
            </div>

            <div className="hint-section">
                {!hint && (
                    <button
                        onClick={getHint}
                        className="hint-btn"
                        disabled={isHintLoading}
                    >
                        {isHintLoading ? "Analyzing..." : "🤖 Hint"}
                    </button>
                )}
                {hint && (
                    <div className="ai-message-box hint-box">
                        <strong>🤖 AI Analysis:</strong> {hint}
                    </div>
                )}
            </div>

            <button
              onClick={checkAnswer}
              disabled={!selectedVariable}
              className="game-btn game-btn-primary w-full mt-6"
            >
              ✓ Check Answer
            </button>
          </div>
        ) : (
          <div className="game-card">
            {isCorrect ? (
              <div className="result-success">
                <div className="result-success-icon">✅</div>
                <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>
                  Perfect! + 50 XP
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Excellent detective work! You found the bug!</p>
              </div>
            ) : (
              <div className="result-error">
                <div className="result-error-icon">❌</div>
                <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Not quite!</h3>
                <div className="ai-message-box error-box">
                    {isFeedbackLoading ? (
                        <span>🤖 Analyzing error...</span>
                    ) : (
                        <span>
                            <strong>🤖 AI Advice:</strong> {aiFeedback || "The answer is below."}
                        </span>
                    )}
                </div>
              </div>
            )}
            <div className="mb-6 mt-4">
              <p className="mb-3 font-semibold text-center" style={{ color: '#374151' }}>Correct answer:</p>
              <div style={{
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}>
                <code style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669' }}>
                  {currentTask.task_data.correct_variable}
                </code>
              </div>
            </div>
            <div className="flex gap-4">
              {round < 3 ? (
                <button
                  onClick={nextRound}
                  className="game-btn game-btn-primary flex-1"
                >
                  → Next Round
                </button>
              ) : (
                <button
                  onClick={() => {
                    const finalScore = score + (isCorrect ? (currentTask.xp_reward || 50) : 0);
                    onComplete(finalScore);
                  }}
                  className="game-btn game-btn-primary flex-1"
                >
                  🎉 Complete Game
                </button>
              )}
              <button 
                onClick={() => onComplete(score)} 
                className="game-btn game-btn-secondary"
              >
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}