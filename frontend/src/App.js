import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import SignUp from "./components/SignUp";
import Progress from "./components/Progress";
import Leaderboard from "./components/Leaderboard";
import Courses from "./components/Courses/CoursesCategory";
import PythonPage from "./components/Courses/Python/PythonPage";
import Admin_Panel from './components/Admin_Panel';
import ManageUsers from './components/AdminPanel/ManageUsers';
import ManageLessons from './components/AdminPanel/ManageLessons.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Basic routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/python" element={<PythonPage />} />
        <Route path="/admin_panel" element={<Admin_Panel />} />
        <Route path="/admin_panel/manage_users" element={<ManageUsers />} />
        <Route path="/admin_panel/manage_lessons" element={<ManageLessons />} />
      </Routes>
    </Router>
  );
}

export default App;
