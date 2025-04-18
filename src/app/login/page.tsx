'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault(); // Evita o comportamento padrão do formulário

        // Recupera os cadastros do localStorage
        const cadastros = JSON.parse(localStorage.getItem("cadastros") || "[]");

        // Verifica se o usuário e a senha correspondem a algum cadastro
        const usuarioValido = cadastros.find(
            (cadastro: { email: string; senha: string }) =>
                cadastro.email === usuario && cadastro.senha === senha
        );

        if (usuarioValido) {
            router.push("/dashboard"); // Redireciona para a página do dashboard
        } else {
            setErro("Usuário ou senha inválidos."); // Exibe mensagem de erro
        }
    };

    const handleLogout = () => {
        window.location.href = "/"; // Redireciona para o início da página
    };

    const alertRecuperarSenha = () => { 
        alert("Recuperar senha não implementado"); // Exibe alerta de que a funcionalidade não está implementada
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Usuário (Email)"
                    className="login-input"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    className="login-input"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button type="submit" className="login-button">
                    Entrar
                </button>
                <button type="button" className="login-button" onClick={handleLogout}>
                    Sair
                </button>
                {erro && <p className="login-error">{erro}</p>}
                <div className="login-footer">
                    <a href="#" className="login-link" onClick={alertRecuperarSenha}>
                        Esqueci minha senha (não implementado)
                    </a>
                    <a href="/cadastro" className="login-link">
                        Criar conta
                    </a>
                </div>
            </form>
        </div>
    );
}