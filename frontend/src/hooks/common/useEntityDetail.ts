import { useState, useEffect, useCallback } from 'react';
import { EntityDetailConfig, UseEntityDetailReturn } from '../types';

/**
 * Custom hook for managing entity detail pages with nested list operations
 *
 * Features:
 * - ID validation before API calls
 * - Automatic entity data fetching on mount
 * - Manual refresh capability
 * - Nested list state management
 * - Local nested item operations (add, remove, update)
 * - Error handling
 *
 * @template T - The entity type
 * @template N - The nested item type
 * @param config - Configuration object for entity details
 * @returns Entity detail state and control functions
 *
 * @example
 * ```tsx
 * function FatherDetails({ fatherId }: { fatherId: number }) {
 *   const {
 *     entity: father,
 *     loading,
 *     error,
 *     refresh,
 *     addToNested,
 *     removeFromNested
 *   } = useEntityDetail({
 *     entityId: fatherId,
 *     fetchFunction: fatherService.buscarPorId,
 *     nestedListKey: 'sons'
 *   });
 *
 *   const handleAddSon = async (son) => {
 *     await sonService.inserir(fatherId, son);
 *     addToNested(son);  // Update local state without refetch
 *   };
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Alert>{error}</Alert>;
 *
 *   return (
 *     <div>
 *       <h1>{father.name}</h1>
 *       <SonList sons={father.sons} onAdd={handleAddSon} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useEntityDetail<T extends Record<string, any>, N = unknown>(
  config: EntityDetailConfig<T, N>
): UseEntityDetailReturn<T, N> {
  const { entityId, fetchFunction, nestedListKey } = config;

  const [entity, setEntity] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch entity data from service
   */
  const fetchEntity = useCallback(async () => {
    // Validate ID before fetch
    if (!entityId) {
      setEntity(null);
      setLoading(false);
      setError('ID da entidade não fornecido');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetchFunction(entityId);
      setEntity(response.data);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setEntity(null);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Erro ao carregar detalhes. Tente novamente.'
      );
    }
  }, [entityId, fetchFunction]);

  /**
   * Fetch entity on mount and when entityId changes
   */
  useEffect(() => {
    fetchEntity();
  }, [fetchEntity]);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(() => {
    fetchEntity();
  }, [fetchEntity]);

  /**
   * Add item to nested list (local state only)
   */
  const addToNested = useCallback(
    (item: N) => {
      if (!nestedListKey || !entity) return;

      setEntity((prev) => {
        if (!prev) return prev;

        const nestedList = prev[nestedListKey];
        if (!Array.isArray(nestedList)) return prev;

        return {
          ...prev,
          [nestedListKey]: [...nestedList, item],
        } as T;
      });
    },
    [entity, nestedListKey]
  );

  /**
   * Remove item from nested list by ID (local state only)
   */
  const removeFromNested = useCallback(
    (itemId: number | string) => {
      if (!nestedListKey || !entity) return;

      setEntity((prev) => {
        if (!prev) return prev;

        const nestedList = prev[nestedListKey];
        if (!Array.isArray(nestedList)) return prev;

        return {
          ...prev,
          [nestedListKey]: nestedList.filter((item: any) => item.id !== itemId),
        } as T;
      });
    },
    [entity, nestedListKey]
  );

  /**
   * Update item in nested list (local state only)
   */
  const updateNested = useCallback(
    (itemId: number | string, updates: Partial<N>) => {
      if (!nestedListKey || !entity) return;

      setEntity((prev) => {
        if (!prev) return prev;

        const nestedList = prev[nestedListKey];
        if (!Array.isArray(nestedList)) return prev;

        return {
          ...prev,
          [nestedListKey]: nestedList.map((item: any) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        } as T;
      });
    },
    [entity, nestedListKey]
  );

  return {
    entity,
    loading,
    error,
    refresh,
    addToNested,
    removeFromNested,
    updateNested,
  };
}
