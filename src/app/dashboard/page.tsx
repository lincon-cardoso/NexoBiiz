"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "@/style/dashboard/dashboard.module.scss";

type TransactionType = "ganho" | "custo";

interface Transaction {
  id: number;
  tipo: TransactionType;
  descricao: string;
  valor: number;
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

  // Cálculos
  const ganhos = transactions
    .filter((t) => t.tipo === "ganho")
    .reduce((acc, t) => acc + t.valor, 0);
  const custos = transactions
    .filter((t) => t.tipo === "custo")
    .reduce((acc, t) => acc + t.valor, 0);
  const saldo = ganhos - custos;

  // Adicionar transação
  const handleAdd = () => {
    if (!descricao || valor === "" || isNaN(Number(valor))) return;
    setTransactions([
      ...transactions,
      {
        id: Date.now(),
        tipo,
        descricao,
        valor: Number(valor),
      },
    ]);
    setDescricao("");
    setValor("");
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
              <strong>CNPJ:</strong> {user.cnpj}
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
