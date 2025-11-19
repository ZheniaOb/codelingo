import { useState, useEffect } from "react";
import "../../css/styles.css";

const API_URL = "http://localhost:5001/api";

export function MemoryCodeGame({ onComplete, onBack, language = 'javascript' }) {
  const [phase, setPhase] = useState("memorize");
  const [currentTask, setCurrentTask] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [timer, setTimer] = useState(5);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNewTask();
  }, []);

  useEffect(() => {
    if (phase === "memorize" && timer > 0) {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    } else if (phase === "memorize" && timer === 0) {
      setPhase("input");
    }
  }, [phase, timer]);

  const loadNewTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/games/memory-code/tasks/random?language=${language}`);
      if (!response.ok) {
        throw new Error("Failed to load task");
      }
      const task = await response.json();
      setCurrentTask(task);
      setUserInput("");
      setTimer(5);
      setPhase("memorize");
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!currentTask) return;
    const correctCode = currentTask.task_data.code || "";
    const isCorrect = userInput.trim() === correctCode.trim();
    if (isCorrect) {
      setScore(score + (currentTask.xp_reward || 50));
    }
    setPhase("result");
  };

  const nextRound = () => {
    if (round < 3) {
      setRound(round + 1);
      loadNewTask();
    } else {
      const finalScore = score + (userInput.trim() === (currentTask?.task_data?.code || "").trim() ? (currentTask?.xp_reward || 50) : 0);
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

  const isCorrect = userInput.trim() === (currentTask.task_data.code || "").trim();

  return (
    <div className="game-container">
      <div className="max-w-4xl mx-auto">
        <div className="game-header">
          <h2 className="game-title">Memory of Code</h2>
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

        {phase === "memorize" && (
          <div className="game-card">
            <div className="game-timer">
              <span className="timer-icon">🧠</span>
              <div className="timer-number">{timer}</div>
            </div>
            <h3>Memorize this code!</h3>
            <div className="code-block">
              <pre>{currentTask.task_data.code}</pre>
            </div>
          </div>
        )}

        {phase === "input" && (
          <div className="game-card">
            <h3>Type what you remember!</h3>
            <p className="text-center mb-6">Try to reproduce the code exactly as you saw it</p>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="game-textarea"
              placeholder="Type the code here..."
              autoFocus
            />
            <button
              onClick={checkAnswer}
              className="game-btn game-btn-primary w-full mt-6"
            >
              ✓ Check Answer
            </button>
          </div>
        )}

        {phase === "result" && (
          <div className="game-card">
            {isCorrect ? (
              <div className="result-success">
                <div className="result-success-icon">✅</div>
                <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>
                  Perfect! +{currentTask.xp_reward || 50} XP
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Excellent memory! You got it exactly right!</p>
              </div>
            ) : (
              <div className="result-error">
                <div className="result-error-icon">❌</div>
                <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Not quite!</h3>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Don't worry, keep practicing!</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="mb-2 font-semibold" style={{ color: '#374151' }}>Expected:</p>
                <div className="code-block">
                  <pre>{currentTask.task_data.code}</pre>
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold" style={{ color: '#374151' }}>Your answer:</p>
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

