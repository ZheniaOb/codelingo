import React from "react";
import { Link } from "react-router-dom";
import Footer from "../BasicSiteView/Footer/Footer";
import "./CoursesCategory.css";
import { useTranslation } from "react-i18next";

const COURSES = [
  { id: "python",     titleKey: "course_python",     lessons: 6 },
  { id: "javascript", titleKey: "course_javascript", lessons: 6 },
  { id: "java",       titleKey: "course_java",       lessons: 5 },
  { id: "htmlcss",    titleKey: "course_htmlcss",    lessons: 5 },
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

const CoursesList = ({ theme }) => {
  const { t } = useTranslation();

  return (
    <div className={`courses-page ${theme}`}>
      <section className="courses-hero">
        <h1 className="courses-title">{t("courses_title")}</h1>
        <p className="courses-subtitle">{t("courses_subtitle")}</p>
      </section>

      <div className="courses-main">
        {COURSES.map(c => (
          <Link
            key={c.id}
            to={`/courses/${c.id}`}
            className="course-link"
            aria-label={t("open_course", { title: t(c.titleKey), lessons: c.lessons })}
          >
            <article className="course-card">
              <div className="course-icon">{getIcon(c.id, t(c.titleKey))}</div>
              <h3 className="course-name">{t(c.titleKey)}</h3>
              <div className="course-meta">{t("lessons_count", { count: c.lessons })}</div>
            </article>
          </Link>
        ))}
      </div>

      <section className="howit" aria-labelledby="howit-title">
        <h2 id="howit-title" className="howit-title">{t("howit_title")}</h2>
        <ol className="howit-steps" aria-label={t("howit_steps_label")}>
          <li className="howit-step">
            <div className="howit-badge">1</div>
            <h3 className="howit-step-title">{t("howit_step1_title")}</h3>
            <p className="howit-step-text">{t("howit_step1_text")}</p>
          </li>
          <li className="howit-step">
            <div className="howit-badge">2</div>
            <h3 className="howit-step-title">{t("howit_step2_title")}</h3>
            <p className="howit-step-text">{t("howit_step2_text")}</p>
          </li>
          <li className="howit-step">
            <div className="howit-badge">3</div>
            <h3 className="howit-step-title">{t("howit_step3_title")}</h3>
            <p className="howit-step-text">{t("howit_step3_text")}</p>
          </li>
        </ol>
      </section>

      <Footer />
    </div>
  );
};

export default CoursesList;