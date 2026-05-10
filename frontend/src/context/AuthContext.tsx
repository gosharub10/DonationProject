import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "../models/AuthUser";

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;

  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const decodeToken = (jwt: string): AuthUser => {
    const decoded = jwtDecode<JwtPayload>(jwt);

    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  };

  const isTokenValid = (jwt: string) => {
    const decoded = jwtDecode<JwtPayload>(jwt);
    return decoded.exp * 1000 > Date.now();
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) return;

    if (!isTokenValid(savedToken)) {
      localStorage.removeItem("token");
      return;
    }

    setToken(savedToken);
    setUser(decodeToken(savedToken));
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setUser(decodeToken(newToken));
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
      <AuthContext.Provider value={{ user, token, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};