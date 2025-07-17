"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import styles from "./Forgot.module.css";

const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (!email) {
      setError("Por favor, digite seu e-mail.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        "Um e-mail de redefinição de senha foi enviado para seu endereço. Por favor, verifique sua caixa de entrada (e a pasta de spam)."
      );
      setEmail(""); // Clear the email input after successful request
    } catch (err) {
      let errorMessage =
        "Ocorreu um erro ao enviar o e-mail de redefinição de senha.";
      if (err.code === "auth/user-not-found") {
        errorMessage = "Não há nenhum usuário com este e-mail.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "O formato do e-mail é inválido.";
      } else {
        errorMessage = `Erro: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerForm}>
        <h2>Redefinir Senha</h2>
        <p>Digite seu e-mail para receber um link de redefinição de senha.</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>E-mail:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              aria-label="Email for password reset"
            />
          </label>
          <button
            type="submit"
            className={`${styles.btn} ${loading ? styles.loading : ""}`}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Redefinir Senha"}
          </button>
        </form>
        {error && <p className={styles.error}>❌ {error}</p>}
        {successMessage && (
          <>
            {" "}
            <p className={styles.success}>✅ {successMessage}</p>
            <p className={styles.linkLogin}>
              <Link href="/Login">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordResetForm;
