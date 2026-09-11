import { useState } from 'react';
import * as userService from '../../services/userService';

export function useEditProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await userService.atualizarSenha(newPassword, oldPassword);

      setSuccess(true);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao atualizar senha';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    updatePassword,
    loading,
    error,
    success,
    clearMessages,
  };
}
