"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "@/style/dashboard/dashboard.module.scss";
import { formatCNPJ } from "@/lib/cnpjUtils";
import { fetchWithAuth, encryptData, decryptData } from "@/lib/apiClient";

type TransactionType = "ganho" | "custo";

interface Transaction {
  id: number;
  tipo: TransactionType;
  descricao: string;
  valor: number;
}

interface EncryptedTransaction {
  id: string;
  tipo: TransactionType;
  descricao: string;
  valor: string;
}

const DashboardPage = () => {
  const { user, logout } = useAuth();

  // Estado para transações
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tipo, setTipo] = useState<TransactionType>("ganho");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [show, setShow] = useState<"ganho" | "custo" | "resultado">(
    "resultado"
  );

  // Carrega transações do banco de dados
  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetchWithAuth("/api/transactions");
        if (res.ok) {
          const data = await res.json();
          const decryptedTransactions = data.transactions
            .map((t: EncryptedTransaction) => {
              try {
                const decryptedValue = decryptData(t.valor);
                return {
                  id: Number(t.id),
                  tipo: t.tipo,
                  descricao: t.descricao,
                  valor: Number(decryptedValue),
                };
              } catch (error) {
                console.error(
                  "Erro ao descriptografar valor da transação:",
                  error
                );
                return null;
              }
            })
            .filter(Boolean);
          setTransactions(decryptedTransactions);
        } else {
          console.error(
            "Erro na resposta do servidor:",
            res.status,
            res.statusText
          );
        }
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      }
    }
    loadTransactions();
  }, []);

  // Cálculos
  const ganhos = transactions
    .filter((t) => t.tipo === "ganho")
    .reduce((acc, t) => acc + t.valor, 0);
  const custos = transactions
    .filter((t) => t.tipo === "custo")
    .reduce((acc, t) => acc + t.valor, 0);
  const saldo = ganhos - custos;

  // Adicionar transação
  const handleAdd = async () => {
    if (!descricao || valor === "" || isNaN(Number(valor))) {
      alert("Por favor, preencha a descrição e um valor válido.");
      return;
    }
    try {
      const encryptedBody = encryptData({
        tipo,
        descricao,
        valor: Number(valor),
      });
      const res = await fetchWithAuth("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: encryptedBody }),
      });

      if (res.status === 401 || res.redirected) {
        window.location.href = "/login"; // Redireciona para login se o token for inválido ou ausente
        return;
      }

      if (res.ok) {
        const responseData = await res.json();
        const { transaction } = responseData;
        const newTransaction = {
          id: Number(transaction.id),
          tipo: transaction.tipo,
          descricao: transaction.descricao,
          valor: Number(transaction.valor),
        };
        setTransactions((prevTransactions) => [
          newTransaction,
          ...prevTransactions,
        ]);
        setDescricao("");
        setValor("");
      } else {
        window.location.href = "/login"; // Redireciona para login em caso de problema
      }
    } catch {
      window.location.href = "/login"; // Redireciona para login em caso de falha
    }
  };

  // Filtragem para exibição
  const filtered =
    show === "resultado"
      ? transactions
      : transactions.filter((t) => t.tipo === show);

  return (
    <div className={styles.dashboardFinanceiro}>
      <div className={styles.header}>
        <h1>Dashboard Financeiro</h1>
        {user && (
          <div className={styles.empresaInfo}>
            <div>
              <strong>Empresa:</strong> {user.company}
            </div>
            <div>
              <strong>CNPJ:</strong> {formatCNPJ(user.cnpj)}
            </div>
          </div>
        )}
      </div>

      <h2>Controle simples de ganhos e custos</h2>

      <div className={styles.botoesFiltro}>
        <button onClick={() => setShow("custo")}>Custos</button>
        <button onClick={() => setShow("ganho")}>Ganhos</button>
        <button onClick={() => setShow("resultado")}>Resultados</button>
      </div>

      <div className={styles.resumos}>
        <div className={`${styles.caixa} ${styles.saldo}`}>
          <span>Saldo</span>
          <strong>R$ {saldo.toFixed(2)}</strong>
        </div>
        <div className={`${styles.caixa} ${styles.ganhos}`}>
          <span>Ganhos</span>
          <strong>R$ {ganhos.toFixed(2)}</strong>
        </div>
        <div className={`${styles.caixa} ${styles.custos}`}>
          <span>Custos</span>
          <strong>R$ {custos.toFixed(2)}</strong>
        </div>
      </div>

      <div className={styles.adicionarTransacao}>
        <h3>Adicionar transação</h3>
        <div className={styles.form}>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TransactionType)}
          >
            <option value="ganho">Ganho</option>
            <option value="custo">Custo</option>
          </select>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) =>
              setValor(e.target.value === "" ? "" : Number(e.target.value))
            }
            min={0}
            step="0.01"
          />
          <button onClick={handleAdd}>Adicionar</button>
        </div>
      </div>

      <div className={styles.listaTransacoes}>
        <h3>Transações</h3>
        {filtered.length === 0 ? (
          <p>Nenhuma transação registrada.</p>
        ) : (
          <ul>
            {filtered.map((t) => (
              <li key={t.id} className={styles[t.tipo]}>
                <span>{t.tipo === "ganho" ? "Ganho" : "Custo"}:</span>
                <span>{t.descricao}</span>
                <span>R$ {t.valor.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={logout} className={styles.logoutBtn}>
        Sair
      </button>
    </div>
  );
};

export default DashboardPage;
