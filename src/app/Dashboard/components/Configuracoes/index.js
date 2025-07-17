import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Configuracoes.module.css";
import Initial from "../Initial";
import { AiFillHome } from "react-icons/ai";
import GoogleLogo from "../../../../../public/icone-google.png";

const PerfilUsuario = ({ user }) => {
  const [showAInitial, setShowInitial] = useState(false);

  const handleInitialClick = () => {
    setShowInitial(true);
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Olá </h1>
      </div>
    </>
  );
};

export default PerfilUsuario;
