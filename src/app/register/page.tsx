"use client";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import styles from "@/style/register/register.module.scss";
import Link from "next/link";
import { validateCNPJ, formatCNPJ } from "@/lib/cnpjUtils";

const userSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  company: z.string().optional(),
  cnpj: z
    .string()
    .refine(
      validateCNPJ,
      "CNPJ inválido. Certifique-se de que está no formato correto."
    ),
  phone: z.string().min(10, "O telefone deve ter pelo menos 10 caracteres."),
});

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    cnpj: "",
    phone: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    cnpj: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === "cnpj" ? formatCNPJ(value) : value;
    setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      company: "",
      cnpj: "",
      phone: "",
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const parsedData = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ""),
      };
      userSchema.parse(parsedData);
      console.log("Dados validados no frontend:", parsedData);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify(parsedData),
      });

      if (response.ok) {
        console.log("Resposta do backend:", response);
        const responseData = await response.json();
        console.log("Dados retornados pela API:", responseData);
        clearForm();
        router.push("/login");
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Erro ao registrar usuário.");
        console.error("Erro da API:", error.errors || error.message);

        if (response.status === 500) {
          setErrorMessage(
            "Erro interno no servidor. Por favor, tente novamente mais tarde."
          );
        } else if (response.status === 400) {
          setErrorMessage("Erro de validação: Verifique os dados enviados.");
        } else if (response.status === 0) {
          setErrorMessage(
            "Erro de CORS: Verifique as configurações do servidor."
          );
        } else {
          setErrorMessage(
            "Erro desconhecido: Por favor, entre em contato com o suporte."
          );
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce(
          (acc, err) => {
            const key = err.path[0] as keyof typeof errors;
            acc[key] = err.message;
            return acc;
          },
          { ...errors }
        );
        setErrors(fieldErrors);
        setErrorMessage(
          "Erro de validação: " +
            error.errors.map((err) => err.message).join(", ")
        );
      } else if (error instanceof TypeError) {
        setErrorMessage("Erro de conexão com o servidor.");
      } else {
        console.error("Erro inesperado:", error);
        setErrorMessage("Erro ao registrar usuário.");
      }
    }
  };

  return (
    <main className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <h1 className={`${styles.registerTitle} fade-in-out`}>Register</h1>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label
              htmlFor="name"
              className={`${styles.formLabel} ${
                errors.name ? styles.error : ""
              }`}
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.formInput} ${
                errors.name ? styles.error : ""
              }`}
              placeholder="Digite seu nome"
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="email"
              className={`${styles.formLabel} ${
                errors.email ? styles.error : ""
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.formInput} ${
                errors.email ? styles.error : ""
              }`}
              placeholder="Digite seu email"
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="password"
              className={`${styles.formLabel} ${
                errors.password ? styles.error : ""
              }`}
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.formInput} ${
                errors.password ? styles.error : ""
              }`}
              placeholder="Digite sua senha"
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password}</p>
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
            <label
              htmlFor="cnpj"
              className={`${styles.formLabel} ${
                errors.cnpj ? styles.error : ""
              }`}
            >
              CNPJ
            </label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              className={`${styles.formInput} ${
                errors.cnpj ? styles.error : ""
              }`}
              placeholder="Digite o CNPJ"
              maxLength={18}
            />
            {errors.cnpj && (
              <p className={styles.errorMessage}>{errors.cnpj}</p>
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
          </div>
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
          <button type="submit" className={styles.formButton}>
            Register
          </button>
          <Link href="/" className={styles.formButton}>
            Voltar
          </Link>
        </form>
      </div>
    </main>
  );
}
