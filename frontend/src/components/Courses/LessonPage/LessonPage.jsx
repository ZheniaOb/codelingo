import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LessonPage.css";

const API_URL = "http://localhost:5001/api";

const shuffleArray = (array) => {
  if (!array) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [allExercises, setAllExercises] = useState([]);
  const [exerciseQueue, setExerciseQueue] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);

  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [selectedOptionKey, setSelectedOptionKey] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false); // NOWY STAN

  const [xpEarned, setXpEarned] = useState(0);
  const [completionMessage, setCompletionMessage] = useState("");

  useEffect(() => {
    fetchLesson();
    // eslint-disable-next-line
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to load lesson");
      const data = await response.json();

      if (data.exercises && Array.isArray(data.exercises) && data.exercises.length > 0) {
        setAllExercises(data.exercises);
        const shuffled = shuffleArray(data.exercises);
        setCurrentExercise(shuffled[0]);
        setExerciseQueue(shuffled.slice(1));
      } else {
        setAllExercises([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = (userAnswerKey, correctAnswer) => {
    if (isChecking || isCompleted || isGameOver) return;
    setIsChecking(true);

    const cleanUser = String(userAnswerKey).trim().toLowerCase();
    const cleanCorrect = String(correctAnswer).trim().toLowerCase();
    const isCorrect = cleanUser === cleanCorrect;

    if (isCorrect) {
      setFeedback("correct");
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback("incorrect");
      setLives((prev) => prev - 1);
    }

    setTimeout(() => {
        handleNextStep(isCorrect);
    }, 1500);
  };

  const handleOptionClick = (optionKey, correctAnswer) => {
    setSelectedOptionKey(optionKey);
    handleCheckAnswer(optionKey, correctAnswer);
  };

  const handleTextSubmit = (correctAnswer) => {
    if (!textInput.trim()) return;
    handleCheckAnswer(textInput, correctAnswer);
  };

  const handleNextStep = (wasCorrect) => {
    const newLives = wasCorrect ? lives : lives - 1;
    const newCorrectCount = wasCorrect ? correctCount + 1 : correctCount;

    if (newLives <= 0) {
        setIsGameOver(true);
        return;
    }

    if (newCorrectCount >= 5) {
        finishLesson(newLives);
        return;
    }

    setSelectedOptionKey(null);
    setTextInput("");
    setIsChecking(false);
    setFeedback(null);

    let nextQueue = [...exerciseQueue];
    if (nextQueue.length === 0) {
        nextQueue = shuffleArray([...allExercises]);
        if (allExercises.length > 1 && nextQueue[0].id === currentExercise.id) {
            nextQueue.push(nextQueue.shift());
        }
    }

    setCurrentExercise(nextQueue[0]);
    setExerciseQueue(nextQueue.slice(1));
  };

  const finishLesson = async (finalLives) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/lessons/${lessonId}/complete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ lives_remaining: finalLives }),
        });

        const data = await response.json();
        setXpEarned(data.xp_earned);
        setCompletionMessage(data.message);
        setIsCompleted(true);
    } catch (err) {
        console.error("Error saving progress", err);
    }
  };

  if (loading) return <div className="lesson-page"><div className="loader">Loading lesson...</div></div>;
  if (!allExercises || allExercises.length === 0) {
      return <div className="lesson-page"><main className="lesson-main">Lesson content not found.</main></div>;
  }

  if (isCompleted) {
    return (
        <div className="lesson-page">
            <main className="lesson-main result-view">
                <div className="result-card">
                    <h1>🎉 {completionMessage || "Lesson Completed!"}</h1>
                    <div className="xp-reward">
                        <span className="xp-amount">+{xpEarned} XP</span>
                    </div>
                    <div className="stats-summary">
                        <p>Lives remaining: {lives}/3</p>
                    </div>
                    <button className="lesson-continue-btn" onClick={() => navigate('/courses')}>
                        Continue
                    </button>
                </div>
            </main>
        </div>
    );
  }

  if (isGameOver) {
    return (
        <div className="lesson-page">
            <main className="lesson-main result-view">
                <div className="result-card" style={{ borderColor: '#ef4444' }}>
                    <div style={{fontSize: '4rem', marginBottom: '1rem'}}>💔</div>
                    <h1 style={{color: '#ef4444'}}>Out of lives!</h1>
                    <p style={{color: '#6b7280', fontSize: '1.2rem', marginBottom: '2rem'}}>
                        Don't worry, mistakes help you learn. Try again to earn XP!
                    </p>
                    <button
                        className="lesson-continue-btn"
                        onClick={() => window.location.reload()} // Odśwież stronę żeby zresetować
                        style={{background: '#ef4444', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)'}}
                    >
                        Try Again
                    </button>
                    <button
                        className="lesson-continue-btn"
                        onClick={() => navigate('/courses')}
                        style={{background: 'transparent', color: '#6b7280', boxShadow: 'none', marginTop: '10px'}}
                    >
                        Quit
                    </button>
                </div>
            </main>
        </div>
    );
  }

  if (!currentExercise) return null;

  const isMultipleChoice = currentExercise.options && currentExercise.options.length > 0;

  return (
    <div className="lesson-page">
      <header className="lesson-header">
        <button className="lesson-close-btn" onClick={() => navigate(-1)}>✕</button>

        <div className="lesson-progress-bar-container">
            <div
                className="lesson-progress-fill"
                style={{ width: `${Math.min((correctCount / 5) * 100, 100)}%` }}
            ></div>
        </div>

        <div className="lesson-lives">
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= lives ? "heart-full" : "heart-empty"}>
              ❤️
            </span>
          ))}
        </div>
      </header>

      <main className="lesson-main">
        <div key={currentExercise.id} className="question-card">
            <h2>{currentExercise.question}</h2>
        </div>

        {isMultipleChoice ? (
            <div className="options-grid">
                {currentExercise.options.map((optionObj, idx) => {
                    let btnClass = "option-btn";

                    if (isChecking) {
                        const isCorrectAnswer = optionObj.key === currentExercise.answer;
                        const isSelected = selectedOptionKey === optionObj.key;

                        if (isCorrectAnswer) {
                            btnClass += " option-correct";
                        } else if (isSelected && !isCorrectAnswer) {
                            btnClass += " option-incorrect";
                        } else {
                            btnClass += " option-disabled";
                        }
                    }

                    return (
                        <button
                            key={optionObj.key}
                            className={btnClass}
                            onClick={() => handleOptionClick(optionObj.key, currentExercise.answer)}
                            disabled={isChecking}
                        >
                            <span className="option-key">{optionObj.key.toUpperCase()}. </span>
                            {optionObj.text}
                        </button>
                    );
                })}
            </div>
        ) : (
            <div className="input-answer-container">
                <input
                    type="text"
                    className="lesson-text-input"
                    placeholder="Type your answer here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={isChecking}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && textInput) handleTextSubmit(currentExercise.answer);
                    }}
                />
                <button
                    className="lesson-check-btn"
                    onClick={() => handleTextSubmit(currentExercise.answer)}
                    disabled={isChecking || !textInput}
                >
                    Check Answer
                </button>
            </div>
        )}
      </main>

      <footer className={`lesson-footer ${feedback}`}>
            {feedback === 'correct' && (
                <div className="feedback-content">
                    <span className="feedback-icon">✅</span>
                    <span>Excellent!</span>
                </div>
            )}
             {feedback === 'incorrect' && (
                <div className="feedback-content">
                    <span className="feedback-icon">❌</span>
                    {isMultipleChoice ? (
                        <span>Correct answer was: <strong>{currentExercise.answer.toUpperCase()}</strong></span>
                    ) : (
                        <span>Correct answer: <strong>{currentExercise.answer}</strong></span>
                    )}
                </div>
            )}
      </footer>
    </div>
  );
};

export default LessonPage;