import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userRole = reduxState?.auth?.role;

  // Nếu đã login → không cho vào login page
  if (userRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
