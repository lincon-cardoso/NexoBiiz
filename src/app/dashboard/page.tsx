"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdicionarTransacao from "./AdicionarTransacao";

type Transacao = {
    tipo: "ganho" | "custo";
    descricao: string;
    valor: number;
};

type Cadastro = {
    nome: string;
    email: string;
    senha: string;
    nomeEmpresa: string;
    cnpj: string;
    telefone: string;
};

export default function DashboardPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("custos");
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [usuario, setUsuario] = useState<Cadastro | null>(null);

    const ganhos = transacoes.filter((t) => t.tipo === "ganho");
    const custos = transacoes.filter((t) => t.tipo === "custo");
    const saldo = ganhos.reduce((s, g) => s + g.valor, 0) - custos.reduce((s, c) => s + c.valor, 0);

    useEffect(() => {
        // Recupera os dados do usuário do localStorage
        const cadastros = JSON.parse(localStorage.getItem("cadastros") || "[]");
        if (cadastros.length > 0) {
            setUsuario(cadastros[0]); // Assume que o primeiro cadastro é o usuário atual
        }

        // Carrega as transações do localStorage ao montar o componente
        const transacoesSalvas = JSON.parse(localStorage.getItem("transacoes") || "[]");
        setTransacoes(transacoesSalvas);
    }, []);

    function handleAdicionar(transacao: Transacao) {
        const novasTransacoes = [...transacoes, transacao];
        setTransacoes(novasTransacoes);

        // Salva as transações no localStorage
        localStorage.setItem("transacoes", JSON.stringify(novasTransacoes));
    }

    function handleLogout() {
        router.push("/login"); // Redireciona para a página inicial
    }

    return (
        <div className="dashboard-page">
            <h1>Dashboard Financeiro</h1>
            <p>Controle simples de ganhos e custos.</p>

            {usuario && (
                <div className="usuario-info">
                    <p><strong>Nome:</strong> {usuario.nome}</p>
                    <p><strong>Empresa:</strong> {usuario.nomeEmpresa}</p>
                    <p><strong>CNPJ:</strong> {usuario.cnpj}</p>
                </div>
            )}

            <nav className="menu">
                <button onClick={() => setActiveSection("custos")}>Custos</button>
                <button onClick={() => setActiveSection("ganhos")}>Ganhos</button>
                <button onClick={() => setActiveSection("resultado")}>Resultado</button>
            </nav>

            <div className="resumo">
                <div className="card saldo">Saldo: R$ {saldo.toFixed(2)}</div>
                <div className="card ganhos">Ganhos: R$ {ganhos.reduce((s, g) => s + g.valor, 0).toFixed(2)}</div>
                <div className="card custos">Custos: R$ {custos.reduce((s, c) => s + c.valor, 0).toFixed(2)}</div>
            </div>

            <AdicionarTransacao onAdicionar={handleAdicionar} />
            <button className="logout-button" onClick={handleLogout}>
                Sair
            </button>

            <div className="secao-dados">
                {activeSection === "custos" && (
                    <>
                        <h3>Lista de Custos</h3>
                        <ul>
                            {custos.map((item, index) => (
                                <li key={index}>
                                    {item.descricao} - R$ {item.valor.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {activeSection === "ganhos" && (
                    <>
                        <h3>Lista de Ganhos</h3>
                        <ul>
                            {ganhos.map((item, index) => (
                                <li key={index}>
                                    {item.descricao} - R$ {item.valor.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {activeSection === "resultado" && (
                    <>
                        <h3>Resumo Final</h3>
                        <p>O saldo atual é de <strong>R$ {saldo.toFixed(2)}</strong>.</p>
                    </>
                )}
            </div>
        </div>
    );
}