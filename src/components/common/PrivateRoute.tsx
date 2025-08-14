import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // roles được phép truy cập
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const reduxState = JSON.parse(localStorage.getItem("reduxState") || "{}");
  const userRole = reduxState?.auth?.role; // giả sử user.role lưu role

  // Chưa login
  if (!reduxState || !userRole) {
    return <Navigate to="/403" replace />; // hoặc /404 tùy bạn
  }

  // Kiểm tra role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
