import React from "react";
import { Link } from "react-router-dom";
import Header from "../BasicSiteView/Header/Header";
import Footer from "../BasicSiteView/Footer/Footer";
import "./CoursesCategory.css";

const COURSES = [
  { id: "python",     title: "Python",     lessons: 6 },
  { id: "javascript", title: "JavaScript", lessons: 6 },
  { id: "java",       title: "Java",       lessons: 5 },
  { id: "htmlcss",    title: "HTML / CSS", lessons: 5 },
];

const getIcon = (id, title) => {
  const srcMap = {
    python: "/img/icons/py.png",
    javascript: "/img/icons/js.png",
    java: "/img/icons/java.png",
    htmlcss: "/img/icons/html_css.png",
  };
  const src = srcMap[id] || "/img/icons/placeholder.png";
  return (
    <img
      src={src}
      alt={`${title} logo`}
      className="course-icon-img"
      loading="lazy"
      width="54"
      height="54"
    />
  );
};

const CoursesList = () => (
  <div className="courses-page">
    <Header />

    <section className="courses-hero">
      <h1 className="courses-title">Choose your course</h1>
      <p className="courses-subtitle">
        Pick a track and start learning with short lessons and XP.
      </p>
    </section>

    <div className="courses-main">
      {COURSES.map(c => (
        <Link
          key={c.id}
          to={`/courses/${c.id}`}
          className="course-link"
          aria-label={`Open ${c.title} course (${c.lessons} lessons)`}
        >
          <article className="course-card">
            <div className="course-icon">{getIcon(c.id, c.title)}</div>
            <h3 className="course-name">{c.title}</h3>
            <div className="course-meta">{c.lessons} lessons</div>
          </article>
        </Link>
      ))}
    </div>

    <section className="howit" aria-labelledby="howit-title">
      <h2 id="howit-title" className="howit-title">How it works</h2>
      <ol className="howit-steps" aria-label="Learning process steps">
        <li className="howit-step">
          <div className="howit-badge">1</div>
          <h3 className="howit-step-title">Select a course</h3>
          <p className="howit-step-text">Pick the direction you want and open a course.</p>
        </li>
        <li className="howit-step">
          <div className="howit-badge">2</div>
          <h3 className="howit-step-title">Complete short lessons</h3>
          <p className="howit-step-text">Learn in small chunks and reinforce with practice.</p>
        </li>
        <li className="howit-step">
          <div className="howit-badge">3</div>
          <h3 className="howit-step-title">Earn XP</h3>
          <p className="howit-step-text">Gain points and climb the leaderboard.</p>
        </li>
      </ol>
    </section>

    <Footer />
  </div>
);

export default CoursesList;