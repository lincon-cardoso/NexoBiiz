'use client';
import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao painel de controle Bem vindo !</p>
      <button onClick={logout} style={{ marginTop: 16 }}>
        Sair
      </button>
    </div>
  );
};

export default DashboardPage;
