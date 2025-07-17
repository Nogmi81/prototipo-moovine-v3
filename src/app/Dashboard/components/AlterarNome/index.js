// ChangeName.jsx
import React, { useState, useEffect } from 'react';
import { useAuthentication } from '../../../hooks/useAuthentication';
import styles from "../styles/EstiloFormDashboard.module.css"; // Importação corrigida
import { auth } from '../../../firebase/config'; // Importe a instância de auth do Firebase

function ChangeName() {
  const [newDisplayName, setNewDisplayName] = useState('');
  const [currentDisplayName, setCurrentDisplayName] = useState('');
  const [message, setMessage] = useState('');

  // Desestruturar a nova função e outros estados/funções de useAuthentication
  const { updateUserName, error: authErrorRaw, loading, clearAuthError } = useAuthentication();

  useEffect(() => {
    // Ao carregar o componente, preenche o campo com o nome de exibição atual do usuário
    const user = auth.currentUser;
    if (user) {
      setCurrentDisplayName(user.displayName || '');
      setNewDisplayName(user.displayName || ''); // Preenche o input também
    }
  }, []); // Executa apenas uma vez ao montar o componente

  useEffect(() => {
    if (authErrorRaw) {
      setMessage(authErrorRaw);
    }
  }, [authErrorRaw]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    clearAuthError();

    if (newDisplayName.trim() === '') {
      setMessage('O nome de exibição não pode ser vazio.');
      return;
    }

    if (newDisplayName.trim() === currentDisplayName) {
      setMessage('O novo nome de exibição é igual ao atual.');
      return;
    }

    // Chama a nova função do hook de autenticação
    const success = await updateUserName(newDisplayName);

    if (success) {
      setMessage('Nome de exibição alterado com sucesso! ✅');
      // Atualiza o nome de exibição atual no estado local
      setCurrentDisplayName(newDisplayName);
    } else {
      // Se não houve erro específico do authErrorRaw, exibe uma mensagem genérica
      if (!authErrorRaw) {
        setMessage('Ocorreu um erro inesperado ao alterar o nome.');
      }
    }
  };

  const displayMessage = () => {
    if (message) {
      if (message.includes('✅')) {
        return <p className={styles.success}>{message}</p>; // Classe 'success' do CSS
      } else {
        return <p className={styles.erro}>{message}</p>; // Classe 'erro' do CSS
      }
    }
    return null;
  };

  return (
    <div className={styles.container}> {/* Classe 'container' do CSS */}
      <h1>Alterar Nome</h1> {/* Elemento H1 para corresponder ao CSS */}
      <form onSubmit={handleSubmit}>
        {/* INPUT: Novo Nome de Exibição */}
        <label>
          <span>Nome atual: {currentDisplayName}</span>
          <input
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            required
            disabled={loading}
            onFocus={() => setMessage('')}
          />
        </label>

        <button
          type="submit"
          className={`${styles.btn} ${loading ? styles.loading : ''}`} // Classes 'btn' e 'loading' do CSS
          disabled={loading}
        >
          {loading ? 'Alterando...' : 'Alterar Nome'}
        </button>
      </form>
      {displayMessage()}
    </div>
  );
}

export default ChangeName;