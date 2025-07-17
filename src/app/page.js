"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles/Home.module.css";
import { useAuth } from "./contexts/AuthContext";
import loading from "../../public/loading.gif";

export default function HomePage() {
  const { user, authLoading } = useAuth(); 
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (authLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, 2000); // só mostra o loading após 2000ms (2segundos)
    } else {
      setShowLoading(false);
    }

    return () => clearTimeout(timeoutId);
  }, [authLoading]);

  if (authLoading && showLoading)
    return (
      <p className={styles.loading}>
        <Image src={loading} alt="Carregando autenticação..." />
      </p>
    );

  return (
    <main className={styles.main}>
      {!user ? (
        <p className={styles.msgDeslogado}>Você não está autenticado.</p>
      ) : (
        <h1>Bem-vindo, {user.displayName || user.email || "usuário"}!</h1>
      )}
    </main>
  );
}
