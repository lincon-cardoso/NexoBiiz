"use client";
import { useState } from "react";
import styles from "@/style/register/register.module.scss";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    company: "",
    cnpj: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    company: "",
    cnpj: "",
    phone: "",
  });

  const validateInput = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "O nome é obrigatório.";
        break;
      case "username":
        if (!value.trim()) error = "O username é obrigatório.";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Insira um email válido.";
        break;
      case "password":
        if (value.length < 6)
          error = "A senha deve ter pelo menos 6 caracteres.";
        break;
      case "cnpj":
        if (!/^\d{14}$/.test(value)) error = "O CNPJ deve conter 14 números.";
        break;
      case "phone":
        if (!/^\d{10,11}$/.test(value))
          error = "O telefone deve conter 10 ou 11 números.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateInput(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verificar se há erros antes de enviar
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      alert("Corrija os erros antes de enviar.");
      return;
    }
    console.log("Dados enviados:", formData);
  };

  return (
    <main className={styles.registerPage}>
      <div className={styles.registerPage}>
        <div className={styles.registerContainer}>
          <h1 className={`${styles.registerTitle} fade-in-out`}>Register</h1>
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Digite seu nome"
              />
              {errors.name && (
                <span className={styles.error}>{errors.name}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Digite seu username"
              />
              {errors.username && (
                <span className={styles.error}>{errors.username}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Digite seu email"
              />
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Digite sua senha"
              />
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="company" className={styles.formLabel}>
                Nome da Empresa
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Digite o nome da empresa"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cnpj" className={styles.formLabel}>
                CNPJ
              </label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Digite o CNPJ"
              />
              {errors.cnpj && (
                <span className={styles.error}>{errors.cnpj}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Digite seu telefone"
              />
              {errors.phone && (
                <span className={styles.error}>{errors.phone}</span>
              )}
            </div>
            <button type="submit" className={styles.formButton}>
              Register
            </button>
            <button type="button" className={styles.formButton}>
              <Link href="/">Voltar</Link>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
