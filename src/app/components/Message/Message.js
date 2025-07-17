import React, { useEffect } from 'react';
import styles from './Message.module.css';

const Message = ({ msg, type, onClose }) => {
  if (!msg) return null; // Não renderiza se não houver mensagem

  // Opcional: fechar automaticamente após um tempo
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 30000); 
    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [msg, onClose]);

  return (
    <div className={`${styles.message} ${styles[type]}`}>
      <p>{msg}</p>
      <button onClick={onClose} className={styles.closeButton}>X</button>
    </div>
  );
};

export default Message;