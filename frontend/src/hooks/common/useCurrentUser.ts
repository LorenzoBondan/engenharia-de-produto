import { useMemo } from 'react';
import * as authService from '../../services/authService';
import { UseCurrentUserReturn } from '../types';

/**
 * Custom hook for accessing current authenticated user information
 *
 * Features:
 * - Get current user from access token
 * - Check authentication status
 * - Role checking utilities
 * - Extract user email and roles
 *
 * @returns Current user information and utilities
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const {
 *     user,
 *     isAuthenticated,
 *     email,
 *     roles,
 *     hasRole,
 *     hasAnyRoles
 *   } = useCurrentUser();
 *
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" />;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Bem-vindo, {email}</h1>
 *       {hasRole('ROLE_ADMIN') && <AdminPanel />}
 *       <p>Suas funções: {roles.join(', ')}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCurrentUser(): UseCurrentUserReturn {
  const user = authService.getAccessTokenPayload();
  const isAuthenticated = !!user;

  const email = useMemo(() => (user?.username || null), [user]);

  const roles = useMemo(() => (user?.authorities || []), [user]);

  const hasRole = useMemo(
    () => (role: string) => {
      return authService.hasAnyRoles([role] as any);
    },
    []
  );

  const hasAnyRoles = useMemo(
    () => (rolesToCheck: string[]) => {
      return authService.hasAnyRoles(rolesToCheck as any);
    },
    []
  );

  return {
    user,
    isAuthenticated,
    email,
    roles,
    hasRole,
    hasAnyRoles,
  };
}
