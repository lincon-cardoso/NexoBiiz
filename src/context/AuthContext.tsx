"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
// teste
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Evita problemas de hidratação: só renderiza após o client estar pronto
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Garante que o componente só renderize no client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("[AuthContext] Iniciando login...");
      // Só chama GET /api/login se não houver cookie CSRF
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
      console.log("[AuthContext] Resposta da API:", response);
      if (!response.ok) {
        const error = await response.json();
        console.error("[AuthContext] Erro no login:", error);
        throw new Error(error.message || "Erro ao realizar login.");
      }
      setIsAuthenticated(true);
      console.log(
        "[AuthContext] Login bem-sucedido. Redirecionando para /dashboard..."
      );
      router.push("/dashboard");
    } catch (error) {
      console.error("[AuthContext] Erro inesperado no login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("[AuthContext] Iniciando logout...");
      console.log(
        "[AuthContext] Todos os cookies antes do logout:",
        document.cookie
      );
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
      console.log(
        "[AuthContext] CSRF token do cookie antes do logout:",
        csrfToken
      );
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
      console.log("[AuthContext] Resposta da API logout:", response);
      if (!response.ok) {
        const error = await response.json();
        console.error("[AuthContext] Erro no logout:", error);
        throw new Error(error.message || "Erro ao realizar logout.");
      }
      setIsAuthenticated(false);
      console.log(
        "[AuthContext] Logout bem-sucedido. Redirecionando para /login..."
      );
      router.push("/login");
    } catch (error) {
      console.error("[AuthContext] Erro inesperado no logout:", error);
      throw error;
    }
  };

  if (!isMounted) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
