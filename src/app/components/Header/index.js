// app/components/Header.js
"use client";

import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthentication } from "../../hooks/useAuthentication";

import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [menuDropdownVisible, setMenuDropdownVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { logout } = useAuthentication();

  const { user, authLoading } = useAuth();
  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      // Redireciona para a Home com um parâmetro de URL indicando logout.
      // router.push("/?logout=true");
    } catch (err) {
      console.error("Erro ao sair:", err.message);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (authLoading) return null;

  const isDashboard = pathname === "/Dashboard";
  const headerClass = `${styles.header} ${
    user && isDashboard ? styles.dashboardHeader : ""
  }`;

  return (
    <header className={headerClass}>
      <Link
        href="/"
        className={`${styles.logo} ${
          user && isDashboard ? styles.logoDashboard : ""
        }`}
      >
        {user && isDashboard
          ? isMobile
            ? "moovine"
            : "moovine | Dashboard"
          : "moovine"}
      </Link>

      {isMobile && (
        <button
          className={styles.hamburgerIcon}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      )}

      {!user && !isMobile && (
        <div
          className={styles.menuWrapper}
          onMouseEnter={() => setMenuDropdownVisible(true)}
          onMouseLeave={() => setMenuDropdownVisible(false)}
        >
          <button className={styles.btnAcesso}>Entrar</button>
          {menuDropdownVisible && (
            <div className={styles.dropdown}>
              <Link href="/Login">Login</Link>
              <Link href="/Cadastro">Cadastrar</Link>              
            </div>
          )}
        </div>
      )}

      {!user && isMobile && mobileMenuOpen && (
        <div className={`${styles.loggedInButtons} ${styles.mobileMenuOpen}`}>
          <Link
            href="/Login"
            className={styles.btnAcesso}
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/Cadastro"
            className={styles.btnAcesso}
            onClick={() => setMobileMenuOpen(false)}
          >
            Cadastrar
          </Link>          
        </div>
      )}

      {user && (
        <div
          className={`${styles.loggedInButtons} ${
            mobileMenuOpen && isMobile ? styles.mobileMenuOpen : ""
          }`}
        >
          <Link
            href="/Dashboard"
            className={styles.btnAcesso}
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button onClick={handleLogout} className={styles.btnAcesso}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
}