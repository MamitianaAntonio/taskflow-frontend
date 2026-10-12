import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        locale="en"
      >
        <ThemeProvider>
          <Toaster
            position="bottom-right"
            gutter={10}
            toastOptions={{
              style: {
                background: "transparent",
                boxShadow: "none",
                padding: "0",
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
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;