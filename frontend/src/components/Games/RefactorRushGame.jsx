import { useState, useEffect } from "react";
import "../../css/styles.css";

const API_URL = "http://localhost:5001/api";

export function RefactorRushGame({ onComplete, onBack, language = 'javascript' }) {
  const [currentTask, setCurrentTask] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    loadNewTask();
  }, []);

  const loadNewTask = async () => {
    try {
      setLoading(true);
      setError(null);
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

  const checkAnswer = () => {
    if (!currentTask) return;
    const correctCode = currentTask.task_data.refactored_code || "";
    const isCorrect = userInput.trim() === correctCode.trim();
    if (isCorrect) {
      setScore(score + (currentTask.xp_reward || 50));
    }
    setShowResult(true);
  };

  const nextRound = () => {
    if (round < 3) {
      setRound(round + 1);
      loadNewTask();
    } else {
      const finalScore = score + (userInput.trim() === (currentTask?.task_data?.refactored_code || "").trim() ? (currentTask?.xp_reward || 50) : 0);
      onComplete(finalScore);
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
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="game-textarea"
                placeholder="Write your refactored code here..."
                autoFocus
              />
            </div>
            <button
              onClick={checkAnswer}
              className="game-btn game-btn-primary w-full"
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
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Keep practicing! Check the solution below.</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
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
