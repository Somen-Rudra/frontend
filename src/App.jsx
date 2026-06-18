import { Routes, Route } from "react-router-dom";
import AICodeExplanation from "./components/AICodeExplanation";
import AIFeaturesPage from "./pages/AIFeaturePage";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import Workspace from "./pages/Workspace";
import ProblemSet from "./pages/ProblemSet";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Contest from "./pages/Contests"
import Company from "./pages/Company";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div>
      <div className="app-with-sidebar">
        <Sidebar />
        <div className="app-with-sidebar__content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<Company />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/problemSet" element={<ProblemSet />} />
            <Route path="/ai-features" element={<AIFeaturesPage />} />
            <Route path="/problemSet/:slug" element={<Workspace />} />
            <Route
              path="/ai-features/code-explanation"
              element={<AICodeExplanation />}
            />

            <Route path="/contests" element={<Contest/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
