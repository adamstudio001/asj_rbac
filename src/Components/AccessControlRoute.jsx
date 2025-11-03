import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Providers/AuthProvider";

export default function AccessControlRoute({ checkAccess, redirectTo = "/dashboard" }) {
  const auth = useAuth();
  if (checkAccess && !checkAccess(auth)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}
