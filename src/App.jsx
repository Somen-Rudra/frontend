import { Routes, Route } from "react-router-dom";
import AICodeExplanation from "./components/AICodeExplanation";
import AIFeaturesPage from "./pages/AIFeaturePage";
import WorkSpace from "./pages/Workspace";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";

export default function App() {
  return (
    <div>
      <div className="app-with-sidebar">
        <Sidebar />
        <div className="app-with-sidebar__content">
          <Routes>
            <Route path="/ai-features" element={<AIFeaturesPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/problems" element={<WorkSpace />} />
            <Route path="/ai-features/code-explanation" element={<AICodeExplanation />} />
            {/* other routes */}
          </Routes>
        </div>
      </div>
    </div>
  );
}
