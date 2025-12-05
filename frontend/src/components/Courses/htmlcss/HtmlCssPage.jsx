import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../BasicSiteView/Footer/Footer";
import "./HtmlCssPage.css";

const starIcon = "/img/icons/star.png";
const examIcon = "/img/icons/exam_trophy.png";

const htmlCssPath1 = [
  { id: 1, type: "lesson", status: "completed", lessonId: 1 },
  { id: 2, type: "lesson", status: "completed", lessonId: 2 },
  { id: 3, type: "lesson", status: "completed", lessonId: 3 },
  { id: 4, type: "lesson", status: "current", lessonId: 4 },
  { id: 5, type: "exam",   status: "exam" },
];

const htmlCssPath2 = [
  { id: 6,  type: "lesson", status: "locked" },
  { id: 7,  type: "lesson", status: "locked" },
  { id: 8,  type: "lesson", status: "locked" },
  { id: 9,  type: "lesson", status: "locked" },
  { id: 10, type: "exam",   status: "exam" },
];

const htmlCssPath3 = [
  { id: 11, type: "lesson", status: "locked" },
  { id: 12, type: "lesson", status: "locked" },
  { id: 13, type: "lesson", status: "locked" },
  { id: 14, type: "lesson", status: "locked" },
  { id: 15, type: "exam",   status: "exam" },
];

const htmlCssPath4 = [
  { id: 16, type: "lesson", status: "locked" },
  { id: 17, type: "lesson", status: "locked" },
  { id: 18, type: "lesson", status: "locked" },
  { id: 19, type: "lesson", status: "locked" },
  { id: 20, type: "exam",   status: "exam" },
];

const htmlCssPath5 = [
  { id: 21, type: "lesson", status: "locked" },
  { id: 22, type: "lesson", status: "locked" },
  { id: 23, type: "lesson", status: "locked" },
  { id: 24, type: "lesson", status: "locked" },
  { id: 25, type: "exam",   status: "exam" },
];

const htmlCssPath6 = [
  { id: 26, type: "lesson", status: "locked" },
  { id: 27, type: "lesson", status: "locked" },
  { id: 28, type: "lesson", status: "locked" },
  { id: 29, type: "lesson", status: "locked" },
  { id: 30, type: "exam",   status: "exam" },
];

const HtmlCssPage = () => {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState("light"); 

  const handleNodeClick = (node) => {
    if (node.status === "locked") return;
    if (!node.lessonId) return;
    navigate(`/courses/htmlcss/lesson/${node.lessonId}`);
  };

  return (
    <div className={`htmlcss-page ${currentTheme}-theme`}>

      <div className="htmlcss-themes-wrapper">
       {/* THEME 1 */}
        <section className="htmlcss-theme-path htmlcss-theme-1">
        <div className="htmlcss-theme-header">
          <h2 className="htmlcss-path-title">
            <span className="htmlcss-theme-index">THEME 1</span>
            <span className="htmlcss-theme-name">HTML BASICS & STRUCTURE</span>
           </h2>
         </div>
         <div className="htmlcss-path-column">
           {htmlCssPath1.map((n) => (
             <button
               key={n.id}
               type="button"
               className={["htmlcss-path-node", n.type, n.status].join(" ")}
               onClick={() => handleNodeClick(n)}
              >
               <img
                 className="htmlcss-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                 alt={n.type}
                />
              </button>
           ))}
         </div>
          </section>

            <div className="htmlcss-themes-divider" aria-hidden="true" />
        {/* THEME 2 */}
        <section className="htmlcss-theme-path htmlcss-theme-2">
          <div className="htmlcss-theme-header">
            <h2 className="htmlcss-path-title">
              <span className="htmlcss-theme-index">THEME 2</span>
              <span className="htmlcss-theme-name">CSS BASICS & SELECTORS</span>
            </h2>
          </div>
          <div className="htmlcss-path-column">
            {htmlCssPath2.map(n => (
              <button
                key={n.id}
                type="button"
                className={["htmlcss-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="htmlcss-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="htmlcss-themes-divider" aria-hidden="true" />

        {/* THEME 3 */}
        <section className="htmlcss-theme-path htmlcss-theme-3">
          <div className="htmlcss-theme-header">
            <h2 className="htmlcss-path-title">
              <span className="htmlcss-theme-index">THEME 3</span>
              <span className="htmlcss-theme-name">LAYOUT & FLEXBOX</span>
            </h2>
          </div>
          <div className="htmlcss-path-column">
            {htmlCssPath3.map(n => (
              <button
                key={n.id}
                type="button"
                className={["htmlcss-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="htmlcss-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="htmlcss-themes-divider" aria-hidden="true" />

        {/* THEME 4 */}
        <section className="htmlcss-theme-path htmlcss-theme-4">
          <div className="htmlcss-theme-header">
            <h2 className="htmlcss-path-title">
              <span className="htmlcss-theme-index">THEME 4</span>
              <span className="htmlcss-theme-name">RESPONSIVE DESIGN</span>
            </h2>
          </div>
          <div className="htmlcss-path-column">
            {htmlCssPath4.map(n => (
              <button
                key={n.id}
                type="button"
                className={["htmlcss-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="htmlcss-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="htmlcss-themes-divider" aria-hidden="true" />

        {/* THEME 5 */}
        <section className="htmlcss-theme-path htmlcss-theme-5">
          <div className="htmlcss-theme-header">
            <h2 className="htmlcss-path-title">
              <span className="htmlcss-theme-index">THEME 5</span>
              <span className="htmlcss-theme-name">ANIMATIONS & TRANSITIONS</span>
            </h2>
          </div>
          <div className="htmlcss-path-column">
            {htmlCssPath5.map(n => (
                <button
                key={n.id}
                type="button"
                className={["htmlcss-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="htmlcss-icon-img"
                  src={n.type === "exam" ? examIcon : starIcon}
                  alt={n.type}
                />
              </button>
            ))}
          </div>
        </section>

        <div className="htmlcss-themes-divider" aria-hidden="true" />

        {/* THEME 6 */}
        <section className="htmlcss-theme-path htmlcss-theme-6">
          <div className="htmlcss-theme-header">
            <h2 className="htmlcss-path-title">
              <span className="htmlcss-theme-index">THEME 6</span>
              <span className="htmlcss-theme-name">FINAL PROJECT</span>
            </h2>
          </div>
          <div className="htmlcss-path-column">
            {htmlCssPath6.map(n => (
                <button
                key={n.id}
                type="button"
                className={["htmlcss-path-node", n.type, n.status].join(" ")}
                onClick={() => handleNodeClick(n)}
              >
                <img
                  className="htmlcss-icon-img"
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

export default HtmlCssPage;