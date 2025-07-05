"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/apiClient";

interface UserPayload {
  user: Record<string, unknown>;
}

export default function DashboardPage() {
  const [data, setData] = useState<UserPayload | null>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetchWithAuth("/api/me");
      if (res.ok) {
        setData(await res.json());
      }
    }
    loadUser();
  }, []);

  if (!data) {
    return <p>Carregando...</p>;
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data.user, null, 2)}</pre>
    </div>
  );
}
