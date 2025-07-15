"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  cnpj: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Evita problemas de hidratação: só renderiza após o client estar pronto
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Garante que o componente só renderize no client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const verifyMFA = async (code: string) => {
    const response = await fetch("/api/verify-mfa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
  };

  const login = async (email: string, password: string, mfaCode?: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (mfaCode) {
        await verifyMFA(mfaCode);
      }
      if (!response.ok) {
        console.error("[AuthContext] Erro no login:", data);
        throw new Error(data.message || "Erro ao realizar login.");
      }
      setIsAuthenticated(true);
      setUser(data.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("[AuthContext] Erro inesperado no login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Envia o token no corpo da requisição
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("[AuthContext] Erro no logout:", error);
        throw new Error(error.message || "Erro ao realizar logout.");
      }
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("[AuthContext] Erro inesperado no logout:", error);
      throw error;
    }
  };

  if (!isMounted) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
