import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LessonPage.css";


const LessonPage = () => {
  const { course, lessonId } = useParams();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div className="lesson-page">
      <main className="lesson-main">
        <button
          type="button"
          className="lesson-back-button"
          onClick={handleBackClick}
        >
          ← Back
        </button>

        <h1>Lesson {lessonId}</h1>
        <p>Course: {course}</p>
      </main>
    </div>
  );
};

export default LessonPage;