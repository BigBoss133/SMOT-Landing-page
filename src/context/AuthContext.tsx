import {
  createContext, useContext, useMemo, useState, useEffect,
  type PropsWithChildren,
} from "react";
import * as api from "../services/api";

interface User { id: string; email: string }

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smot-token"));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;
    api.getMe(token).then(setUser).catch(() => { setToken(null); localStorage.removeItem("smot-token"); });
  }, [token]);

  const value = useMemo<AuthContextValue>(() => ({
    user, token, isAuthenticated: !!token,
    login: async (email, password) => {
      const res = await api.login(email, password);
      localStorage.setItem("smot-token", res.token);
      setToken(res.token);
      setUser(res.user);
    },
    register: async (email, password) => {
      const res = await api.register(email, password);
      localStorage.setItem("smot-token", res.token);
      setToken(res.token);
      setUser(res.user);
    },
    logout: () => {
      localStorage.removeItem("smot-token");
      setToken(null);
      setUser(null);
    },
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
