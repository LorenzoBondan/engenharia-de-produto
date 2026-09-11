import { useState, useEffect } from 'react';
import { DropdownSource, UseDropdownDataReturn } from '../types';

/**
 * Custom hook for loading multiple dropdown/select data sources in parallel
 *
 * Features:
 * - Parallel execution of multiple service calls using Promise.allSettled
 * - Aggregate loading state across all sources
 * - Optional data transformation per source
 * - Error tracking with failed source identification
 * - Named data object for easy access
 *
 * @template T - Record type for the returned data object
 * @param sources - Array of dropdown source configurations
 * @returns Dropdown data state with named keys
 *
 * @example
 * ```tsx
 * function StructForm() {
 *   const { data, loading, error } = useDropdownData([
 *     {
 *       key: 'colors',
 *       fetchFunction: colorService.pesquisarTodos,
 *       transform: (colors) => colors.map(c => ({ value: c.id, label: c.nome }))
 *     },
 *     {
 *       key: 'models',
 *       fetchFunction: modelService.pesquisarTodos,
 *     },
 *     {
 *       key: 'users',
 *       fetchFunction: userService.pesquisarTodos,
 *     }
 *   ]);
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Alert>{error}</Alert>;
 *
 *   return (
 *     <form>
 *       <Select options={data.colors} />
 *       <Select options={data.models} />
 *       <Select options={data.users} />
 *     </form>
 *   );
 * }
 * ```
 */
export function useDropdownData<T extends Record<string, unknown>>(
  sources: DropdownSource<any>[]
): UseDropdownDataReturn<T> {
  const [data, setData] = useState<T>({} as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // Handle empty sources
    if (sources.length === 0) {
      setLoading(false);
      setData({} as T);
      setError(null);
      return;
    }

    const fetchAllData = async () => {
      if (cancelled) return;
      try {
        setLoading(true);
        setError(null);

        // Execute all fetches in parallel
        const promises = sources.map(async (source) => {
          try {
            const response = await source.fetchFunction();
            let sourceData = response.data;

            // Apply optional transformation
            if (source.transform) {
              sourceData = source.transform(sourceData);
            }

            return {
              key: source.key,
              data: sourceData,
              success: true,
            };
          } catch (err) {
            return {
              key: source.key,
              error: err,
              success: false,
            };
          }
        });

        const results = await Promise.allSettled(promises);

        // Process results
        const newData: Record<string, unknown> = {};
        const failedSources: string[] = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const value = result.value;
            if (value.success) {
              newData[value.key] = value.data;
            } else {
              failedSources.push(value.key);
            }
          } else {
            failedSources.push(sources[index].key);
          }
        });

        if (cancelled) return;

        setData(newData as T);

        // Set error if any sources failed
        if (failedSources.length > 0) {
          setError(
            `Erro ao carregar dados: ${failedSources.join(', ')}. Tente novamente.`
          );
        }

        setLoading(false);
      } catch (err: any) {
        if (cancelled) return;
        setLoading(false);
        setError(
          err.response?.data?.error ||
            err.message ||
            'Erro ao carregar dados dos dropdowns. Tente novamente.'
        );
      }
    };

    fetchAllData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sources.map(s => s.key)), refreshKey]);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return {
    data,
    loading,
    error,
    refresh,
  };
}
