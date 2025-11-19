import { useState, useEffect } from "react";
import "../../css/styles.css";

const API_URL = "http://localhost:5001/api";

export function BugInfectionGame({ onComplete, onBack, language = 'javascript' }) {
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedBugs, setSelectedBugs] = useState([]);
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
      const response = await fetch(`${API_URL}/games/bug-infection/tasks/random?language=${language}`);
      if (!response.ok) {
        throw new Error("Failed to load task");
      }
      const task = await response.json();
      setCurrentTask(task);
      setSelectedBugs([]);
      setShowResult(false);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleBug = (bugIndex) => {
    if (showResult) return;
    setSelectedBugs((prev) =>
      prev.includes(bugIndex)
        ? prev.filter((i) => i !== bugIndex)
        : [...prev, bugIndex]
    );
  };

  const checkAnswer = () => {
    if (!currentTask) return;
    const correctBugs = currentTask.task_data.correct_bugs || [];
    const selectedSet = new Set(selectedBugs);
    const correctSet = new Set(correctBugs);
    
    const isCorrect = 
      selectedSet.size === correctSet.size &&
      [...selectedSet].every((bug) => correctSet.has(bug));
    
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
      const correctBugs = currentTask?.task_data?.correct_bugs || [];
      const selectedSet = new Set(selectedBugs);
      const correctSet = new Set(correctBugs);
      const isCorrect = 
        selectedSet.size === correctSet.size &&
        [...selectedSet].every((bug) => correctSet.has(bug));
      const finalScore = score + (isCorrect ? (currentTask?.xp_reward || 50) : 0);
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

  const bugs = currentTask.task_data.bugs || [];
  const correctBugs = currentTask.task_data.correct_bugs || [];
  const selectedSet = new Set(selectedBugs);
  const correctSet = new Set(correctBugs);
  const isCorrect = 
    selectedSet.size === correctSet.size &&
    [...selectedSet].every((bug) => correctSet.has(bug));

  return (
    <div className="game-container">
      <div className="max-w-5xl mx-auto">
        <div className="game-header">
          <h2 className="game-title">Bug Infection</h2>
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
            <h3>🐛 Find all the bugs!</h3>
            <p className="text-center mb-6">
              {currentTask.task_data.instruction || "Select all the bugs in the code below"}
            </p>
            <div className="mb-6">
              <div className="code-block">
                <pre>{currentTask.task_data.code}</pre>
              </div>
            </div>
            <div className="mb-6">
              <p className="mb-4 font-semibold text-center" style={{ color: '#374151', fontSize: '1.1rem' }}>
                Select all bugs (you can select multiple):
              </p>
              <div className="space-y-3">
                {bugs.map((bug, index) => (
                  <button
                    key={index}
                    onClick={() => toggleBug(index)}
                    className={`bug-item ${selectedBugs.includes(index) ? 'bug-item-selected' : ''}`}
                  >
                    <div className="bug-checkbox">
                      {selectedBugs.includes(index) ? '✓' : ''}
                    </div>
                    <span style={{ flex: 1, color: '#374151', fontSize: '1rem' }}>{bug}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={checkAnswer}
              disabled={selectedBugs.length === 0}
              className="game-btn game-btn-primary w-full"
            >
              ✓ Check Answer ({selectedBugs.length} selected)
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
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Excellent bug hunting! You found them all!</p>
              </div>
            ) : (
              <div className="result-error">
                <div className="result-error-icon">❌</div>
                <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Not quite!</h3>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Keep practicing! The correct bugs are shown below.</p>
              </div>
            )}
            <div className="mb-6">
              <p className="mb-3 font-semibold" style={{ color: '#374151' }}>Correct bugs:</p>
              <div className="space-y-3">
                {correctBugs.map((bugIndex, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                      border: '2px solid #10b981',
                      borderRadius: '12px',
                      padding: '1rem 1.5rem',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <span style={{ color: '#059669', fontSize: '1rem', fontWeight: '500' }}>
                      {bugs[bugIndex]}
                    </span>
                  </div>
                ))}
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
