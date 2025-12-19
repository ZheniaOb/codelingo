import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DailyChallenge.css';

const API_URL = "http://localhost:5001/api";

const DailyChallenge = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedToday, setCompletedToday] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [scoreEarned, setScoreEarned] = useState(0);

  useEffect(() => {
    fetchDailyTasks();
  }, []);

  const fetchDailyTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/daily-challenge`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();

        if (data.completed) {
            setAlreadyPlayed(true);
            setLoading(false);
            return;
        }

        if (data.tasks && data.tasks.length > 0) {
            setTasks(data.tasks);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newValue = userAnswer.substring(0, selectionStart) + "    " + userAnswer.substring(selectionEnd);
      setUserAnswer(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4;
      }, 0);
    }
  };

  const processAnswer = async (answerToCheck) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const currentTask = tasks[currentIndex];

    const normalize = (str) => str ? str.replace(/\s+/g, ' ').trim().toLowerCase() : "";
    const isCorrect = normalize(answerToCheck) === normalize(currentTask.answer);

    if (isCorrect) {
      setFeedback('correct');
      setScoreEarned(prev => prev + 50);

      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/daily-challenge/complete-task`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) { console.error(e); }
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      goToNextTask();
    }, 1500);
  };

  const goToNextTask = () => {
    setFeedback(null);
    setUserAnswer("");
    setIsAnswered(false);

    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompletedToday(true);
    }
  };

  const handleOptionClick = (key) => {
    setUserAnswer(key);
    processAnswer(key);
  };

  const handleFinish = async () => {
    try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/daily-challenge/finish`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (e) { console.error(e); }

    navigate('/');
    window.location.reload();
  };

  const getOptionClass = (optKey) => {
    if (!isAnswered) return userAnswer === optKey ? 'selected' : '';

    const currentTask = tasks[currentIndex];
    const correctKey = currentTask.answer.toLowerCase();

    if (optKey.toLowerCase() === correctKey) {
        return 'option-correct';
    }
    if (userAnswer === optKey && userAnswer.toLowerCase() !== correctKey) {
        return 'option-wrong';
    }
    return 'option-disabled';
  };

  const renderTaskInput = () => {
    const task = tasks[currentIndex];

    if (task.type === 'multiple_choice') {
      return (
        <div className="daily-options">
          {task.options.map((opt) => (
            <button
              key={opt.key}
              className={`daily-option-btn ${getOptionClass(opt.key)}`}
              onClick={() => handleOptionClick(opt.key)}
              disabled={isAnswered}
            >
              <span className="opt-key">{opt.key.toUpperCase()}</span>
              {opt.text}
            </button>
          ))}
        </div>
      );
    }

    if (task.type === 'code') {
      return (
        <div className="daily-code-wrapper">
          {task.context && (
             <div className="code-context">
               <pre>{task.context}</pre>
             </div>
          )}
          <textarea
            className={`daily-code-input ${isAnswered ? (feedback === 'correct' ? 'input-correct' : 'input-wrong') : ''}`}
            placeholder="// Type your code solution here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isAnswered}
            spellCheck="false"
          />
        </div>
      );
    }

    return (
      <div className="daily-text-wrapper">
         <input
          type="text"
          className={`daily-text-input ${isAnswered ? (feedback === 'correct' ? 'input-correct' : 'input-wrong') : ''}`}
          placeholder="Type your answer..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={isAnswered}
        />
        {isAnswered && feedback === 'wrong' && (
            <p className="correct-answer-hint">Correct: {task.answer}</p>
        )}
      </div>
    );
  };

  if (loading) {
      return (
        <div className="daily-page">
            <div className="daily-container">
                <div className="daily-loading">Loading your tasks...</div>
            </div>
        </div>
      );
  }

  if (alreadyPlayed) {
      return (
        <div className="daily-page">
            <div className="daily-container">
                <div className="daily-completed">
                    <div className="trophy-icon">⏳</div>
                    <h3>Already Played Today!</h3>
                    <p>Come back tomorrow for new challenges.</p>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>Go Home</button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="daily-page">
      <div className="daily-container">

        <div className="daily-header">
          <h2 className="daily-title">📅 Daily Challenge</h2>
          {!completedToday && tasks.length > 0 && (
             <div className="daily-progress">
               Task {currentIndex + 1} / {tasks.length}
             </div>
          )}
        </div>

        {completedToday ? (
          <div className="daily-completed">
            <div className="trophy-icon">🏆</div>
            <h3>All Done for Today!</h3>
            <p>You earned {scoreEarned} XP today. Come back tomorrow!</p>
            <button className="btn btn-primary" onClick={handleFinish}>Finish & Go Home</button>
          </div>
        ) : tasks.length > 0 ? (
          <div className="daily-task-card">
            <div className="task-question">
              {tasks[currentIndex].question}
            </div>

            <div className="task-input-area">
              {renderTaskInput()}
            </div>

            <div className="daily-footer">
              {tasks[currentIndex].type !== 'multiple_choice' && (
                  <button
                    className="btn btn-primary check-btn"
                    onClick={() => processAnswer(userAnswer)}
                    disabled={!userAnswer || isAnswered}
                  >
                    Check Answer
                  </button>
              )}

              <div className={`feedback-msg ${feedback}`}>
                {feedback === 'correct' && "✅ Correct! +50 XP"}
                {feedback === 'wrong' && "❌ Wrong! Moving next..."}
              </div>
            </div>
          </div>
        ) : (
          <div className="daily-empty">
            <p>No tasks available right now.</p>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;