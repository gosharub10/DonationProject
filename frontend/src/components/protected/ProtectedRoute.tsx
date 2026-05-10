import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import React from "react";

type Props = {
  children: React.ReactNode;
  roles?: string[];
};

const ProtectedRoute = ({ children, roles }: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // если роли заданы — проверяем доступ
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;