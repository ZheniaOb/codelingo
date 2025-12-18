import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import ReactMarkdown from "react-markdown"; 
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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
  const { t } = useTranslation();

  const [currentTheme, setCurrentTheme] = useState("root"); 

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [allExercises, setAllExercises] = useState([]);
  const [exerciseQueue, setExerciseQueue] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);

  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLecture, setShowLecture] = useState(true); 

  const [selectedOptionKey, setSelectedOptionKey] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false); 

  const [xpEarned, setXpEarned] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [completionMessage, setCompletionMessage] = useState("");

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to load lesson");
      const data = await response.json();

      setLessonTitle(data.title || "");
      setLessonContent(data.content || "");

      if (data.exercises && Array.isArray(data.exercises) && data.exercises.length > 0) {
        setAllExercises(data.exercises);
      } else {
        setAllExercises([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    if (allExercises.length > 0) {
      const shuffled = shuffleArray(allExercises);
      setCurrentExercise(shuffled[0]);
      setExerciseQueue(shuffled.slice(1));
      setShowLecture(false);
    }
  };

  useEffect(() => {
    if (!loading && showLecture && (!lessonContent || lessonContent.trim() === "") && allExercises.length > 0) {
      const shuffled = shuffleArray(allExercises);
      setCurrentExercise(shuffled[0]);
      setExerciseQueue(shuffled.slice(1));
      setShowLecture(false);
    }
  }, [loading, lessonContent, allExercises.length, showLecture]);

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
        if (typeof data.coins_earned === "number") {
          setCoinsEarned(data.coins_earned);
        } else if (typeof data.xp_earned === "number") {
          setCoinsEarned(Math.floor(data.xp_earned / 2));
        }
        setCompletionMessage(data.message);
        setIsCompleted(true);
    } catch (err) {
        console.error("Error saving progress", err);
    }
  };

  if (loading) return <div className={`lesson-page ${currentTheme}`}><div className="loader">{t("lesson_loading")}</div></div>;
  
  if (showLecture) {
    return (
      <div className={`lesson-page ${currentTheme}`}>
        <header className="lesson-header">
          <button className="lesson-close-btn" onClick={() => navigate(-1)}>✕</button>
        </header>
        <main className="lesson-main">
           <div className="lesson-content">
            <h1 className="lesson-title">{lessonTitle}</h1>

              <div className="lesson-text">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {lessonContent}
                </ReactMarkdown>
              </div>

                {allExercises && allExercises.length > 0 ? (
                <button className="lesson-start-btn" onClick={startTest}>
                  {t("lesson_start_test")}
                </button>
            ) : (
              <div className="lesson-no-exercises">
                {t("lesson_no_exercises")}
              </div>
               )}            </div>
        </main>
      </div>
    );
  }

  if (!allExercises || allExercises.length === 0) {                  return <div className={`lesson-page ${currentTheme}`}><main className="lesson-main">{t("lesson_content_not_found")}</main></div>;
  }

  if (isCompleted) {
    return (
        <div className={`lesson-page ${currentTheme}`}>
            <main className="lesson-main result-view">
                <div className="result-card">
                    <h1>🎉 {completionMessage || t("lesson_completed")}</h1>
                        <div className="xp-reward">
                          <span className="xp-amount">+{xpEarned} XP</span>
                          {coinsEarned > 0 && (
                            <span className="xp-amount" style={{ marginTop: "0.5rem", fontSize: "1.1rem" }}>
                              +{coinsEarned} coins
                            </span>
                          )}
                        </div>
                        <div className="stats-summary">
                          <p>{t("lesson_lives_remaining")} {lives}/3</p>
                        </div>
                        <button className="lesson-continue-btn" onClick={() => navigate('/courses')}>
                          {t("lesson_continue_btn")}
                        </button>
                </div>
            </main>
        </div>
    );
  }
  
 if (isGameOver) {
  return (
    <div className={`lesson-page ${currentTheme}`}>
      <main className="lesson-main result-view">
        <div className="result-card result-card-gameover">
          <div className="gameover-icon">💔</div>
          <h1 className="gameover-title">{t("lesson_out_of_lives")}</h1>
          <p className="gameover-message">
            {t("lesson_try_again_message")}
          </p>
          <button
            className="lesson-continue-btn gameover-retry-btn"
            onClick={() => window.location.reload()}
          >
            {t("lesson_try_again_btn")}
          </button>
          <button
            className="lesson-continue-btn gameover-quit-btn"
            onClick={() => navigate('/courses')}
          >
            {t("lesson_quit_btn")}
          </button>
        </div>
      </main>
    </div>
  );
}

  if (!currentExercise) return null;

  const isMultipleChoice = currentExercise.options && currentExercise.options.length > 0;

  return (
    <div className={`lesson-page ${currentTheme}`}>
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
                  {t("lesson_check_answer")}
                </button>
            </div>
        )}
      </main>

      <footer className={`lesson-footer ${feedback}`}>
            {feedback === 'correct' && (
                <div className="feedback-content">
                    <span className="feedback-icon">✅</span>
                    <span>{t("lesson_excellent")}</span>
                </div>
            )}
             {feedback === 'incorrect' && (
                <div className="feedback-content">
                    <span className="feedback-icon">❌</span>
                    {isMultipleChoice ? (
                        <span>{t("lesson_correct_answer_was")} <strong>{currentExercise.answer.toUpperCase()}</strong></span>
                    ) : (
                        <span>{t("lesson_correct_answer")} <strong>{currentExercise.answer}</strong></span>
                    )}
                </div>
            )}
      </footer>
    </div>
  );
};

export default LessonPage;