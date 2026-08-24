import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardProfile from "./components/DashboardProfile/DashboardProfile";
import Taskboard from "./components/TaskBoard/Taskboard";
import Projects from "./components/Projects/Projects";
import ProjectDetails from "./components/Projects/ProjectDetails";
import Settings from "./components/Settings/Settings";

function App() {
  return (
    <ThemeProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            boxShadow: "0 10px 30px var(--shadow-pink)",
          },
          success: {
            iconTheme: {
              primary: "var(--color-success)",
              secondary: "var(--bg-secondary)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--color-error)",
              secondary: "var(--bg-secondary)",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardProfile />}></Route>
            <Route path="tasks" element={<Taskboard />}></Route>
            <Route path="projects" element={<Projects />}></Route>
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
