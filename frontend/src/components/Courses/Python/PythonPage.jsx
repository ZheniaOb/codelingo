import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../BasicSiteView/Footer/Footer";
import "./PythonPage.css";

const API_URL = "http://localhost:5001/api";
const starIcon = "/img/icons/star.png";
const examIcon = "/img/icons/exam_trophy.png";

const PythonPage = () => {
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
      const response = await fetch(`${API_URL}/courses/python`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error("Failed to load course data");
      }
      
      const data = await response.json();
      setModules(data.modules || []);
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node) => {
    if (node.status === "locked" || node.status === "exam") return;
    if (!node.lessonId) return;
    navigate(`/courses/python/lesson/${node.lessonId}`);
  };

  if (loading) {
    return (
      <div className="python-page">
        <div style={{ padding: "40px", textAlign: "center" }}>Loading course...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="python-page">
        <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
          Error: {error}
        </div>
      </div>
    );
  }

  // Determine theme class based on module order (alternating left/right)
  const getThemeClass = (order) => {
    const themeNumber = ((order - 1) % 6) + 1;
    return `theme-${themeNumber}`;
  };

  return (
    <div className="python-page">
      <div className="themes-wrapper">
        {modules.map((module, moduleIndex) => {
          const themeClass = getThemeClass(module.order);
          return (
            <React.Fragment key={module.id}>
              <section className={`theme-path ${themeClass}`}>
                <div className="theme-header">
                  <h2 className="path-title">
                    <span className="theme-index">THEME {module.order}</span>
                    <span className="theme-name">{module.title.toUpperCase()}</span>
                  </h2>
                </div>
                <div className="path-column">
                  {module.nodes.map((node, nodeIndex) => (
                    <button
                      key={node.id}
                      type="button"
                      className={["path-node", node.type, node.status].join(" ")}
                      onClick={() => handleNodeClick(node)}
                      disabled={node.status === "locked" || node.status === "exam"}
                    >
                      <img
                        className="icon-img"
                        src={node.type === "exam" ? examIcon : starIcon}
                        alt={node.type}
                      />
                    </button>
                  ))}
                </div>
              </section>
              {moduleIndex < modules.length - 1 && (
                <div className="themes-divider" aria-hidden="true"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};

export default PythonPage;