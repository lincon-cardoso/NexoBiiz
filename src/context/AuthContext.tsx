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
// teste
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

  const login = async (email: string, password: string) => {
    try {
      function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      }
      let csrfToken = getCookie("csrf-token");
      let attempts = 0;
      if (!csrfToken) {
        await fetch("/api/login", { method: "GET", credentials: "include" });
        while (!csrfToken && attempts < 10) {
          await new Promise((res) => setTimeout(res, 50));
          csrfToken = getCookie("csrf-token");
          attempts++;
        }
      }
      if (!csrfToken) {
        throw new Error(
          "Não foi possível obter o token CSRF. Limpe os cookies e tente novamente."
        );
      }
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
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
      function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      }
      let csrfToken = getCookie("csrf-token");
      let attempts = 0;
      while (!csrfToken && attempts < 10) {
        await new Promise((res) => setTimeout(res, 50));
        csrfToken = getCookie("csrf-token");
        attempts++;
      }
      if (!csrfToken) {
        throw new Error(
          "Não foi possível obter o token CSRF. Limpe os cookies e tente novamente."
        );
      }
      // Envia o token no corpo da requisição
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ csrfToken }),
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
