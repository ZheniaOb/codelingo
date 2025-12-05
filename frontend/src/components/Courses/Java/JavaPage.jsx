import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../BasicSiteView/Footer/Footer";
import "./JavaPage.css";

const starIcon = "/img/icons/star.png";
const examIcon = "/img/icons/exam_trophy.png";

const javaPath1 = [
  { id: 1, type: "lesson", status: "completed", lessonId: 1 },
  { id: 2, type: "lesson", status: "completed", lessonId: 2 },
  { id: 3, type: "lesson", status: "completed", lessonId: 3 },
  { id: 4, type: "lesson", status: "current", lessonId: 4 },
  { id: 5, type: "exam",   status: "exam" },
];

const javaPath2 = [
  { id: 6,  type: "lesson", status: "locked" },
  { id: 7,  type: "lesson", status: "locked" },
  { id: 8,  type: "lesson", status: "locked" },
  { id: 9,  type: "lesson", status: "locked" },
  { id: 10, type: "exam",   status: "exam" },
];

const javaPath3 = [
  { id: 11, type: "lesson", status: "locked" },
  { id: 12, type: "lesson", status: "locked" },
  { id: 13, type: "lesson", status: "locked" },
  { id: 14, type: "lesson", status: "locked" },
  { id: 15, type: "exam",   status: "exam" },
];

const javaPath4 = [
  { id: 16, type: "lesson", status: "locked" },
  { id: 17, type: "lesson", status: "locked" },
  { id: 18, type: "lesson", status: "locked" },
  { id: 19, type: "lesson", status: "locked" },
  { id: 20, type: "exam",   status: "exam" },
];

const javaPath5 = [
  { id: 21, type: "lesson", status: "locked" },
  { id: 22, type: "lesson", status: "locked" },
  { id: 23, type: "lesson", status: "locked" },
  { id: 24, type: "lesson", status: "locked" },
  { id: 25, type: "exam",   status: "exam" },
];

const javaPath6 = [
  { id: 26, type: "lesson", status: "locked" },
  { id: 27, type: "lesson", status: "locked" },
  { id: 28, type: "lesson", status: "locked" },
  { id: 29, type: "lesson", status: "locked" },
  { id: 30, type: "exam",   status: "exam" },
];

const JavaPage = () => {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState("light");

  const handleNodeClick = (node) => {
    if (node.status === "locked") return;
    if (!node.lessonId) return;
    navigate(`/courses/java/lesson/${node.lessonId}`);
  };

  return (
    <div className={`htmlcss-page ${currentTheme}-theme`}>
      
      <div className="java-themes-wrapper">
        {/* THEME 1 */}
        <section className="java-theme-path java-theme-1">
          <div className="java-theme-header">
            <h2 className="java-path-title">
              <span className="java-theme-index">THEME 1</span>
              <span className="java-theme-name">JAVA BASICS & VARIABLES</span>
            </h2>
          </div>
          <div className="java-path-column">
            {javaPath1.map((n) => (
              <button
                key={n.id}
                type="button"
                className={["java-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="java-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="java-themes-divider" aria-hidden="true" />

        {/* THEME 2 */}
        <section className="java-theme-path java-theme-2">
          <div className="java-theme-header">
            <h2 className="java-path-title">
              <span className="java-theme-index">THEME 2</span>
              <span className="java-theme-name">CONDITIONS & LOGIC</span>
            </h2>
          </div>
          <div className="java-path-column">
            {javaPath2.map((n) => (
              <button
                key={n.id}
                type="button"
                className={["java-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="java-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="java-themes-divider" aria-hidden="true" />

        {/* THEME 3 */}
        <section className="java-theme-path java-theme-3">
          <div className="java-theme-header">
            <h2 className="java-path-title">
              <span className="java-theme-index">THEME 3</span>
              <span className="java-theme-name">LOOPS</span>
            </h2>
          </div>
          <div className="java-path-column">
            {javaPath3.map((n) => (
              <button
                key={n.id}
                type="button"
                className={["java-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="java-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="java-themes-divider" aria-hidden="true" />

        {/* THEME 4 */}
        <section className="java-theme-path java-theme-4">
          <div className="java-theme-header">
            <h2 className="java-path-title">
              <span className="java-theme-index">THEME 4</span>
              <span className="java-theme-name">COLLECTIONS</span>
            </h2>
          </div>
          <div className="java-path-column">
            {javaPath4.map((n) => (
              <button
                key={n.id}
                type="button"
                className={["java-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="java-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="java-themes-divider" aria-hidden="true" />

        {/* THEME 5 */}
        <section className="java-theme-path java-theme-5">
          <div className="java-theme-header">
            <h2 className="java-path-title">
              <span className="java-theme-index">THEME 5</span>
              <span className="java-theme-name">OOP BASICS</span>
            </h2>
          </div>
          <div className="java-path-column">
            {javaPath5.map((n) => (
              <button
                key={n.id}
                type="button"
                className={["java-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="java-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="java-themes-divider" aria-hidden="true" />

        {/* THEME 6 */}
        <section className="java-theme-path java-theme-6">
          <div className="java-theme-header">
            <h2 className="java-path-title">
              <span className="java-theme-index">THEME 6</span>
              <span className="java-theme-name">PRACTICE & PROJECTS</span>
            </h2>
          </div>
          <div className="java-path-column">
            {javaPath6.map(n => (
              <button
                key={n.id}
                type="button"
                className={["java-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="java-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default JavaPage;