import { useState, useCallback } from 'react';
import { UseDialogConfirmationReturn } from '../types';

/**
 * Custom hook for managing confirmation dialog state
 *
 * Features:
 * - Dialog open/close state management
 * - Pending action storage
 * - Action execution on confirmation
 * - Loading state during action execution
 * - Error handling with dialog persistence on failure
 * - Automatic dialog closure on success
 *
 * @returns Dialog confirmation state and control functions
 *
 * @example
 * ```tsx
 * function UserList() {
 *   const {
 *     isOpen,
 *     loading,
 *     error,
 *     openDialog,
 *     closeDialog,
 *     handleConfirm
 *   } = useDialogConfirmation();
 *
 *   const handleDeleteClick = (userId: number) => {
 *     openDialog(async () => {
 *       await userService.remover([userId]);
 *       // Refresh list after deletion
 *       refresh();
 *     });
 *   };
 *
 *   return (
 *     <>
 *       <UserTable onDelete={handleDeleteClick} />
 *       <ConfirmDialog
 *         open={isOpen}
 *         onClose={closeDialog}
 *         onConfirm={handleConfirm}
 *         loading={loading}
 *         error={error}
 *         title="Confirmar Exclusão"
 *         message="Deseja realmente excluir este usuário?"
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function useDialogConfirmation(): UseDialogConfirmationReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(
    null
  );

  /**
   * Open dialog with pending action
   */
  const openDialog = useCallback((action: () => Promise<void>) => {
    setPendingAction(() => action);
    setIsOpen(true);
    setError(null);
  }, []);

  /**
   * Close dialog and clear pending action
   */
  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setPendingAction(null);
    setError(null);
  }, []);

  /**
   * Execute pending action on confirmation
   * Closes dialog on success, keeps open on error
   */
  const handleConfirm = useCallback(async () => {
    if (!pendingAction) {
      setIsOpen(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await pendingAction();

      // Success: close dialog
      setLoading(false);
      setIsOpen(false);
      setPendingAction(null);
    } catch (err: any) {
      // Error: keep dialog open
      setLoading(false);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Erro ao executar ação. Tente novamente.'
      );
    }
  }, [pendingAction]);

  return {
    isOpen,
    loading,
    error,
    pendingAction,
    openDialog,
    closeDialog,
    handleConfirm,
  };
}
