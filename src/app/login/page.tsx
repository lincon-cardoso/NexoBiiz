"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/style/login/login.module.scss";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Adicione lógica de autenticação aqui
    console.log({ email, password });
  };

  const handleLogout = () => {
    router.push("/");
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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitButton}>
                Entrar
              </button>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Sair
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
