import React from "react";
import Header from "../../BasicSiteView/Header/Header";
import Footer from "../../BasicSiteView/Footer/Footer";
import "./PythonPage.css";

const starIcon = "/img/icons/star.png";
const examIcon = "/img/icons/exam_trophy.png";

const pathNodes = [
  { id: 1, type: "lesson", status: "completed" },
  { id: 2, type: "lesson", status: "completed" },
  { id: 3, type: "lesson", status: "completed" },
  { id: 4, type: "lesson", status: "current" },
  { id: 5, type: "exam",   status: "exam" },
];

const pathNodes2 = [
  { id: 6,  type: "lesson", status: "locked" },
  { id: 7,  type: "lesson", status: "locked" },
  { id: 8,  type: "lesson", status: "locked" },
  { id: 9,  type: "lesson", status: "locked" },
  { id: 10, type: "exam",   status: "exam" },
];

const pathNodes3 = [
  { id: 11, type: "lesson", status: "locked" },
  { id: 12, type: "lesson", status: "locked" },
  { id: 13, type: "lesson", status: "locked" },
  { id: 14, type: "lesson", status: "locked" },
  { id: 15, type: "exam",   status: "exam" },
];
const pathNodes4 = [
  { id: 16, type: "lesson", status: "locked" },
  { id: 17, type: "lesson", status: "locked" },
  { id: 18, type: "lesson", status: "locked" },
  { id: 19, type: "lesson", status: "locked" },
  { id: 20, type: "exam",   status: "exam" },
];
const pathNodes5 = [
  { id: 21, type: "lesson", status: "locked" },
  { id: 22, type: "lesson", status: "locked" },
  { id: 23, type: "lesson", status: "locked" },
  { id: 24, type: "lesson", status: "locked" },
  { id: 25, type: "exam",   status: "exam" },
];
const pathNodes6 = [
  { id: 26, type: "lesson", status: "locked" },
  { id: 27, type: "lesson", status: "locked" },
  { id: 28, type: "lesson", status: "locked" },
  { id: 29, type: "lesson", status: "locked" },
  { id: 30, type: "exam",   status: "exam" },
];

const PythonPage = () => {
  return (
    <div className="python-page">
      <Header />
      <div className="themes-wrapper">
        {/* Theme 1 (left) */}
        <section className="theme-path theme-1">
          <div className="theme-header">
            <h2 className="path-title">
              <span className="theme-index">THEME 1</span>
              <span className="theme-name">VARIABLES AND DATA TYPES</span>
            </h2>
          </div>
          <div className="path-column">
            {pathNodes.map(n => (
              <div key={n.id} className={["path-node", n.type, n.status].join(" ")}>
                <img className="icon-img" src={n.type === "exam" ? examIcon : starIcon} alt={n.type} />
              </div>
            ))}
          </div>
        </section>

        <div className="themes-divider" aria-hidden="true"></div>

        {/* Theme 2 (right) */}
        <section className="theme-path theme-2">
          <div className="theme-header">
            <h2 className="path-title">
              <span className="theme-index">THEME 2</span>
              <span className="theme-name">CONDITIONS (IF STATEMENTS)</span>
            </h2>
          </div>
          <div className="path-column">
            {pathNodes2.map(n => (
              <div key={n.id} className={["path-node", n.type, n.status].join(" ")}>
                <img className="icon-img" src={n.type === "exam" ? examIcon : starIcon} alt={n.type} />
              </div>
            ))}
          </div>
        </section>

<div className="themes-divider" aria-hidden="true"></div>

        {/* Theme 3 (left) */}
        <section className="theme-path theme-3">
          <div className="theme-header">
            <h2 className="path-title">
              <span className="theme-index">THEME 3</span>
              <span className="theme-name">LOOPS</span>
            </h2>
          </div>
          <div className="path-column">
            {pathNodes3.map(n => (
              <div key={n.id} className={["path-node", n.type, n.status].join(" ")}>
                <img className="icon-img" src={n.type === "exam" ? examIcon : starIcon} alt={n.type}/>
              </div>
            ))}
          </div>
        </section>

        <div className="themes-divider" aria-hidden="true"></div>

        {/* Theme 4 (right) */}
        <section className="theme-path theme-4">
          <div className="theme-header">
            <h2 className="path-title">
              <span className="theme-index">THEME 4</span>
              <span className="theme-name">LISTS AND COLLECTIONS</span>
            </h2>
          </div>
          <div className="path-column">
            {pathNodes4.map(n => (
              <div key={n.id} className={["path-node", n.type, n.status].join(" ")}>
                <img className="icon-img" src={n.type === "exam" ? examIcon : starIcon} alt={n.type}/>
              </div>
            ))}
          </div>
        </section>

        <div className="themes-divider" aria-hidden="true"></div>

        {/* Theme 5 (left) */}
        <section className="theme-path theme-5">
          <div className="theme-header">
            <h2 className="path-title">
              <span className="theme-index">THEME 5</span>
              <span className="theme-name">FUNCTIONS AND PROGRAM STRUCTURE</span>
            </h2>
          </div>
          <div className="path-column">
            {pathNodes5.map(n => (
              <div key={n.id} className={["path-node", n.type, n.status].join(" ")}>
                <img className="icon-img" src={n.type === "exam" ? examIcon : starIcon} alt={n.type}/>
              </div>
            ))}
          </div>
        </section>

        <div className="themes-divider" aria-hidden="true"></div>

        {/* Theme 6 (right) */}
        <section className="theme-path theme-6">
          <div className="theme-header">
            <h2 className="path-title">
              <span className="theme-index">THEME 6</span>
              <span className="theme-name">DATA STRUCTURES & PRACTICAL USES</span>
            </h2>
          </div>
            <div className="path-column">
              {pathNodes6.map(n => (
                <div key={n.id} className={["path-node", n.type, n.status].join(" ")}>
                  <img className="icon-img" src={n.type === "exam" ? examIcon : starIcon} alt={n.type}/>
                </div>
              ))}
            </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PythonPage;