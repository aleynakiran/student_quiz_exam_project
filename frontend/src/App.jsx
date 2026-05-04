import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CreateQuiz from "./pages/CreateQuiz.jsx";
import TakeExam from "./pages/TakeExam.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import SyllabusPreview from "./pages/SyllabusPreview.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/quizzes/new" element={<CreateQuiz />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/student/exam/:quizId" element={<TakeExam />} />
          <Route path="/student/result/:submissionId" element={<ResultPage />} />
          <Route path="/student/syllabus/distributed-systems" element={<SyllabusPreview />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
