import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, useState, useEffect } from "react"; 
import "./css/theme.css"; 
import Home from "./components/Home/home.jsx";
import Login from "./components/Authorization/login.jsx";
import SignUp from "./components/Authorization/SignUp.jsx";
import Progress from "./components/Progress/Progress.jsx";
import Leaderboard from "./components/Leaderboard/Leaderboard.jsx";
import Courses from "./components/Courses/CoursesCategory";
import PythonPage from "./components/Courses/Python/PythonPage";
import Admin_Panel from './components/AdminPanel/Admin_Panel.jsx';
import ManageUsers from "./components/AdminPanel/ManageUsers";
import ManageLessons from './components/AdminPanel/ManageLessons.jsx';
import ManageGames from './components/AdminPanel/ManageGames.jsx';
import MiniGamesPage from './components/Games/MiniGamePage/MiniGamesPage.jsx';
import { GameWrapper } from './components/Games/GameWrapper';
import JavaScriptPage from "./components/Courses/JavaScript/JavaScriptPage.jsx";
import JavaPage from "./components/Courses/Java/JavaPage.jsx";
import HtmlCssPage from "./components/Courses/htmlcss/HtmlCssPage.jsx";
import ProfilePage from './components/ProfilePage/ProfilePage.jsx';
import Header from "./components/BasicSiteView/Header/Header";
import LessonPage from "./components/Courses/LessonPage/LessonPage.jsx";

const Loading = () => <div style={{ textAlign: 'center', padding: '50px' }}>Loading translations...</div>;
const themes = ['light', 'dark', 'pink'];

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && themes.includes(savedTheme)) {
    return savedTheme;
  }
  return 'light';
};

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  
  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    console.log(`Theme toggled. Current: ${theme}, Next: ${nextTheme}`);
    setTheme(nextTheme);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = `${theme}-theme`; 
  }, [theme]);
  
  const renderRouteElement = (Component) => (
    <Component theme={theme} toggleTheme={toggleTheme} />
  );

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={renderRouteElement(Home)} />
          <Route path="/login" element={renderRouteElement(Login)} />
          <Route path="/signup" element={renderRouteElement(SignUp)} />
          <Route path="/progress" element={renderRouteElement(Progress)} />
          <Route path="/leaderboard" element={renderRouteElement(Leaderboard)} />
          <Route path="/courses" element={renderRouteElement(Courses)} />
          <Route path="/courses/python" element={renderRouteElement(PythonPage)} />
          <Route path="/courses/javascript" element={renderRouteElement(JavaScriptPage)} />
          <Route path="/courses/java" element={renderRouteElement(JavaPage)} />
          <Route path="/courses/htmlcss" element={renderRouteElement(HtmlCssPage)} />
          <Route path="/minigames" element={renderRouteElement(MiniGamesPage)} />
          <Route path="/profile" element={renderRouteElement(ProfilePage)} />
          <Route path="/games/:gameId" element={renderRouteElement(GameWrapper)} />
          <Route path="/admin_panel" element={renderRouteElement(Admin_Panel)} />
          <Route path="/admin_panel/manage_users" element={renderRouteElement(ManageUsers)} />
          <Route path="/admin_panel/manage_lessons" element={renderRouteElement(ManageLessons)} />
          <Route path="/admin_panel/manage_games" element={renderRouteElement(ManageGames)} />
          <Route path="/courses/:course/lesson/:lessonId" element={renderRouteElement(LessonPage)} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;