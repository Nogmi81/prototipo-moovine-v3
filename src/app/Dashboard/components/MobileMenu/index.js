// components/MobileMenu/index.js
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./MobileMenu.module.css";
import { AiFillHome } from "react-icons/ai";
import { FaCog, FaUserEdit } from "react-icons/fa";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

const MobileMenu = ({ user, setActiveComponent }) => {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showAlterarDadosSubMenu, setShowAlterarDadosSubMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 468); // Usando 468px como breakpoint mobile
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMainMenuToggle = () => {
    setShowMainMenu(!showMainMenu);
    if (showMainMenu) {
      // Se o menu principal está sendo fechado
      setShowAlterarDadosSubMenu(false); // Garante que o submenu de Alterar Dados também seja fechado
    }
  };

  const handleAlterarDadosSubMenuToggle = () => {
    setShowAlterarDadosSubMenu(!showAlterarDadosSubMenu);
  };

  const handleClickMenuItem = (componentName) => {
    setActiveComponent(componentName);
    if (isMobile) {
      setShowAlterarDadosSubMenu(false);
      setShowMainMenu(false);
    }
  };

  const wasLoggedInWithGoogle = () => {
    if (user && user.providerData) {
      return user.providerData.some(
        (provider) => provider.providerId === "google.com"
      );
    }
    return false;
  };

  const loggedInWithGoogle = wasLoggedInWithGoogle();

  if (!isMobile) {
    return null; // Não renderiza o menu mobile em telas maiores
  }

  return (
    <div
      className={`${styles.menuContainerMobile} ${
        showMainMenu ? styles.expandedMenu : ""
      }`}
    >
      {showMainMenu && (
        <div className={styles.subMenu}>
          <button
            className={styles.subMenuItem}
            onClick={() => handleClickMenuItem("screens")}
          >
            <FaCog size={18} style={{ marginRight: "7px" }} /> Configurações
          </button>

          <button
            className={styles.subMenuItem}
            onClick={handleAlterarDadosSubMenuToggle}
          >
            <FaUserEdit size={18} style={{ marginRight: "7px" }} /> Alterar Dados
          </button>

          {showAlterarDadosSubMenu && (
            <div className={styles.subSubMenu}>
              <button
                className={styles.subSubMenuItem}
                onClick={() => handleClickMenuItem("profile")} // Clica em Alterar Dados para voltar à tela inicial de Perfil
                title="Voltar ao início"
              >
                <AiFillHome size={20} />
              </button>
              <button
                className={styles.subSubMenuItem}
                onClick={() => handleClickMenuItem("alterarNome")}
                disabled={loggedInWithGoogle}
              >
                Alterar nome
              </button>
              <button
                className={styles.subSubMenuItem}
                onClick={() => handleClickMenuItem("alterarEmail")}
                disabled={loggedInWithGoogle}
              >
                Alterar e-mail
              </button>
              <button
                className={styles.subSubMenuItem}
                onClick={() => handleClickMenuItem("alterarSenha")}
                disabled={loggedInWithGoogle}
              >
                Alterar senha
              </button>
            </div>
          )}
          
        </div>
      )}
      <button
        className={`${styles.mainMenuButton} ${
          showMainMenu ? styles.expanded : ""
        }`}
        onClick={handleMainMenuToggle}
        title="Menu Principal"
      >
        {showMainMenu ? (
          <SlArrowDown size={25} className={styles.arrowIcon} />
        ) : (
          <SlArrowUp size={25} className={styles.arrowIcon} />
        )}
      </button>
    </div>
  );
};

export default MobileMenu;