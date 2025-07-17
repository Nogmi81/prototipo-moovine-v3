"use client";

import styles from "./Register.module.css";
import { useState, useEffect } from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "../components/Modal/Modal";
import { TiEyeOutline, TiEye } from "react-icons/ti";

// Função para sanitizar e detectar caracteres perigosos
const containsInvalidChars = (value) => /[&<>"']/.test(value);

const sanitizeInput = (value) => value.replace(/[&<>"']/g, '').replace(/\s+/g, ' ').trim();

const PasswordField = ({ label, value, onChange, onFocus, show, toggle }) => (
  <label className={styles.passwordField}>
    <span>{label}</span>
    <div className={styles.passwordInputWrapper}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={label}
        required
      />
      <button
        type="button"
        className={styles.togglePassword}
        onClick={toggle}
      >
        {show ? (
          <TiEye style={{ color: "red" }} />
        ) : (
          <TiEyeOutline style={{ color: "green" }} />
        )}
      </button>
    </div>
  </label>
);

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [invalidCharError, setInvalidCharError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    loginWithGoogle,
    error: authError,
    loading,
    clearAuthError,
  } = useAuthentication();

  const router = useRouter();

  useEffect(() => {
    let timer;
    if (isModalOpen) {
      timer = setTimeout(closeModal, 8000);
    }
    return () => clearTimeout(timer);
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    router.push("/Login");
  };

  const clearAllErrorsOnFocus = () => {
    setError("");
    clearAuthError();
    setInvalidCharError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    clearAuthError();
    setInvalidCharError(false);

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);
    const sanitizedConfirmPassword = sanitizeInput(confirmPassword);
    const sanitizedName = sanitizeInput(displayName);

    const allFields = [sanitizedEmail, sanitizedPassword, sanitizedConfirmPassword, sanitizedName];
    if (allFields.some(containsInvalidChars)) {
      return setInvalidCharError(true);
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      return setError("As senhas precisam ser iguais.");
    }
    if (sanitizedPassword.length < 6) {
      return setError("A senha precisa ter no mínimo 6 caracteres.");
    }

    const user = await register({
      email: sanitizedEmail,
      password: sanitizedPassword,
      displayName: sanitizedName,
    });
    if (user) openModal();
  };

  const handleGoogleLogin = async () => {
    clearAuthError();
    setInvalidCharError(false);
    const user = await loginWithGoogle();
    if (user) router.push("/Dashboard");
  };

  return (
    <div className={styles.container}>
      <h1>Cadastre-se para utilizar os recursos do moovine:</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome: </span>
          <input
            type="text"
            placeholder="Nome"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={(e) => setDisplayName(sanitizeInput(e.target.value))}
            onFocus={clearAllErrorsOnFocus}
            required
          />
        </label>

        <label>
          <span>E-mail: </span>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => setEmail(sanitizeInput(e.target.value))}
            onFocus={clearAllErrorsOnFocus}
            required
          />
        </label>

        <PasswordField
          label="Senha"
          value={password}
          onChange={setPassword}
          onFocus={clearAllErrorsOnFocus}
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
        />

        <PasswordField
          label="Confirme a senha"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onFocus={clearAllErrorsOnFocus}
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
        />

        {(error || authError || invalidCharError) && (
          <p
            style={{
              color: "white",
              border: "1px dotted #FF7F26",
              backgroundColor: "red",
              padding: "8px",
            }}
          >
            {invalidCharError
              ? "Caracteres especiais como <, >, &, \" e ' não são permitidos."
              : error || authError}
          </p>
        )}

        <button
          className={`${styles.btn} ${loading ? styles.loading : ""}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <button
          type="button"
          className={`${styles.btn} ${styles.googleBtn}`}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? "Aguarde..." : "Entrar com Google"}
        </button>
      </form>

      <p>
        Já tem uma conta? <Link href="/Login">Faça login aqui</Link>{" "}
        <span className={styles.linkSeparator}>|</span>{" "}
        <Link href="/Forgot">Esqueceu a senha?</Link>
      </p>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Verificação de E-mail"
      >
        <p>Seu cadastro foi realizado com sucesso!</p>
        <p>
          Enviamos um e-mail de verificação para <span className={styles.negritoLaranja}>{email}</span>. <br />
          Por favor, verifique sua caixa de entrada <span className={styles.negritoLaranja}>(e spam)</span> para confirmar sua conta.
        </p>
      </Modal>
    </div>
  );
};

export default RegisterPage;
