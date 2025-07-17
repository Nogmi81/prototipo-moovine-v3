// AlterarEmail.jsx
import React, { useState, useEffect } from 'react';
import { useAuthentication } from '../../../hooks/useAuthentication';
import styles from "../styles/EstiloFormDashboard.module.css";
import { auth } from '../../../firebase/config';
import Modal from '../../../components/Modal/Modal';
import { TiEyeOutline, TiEye } from "react-icons/ti";
import { useRouter } from 'next/navigation'; // Importar useRouter do Next.js

function AlterarEmail() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados para o Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessageContent, setModalMessageContent] = useState('');
  const [modalType, setModalType] = useState('success'); // 'success' ou 'error' para estilização do modal

  const {
    reauthenticateAndUpdateEmail,
    logout,
    error: authErrorRaw,
    loading,
    clearAuthError
  } = useAuthentication();

  const router = useRouter(); // Hook para navegação do Next.js

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentEmail(user.email || '');
    }
  }, []);

  useEffect(() => {
    if (authErrorRaw) {
      if (!isModalOpen) {
        setMessage(authErrorRaw);
      }
    }
  }, [authErrorRaw, isModalOpen]);

  const openModal = (title, message, type) => {
    setModalTitle(title);
    setModalMessageContent(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (modalType === 'success') {
      performLogoutAndRedirect();
    }
  };

  const performLogoutAndRedirect = async () => {
    await logout();
    router.push('/Login'); // Usar router.push para navegação no Next.js
  };

  const clearAllErrorsOnFocus = () => {
    setMessage('');
    clearAuthError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    clearAuthError();

    if (newEmail.trim() === '') {
      setMessage('O novo e-mail não pode ser vazio.');
      return;
    }

    if (password.trim() === '') {
      setMessage('A senha é obrigatória para alterar o e-mail.');
      return;
    }

    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setMessage('O novo e-mail é igual ao e-mail atual. Nenhuma alteração é necessária.');
      return;
    }

    const success = await reauthenticateAndUpdateEmail(password, newEmail);

    if (success) {
      openModal(
        "Verificação de E-mail",
        <>
          <p>Sua solicitação de alteração de e-mail foi realizada com sucesso!</p>
          <p>
            Enviamos um e-mail de verificação para <span className={styles.negritoLaranja}>{newEmail}</span>. <br />
            Por favor, verifique sua caixa de entrada <span className={styles.negritoLaranja}>(e spam)</span> para confirmar a alteração.
          </p>
          <p>Você será desconectado e precisará fazer login novamente com o novo e-mail (após a verificação).</p>
        </>,
        'success'
      );
      setNewEmail('');
      setPassword('');
    } 
    
  };

  return (
    <div className={styles.container}>
      <h1>Alterar e-mail</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>E-mail atual: <span className={styles.negritoLaranja}>{currentEmail}</span></span>
        </label>

        <label>
          <span>Novo e-mail:</span>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              disabled={loading}
              onFocus={clearAllErrorsOnFocus}
            />
        </label>

        <label>
          <span>Digite sua senha:</span>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              onFocus={clearAllErrorsOnFocus}
            />
            <span
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
              style={{ color: showPassword ? 'red' : 'green' }}
            >
              {showPassword ? <TiEye size={20} /> : <TiEyeOutline size={20} />}
            </span>
          </div>
        </label>

        <button
          type="submit"
          className={`${styles.btn} ${loading ? styles.loading : ''}`}
          disabled={loading}
        >
          {loading ? 'Confirmando...' : 'Confirmar'}
        </button>
      </form>

      {message && !isModalOpen && (
        <p className={styles.erro}>{message}</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
      >
        {modalMessageContent}
      </Modal>
    </div>
  );
}

export default AlterarEmail;