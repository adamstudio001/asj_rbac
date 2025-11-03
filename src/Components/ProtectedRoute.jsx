import { useAuth } from "@/Providers/AuthProvider";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user } = useAuth();
  return user  ? <Outlet /> : <Navigate to="/" replace />;
}
