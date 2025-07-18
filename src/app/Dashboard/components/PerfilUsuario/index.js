import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import perfilSemFoto from "../../../../../public/perfilSemFoto.jpg";
import styles from "./PerfilUsuario.module.css";
import AlterarNome from "../AlterarNome";
import AlterarEmail from "../AlterarEmail";
import AlterarSenha from "../AlterarSenha";
import Initial from "../Initial";
import Configuracoes from "../Configuracoes";
import { AiFillHome } from "react-icons/ai";
import { FaCog, FaUserEdit } from "react-icons/fa";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import GoogleLogo from "../../../../../public/icone-google.png";

const PerfilUsuario = ({ user }) => {
  const [showInitial, setShowInitial] = useState(true);
  const [showAlterarSenha, setShowAlterarSenha] = useState(false);
  const [showAlterarNome, setShowAlterarNome] = useState(false);
  const [showAlterarEmail, setShowAlterarEmail] = useState(false);
  const [showConfiguracoes, setShowConfiguracoes] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showAlterarDadosSubMenu, setShowAlterarDadosSubMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleAlterarNomeClick = () => {
    setShowInitial(false);
    setShowAlterarSenha(false);
    setShowAlterarEmail(false);
    setShowConfiguracoes(false); // Garante que Configuracoes seja oculto
    setShowAlterarNome(true); // Sempre exibe AlterarNome ao clicar
    if (isMobile) {
      setShowAlterarDadosSubMenu(false);
      setShowMainMenu(false);
    }
  };

  const handleAlterarEmailClick = () => {
    setShowInitial(false);
    setShowAlterarSenha(false);
    setShowAlterarNome(false);
    setShowConfiguracoes(false); // Garante que Configuracoes seja oculto
    setShowAlterarEmail(true); // Sempre exibe AlterarEmail ao clicar
    if (isMobile) {
      setShowAlterarDadosSubMenu(false);
      setShowMainMenu(false);
    }
  };

  const handleAlterarSenhaClick = () => {
    setShowInitial(false);
    setShowAlterarNome(false);
    setShowAlterarEmail(false);
    setShowConfiguracoes(false); // Garante que Configuracoes seja oculto
    setShowAlterarSenha(true); // Sempre exibe AlterarSenha ao clicar
    if (isMobile) {
      setShowAlterarDadosSubMenu(false);
      setShowMainMenu(false);
    }
  };

  const handleConfiguracoesClick = () => {
    setShowInitial(false);
    setShowAlterarNome(false);
    setShowAlterarEmail(false);
    setShowAlterarSenha(false);
    setShowConfiguracoes(true); // Sempre exibe Configuracoes ao clicar
    if (isMobile) {
      setShowAlterarDadosSubMenu(false); // Fechar submenu Alterar Dados ao clicar em Configurações
      setShowMainMenu(false);
    }
  };

  const handleInitialClick = () => {
    setShowInitial(true);
    setShowAlterarNome(false);
    setShowAlterarEmail(false);
    setShowAlterarSenha(false);
    setShowConfiguracoes(false);
    if (isMobile) {
      setShowAlterarDadosSubMenu(false);
      setShowMainMenu(false);
    }
  };

  const handleMainMenuToggle = () => {
    setShowMainMenu(!showMainMenu);
    if (showMainMenu) {
      // Se o menu principal está sendo fechado
      setShowAlterarDadosSubMenu(false); // Garante que o submenu de Alterar Dados também seja fechado
    }
  };

  const handleAlterarDadosSubMenuToggle = () => {
    // Apenas alterna a visibilidade do submenu.
    // O componente principal visível não deve mudar aqui.
    setShowAlterarDadosSubMenu(!showAlterarDadosSubMenu);
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

  // Definindo a URL da foto de perfil
  // Prioriza a photoURL do usuário, caso contrário, usa a imagem padrão
  const userPhotoUrl = user && user.photoURL ? user.photoURL : perfilSemFoto;

  return (
    <>
      <div className={styles.containerPerfil}>
        <div className={styles.perfilConteudo}>
          <div>
            <Image
              className={styles.fotoPerfil}
              src={userPhotoUrl}
              alt="Foto de Perfil"
              width={150}
              height={150}
            />
          </div>

          <div className={styles.btsPerfil}>
            <button
              className={styles.btnHome}
              onClick={handleInitialClick}
              title="Voltar ao início"
              // disabled={loggedInWithGoogle}
            >
              <AiFillHome size={25} />
            </button>

            <button
              className={styles.btnPerfil}
              onClick={handleAlterarNomeClick}
              disabled={loggedInWithGoogle}
            >
              Alterar nome
            </button>
            <button
              className={styles.btnPerfil}
              onClick={handleAlterarEmailClick}
              disabled={loggedInWithGoogle}
            >
              Alterar e-mail
            </button>
            <button
              className={styles.btnPerfil}
              onClick={handleAlterarSenhaClick}
              disabled={loggedInWithGoogle}
            >
              Alterar senha
            </button>
          </div>

          {loggedInWithGoogle && (
            <div className={styles.googleMessage}>
              <div>
                Seu acesso é via{" "}
                <span className={styles.googleSpan}>Google</span>
              </div>
              <Image
                src={GoogleLogo}
                alt="Logo do Google"
                width={35}
                height={35}
              />
            </div>
          )}
        </div>

        <div className={styles.verticalDivider}></div>

        {showInitial ? (
          <Initial user={user} />
        ) : (
          <>
            {showAlterarNome && (
              <div className={styles.alterarContainer}>
                <AlterarNome />
              </div>
            )}
            {showAlterarEmail && (
              <div className={styles.alterarContainer}>
                <AlterarEmail />
              </div>
            )}
            {showAlterarSenha && (
              <div className={styles.alterarContainer}>
                <AlterarSenha />
              </div>
            )}
            {showConfiguracoes && (
              <div className={styles.alterarContainer}>
                <Configuracoes />
              </div>
            )}
          </>
        )}
      </div>

      <div
        className={`${styles.menuContainerMobile} ${
          showMainMenu ? styles.expandedMenu : ""
        }`}
      >
        {showMainMenu && (
          <div className={styles.subMenu}>
            <button
              className={styles.subMenuItem}
              onClick={handleConfiguracoesClick}
            >
              <FaCog size={18} style={{ marginRight: "7px" }} /> Configurações
            </button>

            <button
              className={styles.subMenuItem}
              onClick={handleAlterarDadosSubMenuToggle}
            >
              <FaUserEdit size={18} style={{ marginRight: "7px" }} /> Alterar
              Dados
            </button>

            {showAlterarDadosSubMenu && (
              <div className={styles.subSubMenu}>
                <button
                  className={styles.subSubMenuItem}
                  onClick={handleInitialClick}
                  title="Voltar ao início"
                  // disabled={loggedInWithGoogle}
                >
                  <AiFillHome size={20} />
                </button>
                <button
                  className={styles.subSubMenuItem}
                  onClick={handleAlterarNomeClick}
                  disabled={loggedInWithGoogle}
                >
                  Alterar nome
                </button>
                <button
                  className={styles.subSubMenuItem}
                  onClick={handleAlterarEmailClick}
                  disabled={loggedInWithGoogle}
                >
                  Alterar e-mail
                </button>
                <button
                  className={styles.subSubMenuItem}
                  onClick={handleAlterarSenhaClick}
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
    </>
  );
};

export default PerfilUsuario;
