import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import SignUp from "./components/SignUp";
import Progress from "./components/Progress";
import Leaderboard from "./components/Leaderboard";
import Courses from "./components/Courses/CoursesCategory";
import PythonPage from "./components/Courses/Python/PythonPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/python" element={<PythonPage />} />
      </Routes>
    </Router>
  );
}

export default App;
