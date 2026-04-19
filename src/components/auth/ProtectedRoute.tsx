import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/src/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "employer" | "student")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    const isAskingForAdmin = allowedRoles?.includes("admin");
    const loginPath = isAskingForAdmin ? "/admin-login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Prime admin is allowed to access every protected section.
  if (user?.role === 'admin') {
    return <>{children}</>;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
    const redirectPath = user.role === 'employer' ? '/employer' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
