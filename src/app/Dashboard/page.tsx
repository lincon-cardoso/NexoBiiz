"use client";
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/apiClient";

interface DashboardData {
  user: Record<string, unknown>;
}

interface UserData {
  user: Record<string, unknown>;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://nexobiiz.devlincon.com.br/api/dashboard"
      );
      const data: DashboardData = await response.json();
      setDashboardData(data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function loadUser() {
      const res = await fetchWithAuth("/api/me");
      if (res.ok) {
        const data: UserData = await res.json();
        setUserData(data);
      }
    }
    loadUser();
  }, []);

  if (!dashboardData || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(userData.user, null, 2)}</pre>
      {/* Renderizar os dados do dashboard */}
    </div>
  );
}
