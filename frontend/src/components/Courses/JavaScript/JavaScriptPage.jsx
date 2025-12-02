import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../BasicSiteView/Footer/Footer";
import "./JavaScriptPage.css";

const starIcon = "/img/icons/star.png";
const examIcon = "/img/icons/exam_trophy.png";

const jsPath1 = [
  { id: 1, type: "lesson", status: "completed", lessonId: 1 },
  { id: 2, type: "lesson", status: "completed", lessonId: 2 },
  { id: 3, type: "lesson", status: "completed", lessonId: 3 },
  { id: 4, type: "lesson", status: "current", lessonId: 4 },
  { id: 5, type: "exam",   status: "exam" },
];

const jsPath2 = [
  { id: 6,  type: "lesson", status: "locked" },
  { id: 7,  type: "lesson", status: "locked" },
  { id: 8,  type: "lesson", status: "locked" },
  { id: 9,  type: "lesson", status: "locked" },
  { id: 10, type: "exam",   status: "exam" },
];

const jsPath3 = [
  { id: 11, type: "lesson", status: "locked" },
  { id: 12, type: "lesson", status: "locked" },
  { id: 13, type: "lesson", status: "locked" },
  { id: 14, type: "lesson", status: "locked" },
  { id: 15, type: "exam",   status: "exam" },
];

const jsPath4 = [
  { id: 16, type: "lesson", status: "locked" },
  { id: 17, type: "lesson", status: "locked" },
  { id: 18, type: "lesson", status: "locked" },
  { id: 19, type: "lesson", status: "locked" },
  { id: 20, type: "exam",   status: "exam" },
];

const jsPath5 = [
  { id: 21, type: "lesson", status: "locked" },
  { id: 22, type: "lesson", status: "locked" },
  { id: 23, type: "lesson", status: "locked" },
  { id: 24, type: "lesson", status: "locked" },
  { id: 25, type: "exam",   status: "exam" },
];

const jsPath6 = [
  { id: 26, type: "lesson", status: "locked" },
  { id: 27, type: "lesson", status: "locked" },
  { id: 28, type: "lesson", status: "locked" },
  { id: 29, type: "lesson", status: "locked" },
  { id: 30, type: "exam",   status: "exam" },
];

const JavaScriptPage = () => {
   const navigate = useNavigate();

  const handleNodeClick = (node) => {
    if (node.status === "locked") return;
    if (!node.lessonId) return;
    navigate(`/courses/javascript/lesson/${node.lessonId}`);
  };

  return (
    <div className="js-page">

      <div className="js-themes-wrapper">
        {/* Theme 1 */}
        <section className="js-theme-path js-theme-1">
          <div className="js-theme-header">
            <h2 className="js-path-title">
              <span className="js-theme-index">THEME 1</span>
              <span className="js-theme-name">JS BASICS & VARIABLES</span>
            </h2>
          </div>
          <div className="js-path-column">
            {jsPath1.map(n => (
               <button
                key={n.id}
                type="button"
                className={["js-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="js-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="js-themes-divider" aria-hidden="true" />

        {/* Theme 2 */}
        <section className="js-theme-path js-theme-2">
          <div className="js-theme-header">
            <h2 className="js-path-title">
              <span className="js-theme-index">THEME 2</span>
              <span className="js-theme-name">CONDITIONS (IF STATEMENTS)</span>
            </h2>
          </div>
          <div className="js-path-column">
            {jsPath2.map(n => (
             <button
                key={n.id}
                type="button"
                className={["js-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="js-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="js-themes-divider" aria-hidden="true" />

        {/* Theme 3 */}
        <section className="js-theme-path js-theme-3">
          <div className="js-theme-header">
            <h2 className="js-path-title">
              <span className="js-theme-index">THEME 3</span>
              <span className="js-theme-name">LOOPS</span>
            </h2>
          </div>
          <div className="js-path-column">
            {jsPath3.map(n => (
             <button
                key={n.id}
                type="button"
                className={["js-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="js-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="js-themes-divider" aria-hidden="true" />

        {/* Theme 4 */}
        <section className="js-theme-path js-theme-4">
          <div className="js-theme-header">
            <h2 className="js-path-title">
              <span className="js-theme-index">THEME 4</span>
              <span className="js-theme-name">ARRAYS AND DATA HANDLING</span>
            </h2>
          </div>
          <div className="js-path-column">
            {jsPath4.map(n => (
            <button
                key={n.id}
                type="button"
                className={["js-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="js-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="js-themes-divider" aria-hidden="true" />

        {/* Theme 5 */}
        <section className="js-theme-path js-theme-5">
          <div className="js-theme-header">
            <h2 className="js-path-title">
              <span className="js-theme-index">THEME 5</span>
              <span className="js-theme-name">FUNCTIONS AND PROGRAM STRUCTURE</span>
            </h2>
          </div>
          <div className="js-path-column">
            {jsPath5.map(n => (
              <button
                key={n.id}
                type="button"
                className={["js-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="js-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="js-themes-divider" aria-hidden="true" />

        {/* Theme 6 */}
        <section className="js-theme-path js-theme-6">
          <div className="js-theme-header">
            <h2 className="js-path-title">
              <span className="js-theme-index">THEME 6</span>
              <span className="js-theme-name">OBJECTS & PRACTICAL USES</span>
            </h2>
          </div>
          <div className="js-path-column">
            {jsPath6.map(n => (
              <button
                key={n.id}
                type="button"
                className={["js-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="js-icon-img"
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

export default JavaScriptPage;