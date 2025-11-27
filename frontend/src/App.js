import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import SignUp from "./components/SignUp";
import Progress from "./components/Progress";
import Leaderboard from "./components/Leaderboard";
import Courses from "./components/Courses/CoursesCategory";
import PythonPage from "./components/Courses/Python/PythonPage";
import React, { Suspense } from "react";
import Admin_Panel from './components/Admin_Panel';
import ManageUsers from './components/AdminPanel/ManageUsers';
import ManageLessons from './components/AdminPanel/ManageLessons.jsx';
import ManageGames from './components/AdminPanel/ManageGames.jsx';
import MiniGamesPage from './components/MiniGamesPage';
import { GameWrapper } from './components/Games/GameWrapper';
import JavaScriptPage from "./components/Courses/JavaScript/JavaScriptPage.jsx";
import JavaPage from "./components/Courses/Java/JavaPage.jsx";
import HtmlCssPage from "./components/Courses/htmlcss/HtmlCssPage.jsx";
import ProfilePage from './components/ProfilePage';
import LessonPage from "./components/Courses/LessonPage/LessonPage.jsx";

const Loading = () => <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}></Suspense>
      <Routes>
        {/* --- Basic routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/python" element={<PythonPage />} />
        <Route path="/courses/javascript" element={<JavaScriptPage />} />
        <Route path="/courses/java" element={<JavaPage />} />
        <Route path="/courses/htmlcss" element={<HtmlCssPage />} />
        <Route path="/minigames" element={<MiniGamesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/games/:gameId" element={<GameWrapper />} />
        <Route path="/admin_panel" element={<Admin_Panel />} />
        <Route path="/admin_panel/manage_users" element={<ManageUsers />} />
        <Route path="/admin_panel/manage_lessons" element={<ManageLessons />} />
        <Route path="/admin_panel/manage_games" element={<ManageGames />} />
        <Route path="/courses/:course/lesson/:lessonId" element={<LessonPage />} />
      </Routes>
    </Router>
  );
}

export default App;
