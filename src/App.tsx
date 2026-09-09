import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Spinner from "./components/ui/Spinner";
import Dashboard from "./pages/Dashboard";
import { ROUTES } from "./constants/routes";

const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const TaskboardPage = lazy(() => import("./pages/TaskboardPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailsPage = lazy(() => import("./pages/ProjectDetailsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--bg-primary)">
      <Spinner />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
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
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path={ROUTES.home} element={<Home />} />
              <Route path={ROUTES.login} element={<Auth />} />

              <Route
                path={ROUTES.dashboard}
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="tasks" element={<TaskboardPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;