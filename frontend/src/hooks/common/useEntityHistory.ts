import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  UseEntityHistoryConfig,
  UseEntityHistoryReturn,
  HistoryRecord,
} from '../types';

/**
 * Session-based cache for history data
 * Key format: `${entityId}`
 * Cache persists for session duration, cleared on page refresh
 */
const historyCache = new Map<number, HistoryRecord<any>[]>();

/**
 * Maximum number of entities to cache
 * Prevents memory growth for users viewing many entities
 */
const MAX_CACHE_SIZE = 20;

/**
 * Clear the history cache (useful for testing)
 */
export function clearHistoryCache(): void {
  historyCache.clear();
}

/**
 * Custom hook for fetching and managing entity history with caching
 *
 * Features:
 * - Automatic data fetching on mount
 * - Session-based caching to avoid redundant API calls
 * - HTTP-status-aware error messages
 * - Loading states during fetch
 * - Manual refresh capability
 * - Entity ID validation
 *
 * @template T - The entity type being tracked
 * @param config - Configuration object with fetchHistoryFn and entityId
 * @returns History data, loading state, error message, and refresh function
 *
 * @example
 * ```typescript
 * const { history, loading, error, refresh } = useEntityHistory({
 *   fetchHistoryFn: corService.pesquisarHistorico,
 *   entityId: 123
 * });
 *
 * if (loading) return <Spinner />;
 * if (error) return <Alert>{error}</Alert>;
 * return <HistoryTimeline history={history} />;
 * ```
 */
export function useEntityHistory<T>(
  config: UseEntityHistoryConfig<T>
): UseEntityHistoryReturn<T> {
  const { fetchHistoryFn, entityId } = config;

  const [history, setHistory] = useState<HistoryRecord<T>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  /**
   * Validate entity ID
   */
  const isValidEntityId = (id: number): boolean => {
    return id > 0 && Number.isInteger(id);
  };

  /**
   * Get HTTP-status-aware error message
   */
  const getErrorMessage = (err: any): string => {
    if (err.response) {
      const status = err.response.status;
      switch (status) {
        case 404:
          return 'Histórico não encontrado para esta entidade. Pode ter sido excluída.';
        case 403:
          return 'Você não tem permissão para visualizar o histórico. Contate o administrador.';
        case 500:
          return 'Erro no servidor ao carregar histórico. Tente novamente.';
        default:
          return (
            err.response.data?.error ||
            'Erro ao carregar histórico. Tente novamente.'
          );
      }
    }

    if (err.message) {
      if (
        err.message.toLowerCase().includes('network') ||
        err.message.toLowerCase().includes('timeout')
      ) {
        return 'Erro de rede. Verifique sua conexão e tente novamente.';
      }
      return err.message;
    }

    return 'Erro desconhecido ao carregar histórico.';
  };

  /**
   * Sort history records by date in reverse chronological order (newest first)
   */
  const sortHistoryByDate = (
    records: HistoryRecord<T>[]
  ): HistoryRecord<T>[] => {
    return [...records].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  /**
   * Manage cache size by removing oldest entries if cache exceeds max size
   */
  const manageCacheSize = () => {
    if (historyCache.size > MAX_CACHE_SIZE) {
      const firstKey = historyCache.keys().next().value;
      if (firstKey !== undefined) {
        historyCache.delete(firstKey);
      }
    }
  };

  /**
   * Fetch history data from service
   */
  const fetchHistory = useCallback(
    async (bypassCache: boolean = false) => {
      // Set loading immediately
      setLoading(true);
      setError(null);

      // Validate entity ID
      if (!isValidEntityId(entityId)) {
        setError('ID da entidade inválido. Deve ser um número positivo.');
        setLoading(false);
        return;
      }

      // Check cache first (unless bypassing)
      if (!bypassCache && historyCache.has(entityId)) {
        const cachedData = historyCache.get(entityId)!;
        if (isMountedRef.current) {
          setHistory(cachedData);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        const response = await fetchHistoryFn(entityId);
        const historyData = response.data;

        // Sort by date (newest first)
        const sortedHistory = sortHistoryByDate(historyData);

        if (isMountedRef.current) {
          setHistory(sortedHistory);
          setLoading(false);

          // Update cache
          historyCache.set(entityId, sortedHistory);
          manageCacheSize();
        }
      } catch (err: any) {
        if (isMountedRef.current) {
          setLoading(false);
          setHistory([]);
          const errorMessage = getErrorMessage(err);
          setError(errorMessage);

          // Log error for debugging
          console.error('Error fetching history:', {
            entityId,
            error: err,
            message: errorMessage,
          });
        }
      }
    },
    [fetchHistoryFn, entityId]
  );

  /**
   * Refresh function to manually refetch data (bypasses cache)
   */
  const refresh = useCallback(() => {
    fetchHistory(true);
  }, [fetchHistory]);

  /**
   * Fetch history on mount and when entityId changes
   */
  useEffect(() => {
    isMountedRef.current = true;
    fetchHistory(false);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    refresh,
  };
}
