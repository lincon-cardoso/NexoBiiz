"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "@/style/login/login.module.scss";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const resetStates = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await login(email, password);
      setSuccess("Entrando...");
      setTimeout(() => router.push("/dashboard"), 1000); // Redireciona após 1 segundo
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao fazer login";
      setError(message);
    }
  };

  const handleLogout = () => {
    resetStates();
    router.push("/"); // Redireciona para a página inicial
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
      setSuccess(""); // Limpa a mensagem de sucesso ao digitar
      setError(""); // Limpa a mensagem de erro ao digitar
    };

  return (
    <div className={styles.loginPage}>
      <main className={styles.mainContent}>
        <section className={styles.loginSection}>
          <h1 className={styles.title}>Login</h1>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={handleInputChange(setEmail)}
              required
              aria-label="Digite seu email"
            />
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={handleInputChange(setPassword)}
              required
              aria-label="Digite sua senha"
            />
            {success && <p className={styles.successMessage}>{success}</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitButton}>
                Entrar
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Sair
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
