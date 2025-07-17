// Modal.js
import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>X</button>
        </div>
        <p className={styles.modalBody}>
          {children}
        </p>
      </div>
    </div>
  );
};

export default Modal;