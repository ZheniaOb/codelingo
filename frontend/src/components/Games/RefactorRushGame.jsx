import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import "./MiniGames.css";

const API_URL = "http://localhost:5001/api";

export function RefactorRushGame({ onComplete, onBack, language = 'javascript' }) {
  const { i18n } = useTranslation();
  const [currentTask, setCurrentTask] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const [hint, setHint] = useState(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    loadNewTask();
  }, []);

  useEffect(() => {
    if (!showResult && !loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showResult, loading]);

  const loadNewTask = async () => {
    try {
      setLoading(true);
      setError(null);
      setHint(null);
      setAiFeedback(null);
      const response = await fetch(`${API_URL}/games/refactor-rush/tasks/random?language=${language}`);
      if (!response.ok) {
        throw new Error("Failed to load task");
      }
      const task = await response.json();
      setCurrentTask(task);
      setUserInput("");
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
          code: currentTask.task_data.bad_code,
          language: i18n.language,
          game_type: 'refactor'
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

  const getFeedback = async (userCode, correctCode) => {
    setIsFeedbackLoading(true);
    try {
      const response = await fetch(`${API_URL}/ai/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_code: userCode,
          correct_code: correctCode,
          language: i18n.language
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

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newValue = userInput.substring(0, selectionStart) + "    " + userInput.substring(selectionEnd);
      setUserInput(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4;
      }, 0);
    }
  };

  const checkAnswer = () => {
    if (!currentTask) return;
    const correctCode = currentTask.task_data.refactored_code || "";
    const isCorrect = userInput.trim() === correctCode.trim();
    if (isCorrect) {
      setScore(score + (currentTask.xp_reward || 50));
    } else {
      getFeedback(userInput, correctCode);
    }
    setShowResult(true);
  };

  const nextRound = () => {
    if (round < 3) {
      setRound(round + 1);
      loadNewTask();
    } else {
      const isCorrect = userInput.trim() === (currentTask?.task_data?.refactored_code || "").trim();
      const finalScore = score + (isCorrect ? (currentTask?.xp_reward || 50) : 0);
      onComplete(finalScore);
    }
  };

  const renderVisualFeedback = () => {
    const targetCode = currentTask.task_data.refactored_code || "";
    return userInput.split("").map((char, index) => {
      const isCorrect = char === targetCode[index];
      return (
        <span
          key={index}
          className={isCorrect ? "char-correct" : "char-wrong"}
        >
          {char}
        </span>
      );
    });
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

  const isCorrect = userInput.trim() === (currentTask.task_data.refactored_code || "").trim();

  return (
    <div className="game-container">
      <div className="max-w-5xl mx-auto">
        <div className="game-header">
          <h2 className="game-title">Refactor Rush</h2>
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
            <h3>✨ Refactor this code!</h3>
            <p className="text-center mb-6">{currentTask.task_data.instruction || "Make the code cleaner and more efficient"}</p>
            <div className="mb-6">
              <p className="mb-3 font-semibold" style={{ color: '#374151' }}>Original code:</p>
              <div className="code-block code-block-bad">
                <pre>{currentTask.task_data.bad_code}</pre>
              </div>
            </div>
            <div className="mb-6">
              <p className="mb-3 font-semibold" style={{ color: '#374151' }}>Your refactored code:</p>
              <div className="game-textarea-wrapper" onClick={() => inputRef.current?.focus()}>
                <div className="game-textarea-feedback">
                  {renderVisualFeedback()}
                  <span className="cursor-blink">|</span>
                </div>
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="game-textarea-hidden"
                  placeholder="Write your refactored code here..."
                />
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
                        <strong>🤖 AI Explanation:</strong> {hint}
                    </div>
                )}
            </div>

            <button
              onClick={checkAnswer}
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
                  Perfect! +{currentTask.xp_reward || 50} XP
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Great refactoring! Your code is clean and efficient!</p>
              </div>
            ) : (
              <div className="result-error">
                <div className="result-error-icon">❌</div>
                <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Not quite right!</h3>
                <div className="ai-message-box error-box">
                    {isFeedbackLoading ? (
                        <span>🤖 Analyzing your mistake...</span>
                    ) : (
                        <span>
                            <strong>🤖 AI Advice:</strong> {aiFeedback || "Check the solution below."}
                        </span>
                    )}
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4 mb-6 mt-4">
              <div>
                <p className="mb-3 font-semibold" style={{ color: '#374151' }}>Expected:</p>
                <div className="code-block">
                  <pre>{currentTask.task_data.refactored_code}</pre>
                </div>
              </div>
              <div>
                <p className="mb-3 font-semibold" style={{ color: '#374151' }}>Your answer:</p>
                <div className="code-block">
                  <pre>{userInput || "(empty)"}</pre>
                </div>
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
              <button onClick={onBack} className="game-btn game-btn-secondary">
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}