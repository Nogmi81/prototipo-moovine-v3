"use client";

import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import PerfilUsuario from "./components/PerfilUsuario";
import Configuracoes from "./components/Configuracoes";

export default function Dashboard() {
  const { user, authLoading } = useAuth();
  const [activeComponent, setActiveComponent] = useState("profile");

  if (!user && !authLoading) {
    return (
      <div className={styles.containerDeslogado}>
        <div className={styles.msgDeslogado}>
          <span className={styles.linkHome}>
            <Link href="/">Ir para Home</Link>
          </span>
          <p>Você não está logado.</p>
          <p>Para acessar o Dashboard faça login novamente: </p>
          <p className={styles.linkLogin}>
            <Link href="/Login">Login</Link>
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles.mainDashboard}>
        
        <div className={styles.containerBtn}>
          <button
            onClick={() => setActiveComponent("profile")}
            className={styles.btn}
          >
            Alterar Cadastro
          </button>

          <button
            onClick={() => setActiveComponent("screens")}
            className={styles.btn}
          >
            Configurar Telas
          </button>
        </div>

        <div className={styles.container}>          
          {activeComponent === "profile" && <PerfilUsuario user={user} />}
          {activeComponent === "screens" && <Configuracoes user={user} />}
        </div>
      </div>
    );
  }

  return null;
}
