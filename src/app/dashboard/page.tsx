"use client";
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { errorMessages } from "@/constants/errorMessages";

interface DashboardData {
  user: Record<string, unknown>;
  userName?: string;
}

interface UserData {
  user: {
    name?: string; // Define explicitamente que 'name' é uma string opcional.
  };
}

export default function UserDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        console.time("fetchData");
        const response = await fetch("/api/dashboard");
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) {
          const text = await response.text();
          setError(
            `Erro no dashboard: ${response.status} ${response.statusText} - ${text}`
          );
          setDashboardData(null);
          return;
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        console.timeEnd("fetchData");
      } catch (error) {
        setError(`Erro ao buscar dados do dashboard: ${error}`);
        setDashboardData(null);
      }
    }

    async function loadUser() {
      try {
        console.time("loadUser");
        const res = await fetchWithAuth("/api/me");
        const text = await res.clone().text();
        if (!res.ok) {
          console.error("Erro no usuário:", res.status, res.statusText, text);
          setError(
            `Erro no usuário: ${res.status} ${res.statusText} - ${text}`
          );
          setUserData(null);
          return;
        }
        const data: UserData = await res.json();
        setUserData(data);
        console.timeEnd("loadUser");
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setError(`Erro ao carregar usuário: ${error}`);
        setUserData(null);
      }
    }

    fetchData();
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Chama API para limpar cookies/tokens no backend
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      // Limpa tokens do localStorage
      localStorage.removeItem("accessToken");
      // Limpa estados locais
      setDashboardData(null);
      setUserData(null);
      setError(null);
      // Força navegação e recarrega para garantir limpeza total
      router.replace("/login");
      if (typeof window !== "undefined") {
        setTimeout(() => window.location.reload(), 100);
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setError("Erro ao fazer logout. Tente novamente.");
    }
  };

  if (error === errorMessages.AUTHENTICATION_ERROR) {
    return (
      <div className="errorMessage">
        <p>{errorMessages.LOGIN_FAILED}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="errorMessage">
        <p>{error}</p>
      </div>
    );
  }

  if (!dashboardData || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <h2>
        Welcome, {dashboardData.userName || userData.user.name || "Usuário"}!
        Bem vindo ao seu painel de controle.
      </h2>
      <button onClick={handleLogout} style={{ marginTop: 16 }}>
        Logout
      </button>
    </div>
  );
}
