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

const PythonPage = () => {
  return (
    <div className="python-page">
      <Header />

      <div className="themes-wrapper">
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
      </div>

      <Footer />
    </div>
  );
};

export default PythonPage;


