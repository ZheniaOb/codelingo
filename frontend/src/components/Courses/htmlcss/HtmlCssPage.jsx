import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../BasicSiteView/Footer/Footer";
import "./HtmlCssPage.css";

const API_URL = "http://localhost:5001/api";
const starIcon = "/img/icons/star.png";
const examIcon = "/img/icons/exam_trophy.png";

const HtmlCssPage = () => {

  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/courses/htmlcss`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to load course data");
      }

      const data = await response.json();
      const modulesFromApi = data.modules || [];
      const fixedModules = await hydrateMissingNodes(modulesFromApi, token);
      setModules(fixedModules);
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hydrateMissingNodes = async (rawModules, token) => {
    const anyHasNodes = rawModules.some((m) => Array.isArray(m.nodes) && m.nodes.length > 0);
    if (anyHasNodes) return rawModules;

    try {
      const modulesWithLessons = await Promise.all(
        rawModules.map(async (m, idx) => {
          const res = await fetch(`${API_URL.replace("/api", "")}/api/lessons/${m.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const lessons = (await res.json()) || [];

          const lessonNodes = lessons.map((lesson, lessonIdx) => ({
            id: lesson.id,
            type: "lesson",
            status: idx === 0 && lessonIdx === 0 ? "current" : "locked",
            lessonId: lesson.id,
          }));

          const nodes = lessonNodes.length
            ? [...lessonNodes, { id: `exam_${m.id}`, type: "exam", status: "exam" }]
            : [];

          return { ...m, nodes };
        })
      );
      return modulesWithLessons;
    } catch (err) {
      console.error("Error hydrating lessons for modules", err);
      return rawModules;
    }
  };

  const handleNodeClick = (node) => {
    const isQuiz = node.status === "quiz" || node.type === "quiz";
    if (node.status === "locked" || node.status === "exam" || isQuiz) return;
    if (!node.lessonId) return;
    navigate(`/courses/htmlcss/lesson/${node.lessonId}`);
  };

  const getThemeClass = (order) => {
    const themeNumber = ((order - 1) % 6) + 1;
    return `htmlcss-theme-${themeNumber}`;
  };

  if (loading) {
    return (
      <div className="htmlcss-page">
        <div style={{ padding: "40px", textAlign: "center" }}>Loading course...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="htmlcss-page">
        <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="htmlcss-page">

      <div className="htmlcss-themes-wrapper">
        {modules.map((module, moduleIndex) => {
          const themeClass = getThemeClass(module.order);
          return (
            <React.Fragment key={module.id}>
              <section className={`htmlcss-theme-path ${themeClass}`}>
                <div className="htmlcss-theme-header">
                  <h2 className="htmlcss-path-title">
                    <span className="htmlcss-theme-index">THEME {module.order}</span>
                    <span className="htmlcss-theme-name">{module.title?.toUpperCase()}</span>
                  </h2>
                </div>
                <div className="htmlcss-path-column">
                  {module.nodes.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      className={["htmlcss-path-node", node.type, node.status].join(" ")}
                      onClick={() => handleNodeClick(node)}
                      disabled={
                        node.status === "locked" ||
                        node.status === "exam" ||
                        node.status === "quiz" ||
                        node.type === "quiz"
                      }
                    >
                      <img
                        className="htmlcss-icon-img"
                        src={node.type === "exam" || node.type === "quiz" ? examIcon : starIcon}
                        alt={node.type}
                      />
                    </button>
                  ))}
                </div>
              </section>
              {moduleIndex < modules.length - 1 && (
                <div className="htmlcss-themes-divider" aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default HtmlCssPage;