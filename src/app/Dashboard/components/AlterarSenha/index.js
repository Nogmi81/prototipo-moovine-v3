// index.js (Componente PasswordChange.jsx)
import React, { useState, useEffect } from "react";
import { useAuthentication } from "../../../hooks/useAuthentication";
import styles from "../styles/EstiloFormDashboard.module.css"; 
import { TiEyeOutline, TiEye } from "react-icons/ti";

function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  // Estados independentes para a visibilidade de cada campo de senha
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const {
    reauthenticateAndChangePassword,
    error: authErrorRaw,
    loading,
    clearAuthError,
  } = useAuthentication();

  useEffect(() => {
    if (authErrorRaw) {
      setMessage(authErrorRaw);
    }
  }, [authErrorRaw]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    clearAuthError();

    if (newPassword !== confirmNewPassword) {
      setMessage("As novas senhas não coincidem!");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const success = await reauthenticateAndChangePassword(
      currentPassword,
      newPassword
    );

    if (success) {
      setMessage("Senha alterada com sucesso! ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } else {
      if (!authErrorRaw) {
        setMessage("Ocorreu um erro inesperado ao alterar a senha.");
      }
    }
  };

  const displayMessage = () => {
    if (message) {
      if (message.includes("✅")) {
        // Para mensagens de sucesso, talvez uma classe diferente seja melhor.
        // Por enquanto, vou manter o styles.container, mas idealmente seria styles.successMessage
        return <p className={styles.success}>{message}</p>;
      } else {
        return <p className={styles.erro}>{message}</p>;
      }
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <h1>Alterar Senha</h1>
      <form onSubmit={handleSubmit}>
        {/* INPUT: Senha Atual */}
        <label className={styles.label}>
          <span>Senha Atual:</span>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
              onFocus={() => setMessage("")}
              // Adicionando um ref para foco programático se necessário,
              // mas a ordem de tabulação deve ser natural se o CSS estiver certo.
            />
            <button // <-- Certifique-se que é um <button>
              type="button" // <-- ESSENCIAL para evitar submeter formulário e permitir foco
              className={styles.togglePassword}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{
                color: showCurrentPassword ? "red" : "green",
              }}
            >
              {showCurrentPassword ? (
                <TiEye size={20} />
              ) : (
                <TiEyeOutline size={20} />
              )}
            </button>
          </div>
        </label>

        {/* INPUT: Nova Senha */}
        <label className={styles.label}>
          <span>Nova Senha:</span>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              onFocus={() => setMessage("")}
            />
            <button // <-- Certifique-se que é um <button>
              type="button" // <-- ESSENCIAL
              className={styles.togglePassword}
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{ color: showNewPassword ? "red" : "green"}}
            >
              {showNewPassword ? (
                <TiEye size={20} />
              ) : (
                <TiEyeOutline size={20} />
              )}
            </button>
          </div>
        </label>

        {/* INPUT: Confirmar Nova Senha */}
        <label className={styles.label}>
          <span>Confirmar Nova Senha:</span>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              disabled={loading}
              onFocus={() => setMessage("")}
            />
            <button // <-- Certifique-se que é um <button>
              type="button" // <-- ESSENCIAL
              className={styles.togglePassword}
              onClick={() =>
                setShowConfirmNewPassword(!showConfirmNewPassword)
              }
              style={{
                color: showConfirmNewPassword ? "red" : "green",
              }}
            >
              {showConfirmNewPassword ? (
                <TiEye size={20} />
              ) : (
                <TiEyeOutline size={20} />
              )}
            </button>
          </div>
        </label>

        <button
          type="submit"
          className={`${styles.btn} ${loading ? styles.loading : ""}`}
          disabled={loading}
        >
          {loading ? "Alterando..." : "Alterar Senha"}
        </button>
      </form>
      <div>{displayMessage()}</div>
    </div>
  );
}

export default PasswordChange;