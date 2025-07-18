// PerfilUsuario/index.js
import React from "react";
import Link from "next/link"; // Mantenha se ainda usar links no PerfilUsuario
import Image from "next/image";
import perfilSemFoto from "../../../../../public/perfilSemFoto.jpg";
import styles from "./PerfilUsuario.module.css";
import AlterarNome from "../AlterarNome";
import AlterarEmail from "../AlterarEmail";
import AlterarSenha from "../AlterarSenha";
import Initial from "../Initial";
// Importações de ícones relacionadas ao menu mobile removidas
import { AiFillHome } from "react-icons/ai"; // Mantido, pois é usado no botão "Home" de desktop/tablet
import GoogleLogo from "../../../../../public/icone-google.png"; // Mantido se ainda usar o logo Google aqui

// Recebe user e, crucialmente, setActiveComponent do Dashboard
const PerfilUsuario = ({ user, activeComponent, setActiveComponent }) => { 
  const wasLoggedInWithGoogle = () => {
    if (user && user.providerData) {
      return user.providerData.some(
        (provider) => provider.providerId === "google.com"
      );
    }
    return false;
  };

  const loggedInWithGoogle = wasLoggedInWithGoogle();

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
              onClick={() => setActiveComponent("profile")} // Agora usa setActiveComponent para voltar ao Initial
              title="Voltar ao início"
            >
              <AiFillHome size={25} />
            </button>

            <button
              className={styles.btnPerfil}
              onClick={() => setActiveComponent("alterarNome")} // Usa setActiveComponent
              disabled={loggedInWithGoogle}
            >
              Alterar nome
            </button>
            <button
              className={styles.btnPerfil}
              onClick={() => setActiveComponent("alterarEmail")} // Usa setActiveComponent
              disabled={loggedInWithGoogle}
            >
              Alterar e-mail
            </button>
            <button
              className={styles.btnPerfil}
              onClick={() => setActiveComponent("alterarSenha")} // Usa setActiveComponent
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

        {/* Renderização condicional dos subcomponentes de PerfilUsuario
            agora baseada na prop activeComponent, que vem do Dashboard */}
        {activeComponent === "profile" && <Initial user={user} />}
        {activeComponent === "alterarNome" && (
          <div className={styles.alterarContainer}>
            <AlterarNome />
          </div>
        )}
        {activeComponent === "alterarEmail" && (
          <div className={styles.alterarContainer}>
            <AlterarEmail />
          </div>
        )}
        {activeComponent === "alterarSenha" && (
          <div className={styles.alterarContainer}>
            <AlterarSenha />
          </div>
        )}
      </div>
      {/* O menu mobile e toda sua lógica foram movidos para o MobileMenu.js,
          então não há mais JSX ou estados relacionados a ele aqui. */}
    </>
  );
};

export default PerfilUsuario;
