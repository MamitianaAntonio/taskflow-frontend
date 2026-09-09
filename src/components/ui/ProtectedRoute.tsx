import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import { ROUTES } from "../../constants/routes";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <>{children}</>;
}