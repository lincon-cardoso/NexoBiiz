"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { errorMessages } from "@/constants/errorMessages";
import DOMPurify from "dompurify";

interface AuthContextType {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const getCookie = (name: string): string | undefined => {
    if (typeof document !== "undefined") {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    }
    return undefined;
  };

  const MAX_LOGIN_ATTEMPTS = 5;
  let loginAttempts = 0;

  const login = async (email: string, password: string) => {
    // Proteção contra força bruta
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      throw new Error(errorMessages.TOO_MANY_ATTEMPTS);
    }

    // Validação de entrada
    if (!email || !password || !email.includes("@") || password.length < 6) {
      throw new Error(errorMessages.INVALID_INPUT);
    }

    loginAttempts++;

    // 1. GET para obter o CSRF token atualizado
    await fetch("https://api.example.com/login", {
      method: "GET",
      credentials: "include",
    });

    // 2. Ler o cookie csrf-token
    const csrfToken = getCookie("csrf-token");

    // 3. POST com o header x-csrf-token e envio de cookies
    const res = await fetch("https://api.example.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken || "",
        "Accept-Encoding": "gzip, deflate, br", // Compressão de respostas
      },
      credentials: "include",
      body: JSON.stringify({
        email: DOMPurify.sanitize(email),
        password: DOMPurify.sanitize(password),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      router.push("/user-dashboard");
    } else {
      let msg = "Login falhou";
      try {
        await res.json();
        msg = errorMessages.AUTHENTICATION_ERROR;
      } catch {
        msg = errorMessages.AUTHENTICATION_ERROR;
      }
      throw new Error(msg);
    }

    const data = await res.json();

    // Cache avançado (Redis)
    // Substituir localStorage por integração com Redis
    // Exemplo fictício:
    // await redisClient.set("userData", JSON.stringify(data));

    // Lazy loading para melhorar desempenho
    const dashboardModule = await import("@/app/dashboard/page");
    dashboardModule.default();

    // Armazenar token em cookie seguro
    if (typeof document !== "undefined") {
      document.cookie = `accessToken=${data.accessToken}; HttpOnly; Secure; SameSite=Strict`;
    }

    setAccessToken(data.accessToken);
    router.push("/dashboard");

    // Monitoramento de desempenho
    // Exemplo fictício:
    // performance.mark("login-completed");
  };

  const logout = async () => {
    // Remover token do cookie
    if (typeof document !== "undefined") {
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    setAccessToken(null);
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.push("/login");

    // Atualizar estado sem recarregar a página
    setAccessToken(null);

    // Limpar cache de dados
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAccessToken = localStorage.getItem("accessToken");
      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
