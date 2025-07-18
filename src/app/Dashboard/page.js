// page.js
"use client";

import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import PerfilUsuario from "./components/PerfilUsuario";
import Configuracoes from "./components/Configuracoes";
import MobileMenu from "./components/MobileMenu"; // <-- IMPORTANTE: Importar o MobileMenu

export default function Dashboard() {
  const { user, authLoading } = useAuth();
  // Estado que controla qual "seção" principal está ativa no Dashboard
  // 'profile' para a seção de perfil (que inclui Initial, AlterarNome, etc.)
  // 'screens' para configurações
  // 'alterarNome', 'alterarEmail', 'alterarSenha' são estados internos da seção 'profile'
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
        
        {/* Botões do menu principal para desktop/tablet - ocultos em mobile via CSS */}
        <div className={styles.containerBtn}>
          <button
            onClick={() => setActiveComponent("profile")} // Define a seção de perfil como ativa (mostrando Initial)
            className={styles.btn}
          >
            Alterar Cadastro
          </button>

          <button
            onClick={() => setActiveComponent("screens")} // Define a seção de configurações como ativa
            className={styles.btn}
          >
            Configurar Telas
          </button>
        </div>

        <div className={styles.container}>          
          {/* Renderização condicional dos componentes principais do Dashboard */}
          {/* O PerfilUsuario agora gerencia seus próprios sub-componentes (Initial, AlterarNome, etc.)
              mas o Dashboard precisa saber qual deles mostrar para que o PerfilUsuario possa receber
              a prop `activeComponent` e `setActiveComponent` corretamente. */}
          {(activeComponent === "profile" || activeComponent === "alterarNome" || activeComponent === "alterarEmail" || activeComponent === "alterarSenha") && (
            <PerfilUsuario user={user} activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
          )}
          {activeComponent === "screens" && <Configuracoes user={user} />}
        </div>

        {/* Renderiza o MobileMenu, passando o usuário e a função para alterar o componente ativo */}
        {/* O MobileMenu só será visível em telas menores (<= 468px) devido ao CSS em MobileMenu.module.css */}
        <MobileMenu user={user} setActiveComponent={setActiveComponent} />
      </div>
    );
  }

  return null;
}
