import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext.tsx";

interface RoleBasedRouteProps {
  allowedRoles: string[]; // 반드시 props로 넘어와야 함
}

const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
  const { isLoggedIn, role } = useLogin();
  const location = useLocation();

  // ⛔ 예외 처리 추가!
  if (!allowedRoles || !Array.isArray(allowedRoles)) {
    console.error("RoleBasedRoute: allowedRoles prop is missing or invalid");
    return <Navigate to="/" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={location.pathname} replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
