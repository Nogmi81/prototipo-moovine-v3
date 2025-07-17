import React from "react";
import styles from "./Initial.module.css";

const Initial = ({ user }) => {
  return (
    <div className={styles.welcomePage}>
      <h1>Bem-vindo, {user ? user.displayName || user.email : "Usuário"}!</h1>
    </div>
  );
};

export default Initial;
