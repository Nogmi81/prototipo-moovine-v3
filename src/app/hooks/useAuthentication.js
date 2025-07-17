// useAuthentication.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential, // Importar para reautenticação
  EmailAuthProvider, // Importar para criar credencial de e-mail/senha
  verifyBeforeUpdateEmail,
} from "firebase/auth";

import { useState } from "react";
import { auth } from "../firebase/config"; 

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearAuthError = () => setError(null);
  const startLoading = () => {
    setLoading(true);
    setError(null);
  };
  const stopLoading = () => setLoading(false);

  const register = async ({ email, password, displayName }) => {
    startLoading();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: displayName.trim() });
      await sendEmailVerification(user);
      return user;
    } catch (err) {
      const errorMap = {
        "auth/email-already-in-use": "Este e-mail já está em uso.",
        "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
        "auth/invalid-email": "O formato do e-mail é inválido.",
      };
      setError(errorMap[err.code] || "Ocorreu um erro no cadastro.");
    } finally {
      stopLoading();
    }
  };

  const loginWithEmail = async ({ email, password }) => {
    startLoading();
    try {
      const normalizedEmail = email.trim().toLowerCase();

      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      // consultar se o e-mail foi verificado
      if (!user.emailVerified) {
        setError("Seu e-mail ainda não foi verificado. Por favor, verifique sua caixa de entrada e clique no link de verificação.");
        await signOut(auth); // Desloga o usuário se o e-mail não foi verificado
        return null;
      }

      return user;
    } catch (err) {
      const errorMap = {
        "auth/wrong-password": "E-mail ou senha incorretos.",
        "auth/user-not-found": "E-mail ou senha incorretos.",
        "auth/invalid-credential": "E-mail ou senha incorretos. Se você se cadastrou com Google clique em 'Entrar com Google'",
        "auth/invalid-email": "Formato de e-mail inválido.",
        "auth/account-exists-with-different-credential":
          "Este e-mail já está cadastrado com outro método (ex: Google). Por favor, use a opção 'Entrar com Google' ou redefina sua senha.",
      };
      setError(errorMap[err.code] || `Erro ao fazer login: ${err.message}`);
    } finally {
      stopLoading();
    }
  };

  const loginWithGoogle = async () => {
    startLoading();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      const errorMap = {
        "auth/popup-closed-by-user": "Login com Google cancelado.",
        "auth/popup-blocked": "O pop-up de login foi bloqueado pelo navegador. Por favor, permita pop-ups para este site.",
        "auth/cancelled-popup-request": "A requisição do pop-up foi cancelada.",
        "auth/operation-not-allowed": "O método de login com Google não está habilitado no Firebase.",
        "auth/credential-already-in-use": "Este e-mail Google já está associado a uma conta existente. Faça login com e-mail e senha.",
      };
      setError(errorMap[err.code] || `Erro: ${err.message}`);
    } finally {
      stopLoading();
    }
  };

  const logout = async () => {
    startLoading();
    try {
      await signOut(auth);
    } catch {
      setError("Erro ao fazer logout.");
    } finally {
      stopLoading();
    }
  };

  // Função para reautenticar o usuário e então alterar a senha
  const reauthenticateAndChangePassword = async (currentPassword, newPassword) => {
    startLoading();
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Nenhum usuário logado. Por favor, faça login novamente.");
        return false;
      }

      // Cria uma credencial com a senha atual do usuário
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);

      // Reautentica o usuário
      await reauthenticateWithCredential(currentUser, credential);

      // Se a reautenticação for bem-sucedida, atualiza a senha
      await updatePassword(currentUser, newPassword);
      return true; // Indica sucesso na operação

    } catch (err) {
      // console.error("Erro em reauthenticateAndChangePassword:", err);
      const errorMap = {
        "auth/wrong-password": "A senha atual está incorreta.",
        "auth/invalid-credential": "A senha atual está incorreta.",
        "auth/user-mismatch": "Usuário incorreto. Por favor, faça login novamente.",
        "auth/weak-password": "A nova senha deve ter pelo menos 6 caracteres.",
        "auth/requires-recent-login": "Sua sessão expirou. Por favor, faça login novamente e tente alterar a senha.",
        "auth/invalid-email": "E-mail inválido para reautenticação.",
        // Adicione outros erros comuns que você queira tratar especificamente
      };
      setError(errorMap[err.code] || `Erro ao alterar a senha: ${err.message}`);
      return false;
    } finally {
      stopLoading();
    }
  };

  const reauthenticateAndUpdateEmail = async (currentPassword, newEmail) => {
    startLoading();
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Nenhum usuário logado. Por favor, faça login novamente.");
        return false;
      }

      // Reautentica o usuário com a senha atual
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Se a reautenticação for bem-sucedida, envia o e-mail de verificação para o novo endereço
      // O e-mail do usuário não é alterado na autenticação até que o link seja clicado.
      await verifyBeforeUpdateEmail(currentUser, newEmail.trim());

      return true; // Indica que o email de verificação foi enviado com sucesso

    } catch (err) {
      // console.error("Erro em reauthenticateAndUpdateEmail:", err);
      const errorMap = {
        "auth/wrong-password": "A senha atual está incorreta.",
        "auth/invalid-credential": "A senha atual está incorreta.",
        "auth/user-mismatch": "Usuário incorreto. Por favor, faça login novamente.",
        "auth/requires-recent-login": "Sua sessão expirou. Por favor, faça login novamente e tente alterar o e-mail.",
        "auth/invalid-email": "O formato do novo e-mail é inválido.",
        "auth/email-already-in-use": "Este e-mail já está em uso por outra conta.",
        // "auth/operation-not-allowed": "Para confirmar, você precisa verificar o novo e-mail. Um link de verificação foi enviado.", // Este erro pode não ser mais tão relevante aqui, pois o verifyBeforeUpdateEmail lida com isso.
      };
      setError(errorMap[err.code] || `Erro ao alterar o e-mail: ${err.message}`);
      return false;
    } finally {
      stopLoading();
    }
  };
  
  const updateUserName = async (newDisplayName) => {
    startLoading();
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, { displayName: newDisplayName.trim() });
        return true; // Indica sucesso na operação
      } else {
        setError("Nenhum usuário logado para alterar o nome.");
        return false;
      }
    } catch (err) {
      // console.error("Erro no updateUserName:", err);
      const errorMap = {
        "auth/requires-recent-login": "Sua sessão expirou. Por favor, faça login novamente.",
        // Você pode adicionar mais códigos de erro do Firebase aqui, se necessário
      };
      setError(errorMap[err.code] || `Erro ao alterar o nome: ${err.message}`);
      return false;
    } finally {
      stopLoading();
    }
  };

  return {
    register,
    loginWithEmail,
    loginWithGoogle,
    logout,
    reauthenticateAndChangePassword,
    updateUserName,
    reauthenticateAndUpdateEmail,
    error,
    loading,
    clearAuthError,
  };
};