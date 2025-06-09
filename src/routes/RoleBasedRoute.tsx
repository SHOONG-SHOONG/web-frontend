import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useLogin } from "../contexts/AuthContext.tsx";

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
  const { isLoggedIn, role } = useLogin();
  const location = useLocation();

  if (!allowedRoles || !Array.isArray(allowedRoles)) {
    console.error("RoleBasedRoute: allowedRoles prop is missing or invalid");
    return <Navigate to="/" replace />;
  }

  if (!isLoggedIn || role === null) {
    return null;
  }

  // 대소문자 통일해서 체크
  const normalizedRole = role.toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  if (!normalizedAllowed.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
