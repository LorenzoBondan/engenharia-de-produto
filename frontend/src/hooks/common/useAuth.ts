import { useState, useContext, useCallback } from 'react';
import { UseAuthReturn  } from '../types';
import * as authService from '../../services/authService';
import { ContextToken } from '../../utils/context-token';
import { CredentialsDTO } from '../../models/auth';

/**
 * Custom hook for authentication management
 *
 * Provides centralized authentication logic including:
 * - Login/logout operations
 * - Token management
 * - Authorization checks (isAuthenticated, hasAnyRoles)
 * - Integration with authService and ContextToken
 *
 * @returns {UseAuthReturn} Authentication state and functions
 *
 * @example
 * ```tsx
 * function LoginComponent() {
 *   const { login, loading, error, isAuthenticated } = useAuth();
 *
 *   const handleSubmit = async (credentials) => {
 *     await login(credentials);
 *     if (isAuthenticated) {
 *       navigate('/dashboard');
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const { setContextTokenPayload } = useContext(ContextToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current authentication state from authService
  const user = authService.getAccessTokenPayload();
  const isAuthenticated = authService.isAuthenticated();

  /**
   * Login with credentials
   * Calls authService.loginRequest, saves token, and updates context
   */
  const login = useCallback(
    async (credentials: CredentialsDTO): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.loginRequest(credentials);
        const { access_token } = response.data;

        // Save token to localStorage
        authService.saveAccessToken(access_token);

        // Get token payload and update context
        const payload = authService.getAccessTokenPayload();
        setContextTokenPayload(payload);

        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(
          err.response?.data?.error ||
            err.message ||
            'Falha na autenticação. Verifique suas credenciais.'
        );
      }
    },
    [setContextTokenPayload]
  );

  /**
   * Logout current user
   * Clears token from localStorage and resets context
   */
  const logout = useCallback((): void => {
    authService.logout();
    setContextTokenPayload(undefined);
    setError(null);
  }, [setContextTokenPayload]);

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRoles = useCallback(
    (roles: string[]): boolean => {
      return authService.hasAnyRoles(roles as any);
    },
    []
  );

  return {
    login,
    logout,
    isAuthenticated,
    hasAnyRoles,
    user,
    loading,
    error,
  };
}
