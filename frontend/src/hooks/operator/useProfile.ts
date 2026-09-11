import { useEffect, useState } from 'react';
import { DUser } from '../../models/user';
import * as userService from '../../services/userService';
import * as authService from '../../services/authService';

/**
 * Custom hook for Profile page management
 * Wraps useCurrentUser logic for fetching user profile
 * Handles base64 image display
 */
export function useProfile() {
  const [user, setUser] = useState<DUser>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          setLoading(true);
          const response = await userService.findMe();
          setUser(response.data);
          setError(null);
        } catch (err: any) {
          setError(err.response?.data?.error || 'Erro ao carregar perfil');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
  };
}
