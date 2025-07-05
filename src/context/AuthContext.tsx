"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

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
  const [accessToken, setAccessToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  );
  const router = useRouter();

  const login = async (email: string, password: string) => {
    // 1. GET para obter o CSRF token atualizado
    await fetch("/api/login", { method: "GET", credentials: "include" });

    // 2. Ler o cookie csrf-token
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };
    const csrfToken = getCookie("csrf-token");

    // 3. POST com o header x-csrf-token e envio de cookies
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken || "",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      router.push("/dashboard");
    } else {
      throw new Error("Login falhou");
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
