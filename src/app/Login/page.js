"use client";

import styles from "./Login.module.css";
import { useState, useEffect, useRef } from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../firebase/config";
import { onAuthStateChanged, reload } from "firebase/auth";
import { TiEyeOutline, TiEye } from "react-icons/ti";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    loginWithEmail,
    loginWithGoogle,
    error: authError,
    loading,
    clearAuthError,
  } = useAuthentication();

  const router = useRouter();

  const passwordRef = useRef(null); // ref para input de senha
  const googleBtnRef = useRef(null); // ref para botão Google

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await reload(user);
        if (!user.emailVerified) {
          setError(
            "Seu e-mail ainda não foi verificado. Verifique sua caixa de entrada e clique no link de verificação."
          );
        } else {
          router.push("/Dashboard");
        }
      } else {
        setError("");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    clearAuthError();

    const user = await loginWithEmail({ email, password });

    if (user) {
      await reload(user);
      if (!user.emailVerified) {
        setError(
          "Seu e-mail ainda não foi verificado. Verifique sua caixa de entrada e clique no link de verificação."
        );
      } else {
        router.push("/Dashboard");
      }
    }
  };

  const handleGoogleLogin = async () => {
    clearAuthError();
    const user = await loginWithGoogle();
    if (user) {
      await reload(user);
      if (!user.emailVerified) {
        setError(
          "Seu e-mail ainda não foi verificado. Verifique sua caixa de entrada e clique no link de verificação."
        );
      } else {
        router.push("/Dashboard");
      }
    }
  };

  const clearAllErrorsOnFocus = () => {
    setError("");
    clearAuthError();
  };

  const checkEmailProvider = async () => {
    clearAllErrorsOnFocus();
    if (!email) return;
  };

  return (
    <div className={styles.container}>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>E-mail: </span>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={clearAllErrorsOnFocus}
            onBlur={checkEmailProvider} // <-- Checa quando sair do campo de e-mail
            required
          />
        </label>

        <label className={styles.passwordField}>
          <span>Senha: </span>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={clearAllErrorsOnFocus}
              ref={passwordRef}
              required
            />

            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <TiEye style={{ color: "red" }} />
              ) : (
                <TiEyeOutline style={{ color: "green" }} />
              )}
            </button>
          </div>
        </label>

        {(error || authError) && (
          <p
            style={{
              color: "white",
              border: "1px dotted #FF7F26",
              backgroundColor: "red",
              padding: "8px",
            }}
          >
            {error || authError}
          </p>
        )}

        <button
          className={`${styles.btn} ${loading ? styles.loading : ""}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          type="button"
          className={`${styles.btn} ${styles.googleBtn}`}
          onClick={handleGoogleLogin}
          disabled={loading}
          ref={googleBtnRef} // <-- Ref do botão Google
        >
          Entrar com Google
        </button>
      </form>

      <p>
        Não tem uma conta?{" "}
        <Link href="/Cadastro" className={styles.linkRegister}>
          Cadastre-se aqui
        </Link>{" "}
        <span className={styles.linkSeparator}>|</span>{" "}
        <Link href="/Forgot" className={styles.forgotLink}>
          Esqueceu a senha?
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
