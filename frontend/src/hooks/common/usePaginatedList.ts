import { useState, useEffect, useCallback } from 'react';
import { PaginatedListConfig, UsePaginatedListReturn } from '../types';

/**
 * Custom hook for paginated list management with search, pagination, and CRUD operations
 *
 * Features:
 * - Automatic data fetching on mount and query parameter changes
 * - Search functionality with page reset
 * - Infinite scroll pattern (accumulates results)
 * - Delete and inactivate operations with list refresh
 * - Error handling with user-friendly messages
 *
 * @template T - The type of items in the list
 * @param config - Configuration object for the paginated list
 * @returns Paginated list state and control functions
 *
 * @example
 * ```tsx
 * function UserList() {
 *   const {
 *     data: users,
 *     loading,
 *     error,
 *     isLastPage,
 *     handleSearch,
 *     handleNextPage,
 *     handleDelete
 *   } = usePaginatedList({
 *     fetchFunction: userService.pesquisarTodos,
 *     searchColumn: 'name',
 *     pageSize: 8,
 *     deleteFunction: userService.remover
 *   });
 *
 *   return (
 *     <div>
 *       <SearchBar onSearch={handleSearch} />
 *       <List data={users} onDelete={handleDelete} />
 *       {!isLastPage && <button onClick={handleNextPage}>Load More</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePaginatedList<T>(
  config: PaginatedListConfig<T>
): UsePaginatedListReturn<T> {
  const {
    fetchFunction,
    searchColumn,
    pageSize = 8,
    sort = 'id;a',
    deleteFunction,
    inactivateFunction,
  } = config;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [queryParams, setQueryParams] = useState({
    page: 0,
    searchField: '',
  });

  /**
   * Fetch data from service
   */
  const fetchData = useCallback(
    async (page: number, searchField: string, shouldAppend: boolean) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchFunction(
          searchColumn,
          '=',
          searchField,
          page,
          pageSize,
          sort
        );

        const { content, last } = response.data;

        setData((prevData) =>
          shouldAppend ? [...prevData, ...content] : content
        );
        setIsLastPage(last);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(
          err.response?.data?.error ||
            err.message ||
            'Erro ao carregar dados. Tente novamente.'
        );
      }
    },
    [fetchFunction, searchColumn, pageSize, sort]
  );

  /**
   * Fetch data when queryParams change
   */
  useEffect(() => {
    const shouldAppend = queryParams.page > 0;
    fetchData(queryParams.page, queryParams.searchField, shouldAppend);
  }, [queryParams, fetchData]);

  /**
   * Handle search input
   * Resets page to 0 and clears existing data
   */
  const handleSearch = useCallback((searchText: string) => {
    setData([]);
    setQueryParams({ page: 0, searchField: searchText });
  }, []);

  /**
   * Handle next page request
   * Increments page number for infinite scroll
   */
  const handleNextPage = useCallback(() => {
    setQueryParams((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  }, []);

  /**
   * Handle delete operation
   * Calls delete service and refreshes list on success
   */
  const handleDelete = useCallback(
    async (ids: number[]) => {
      if (!deleteFunction) {
        console.warn('Delete function not provided');
        return;
      }

      try {
        setError(null);
        await deleteFunction(ids);

        // Refresh list from beginning
        setData([]);
        setQueryParams((prev) => ({ ...prev, page: 0 }));
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            err.message ||
            'Erro ao excluir item. Tente novamente.'
        );
      }
    },
    [deleteFunction]
  );

  /**
   * Handle inactivate operation
   * Calls inactivate service and refreshes list on success
   */
  const handleInactivate = useCallback(
    async (ids: number[]) => {
      if (!inactivateFunction) {
        console.warn('Inactivate function not provided');
        return;
      }

      try {
        setError(null);
        await inactivateFunction(ids);

        // Refresh list from beginning
        setData([]);
        setQueryParams((prev) => ({ ...prev, page: 0 }));
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            err.message ||
            'Erro ao inativar item. Tente novamente.'
        );
      }
    },
    [inactivateFunction]
  );

  /**
   * Manual refresh function
   * Reloads data from current page
   */
  const refresh = useCallback(() => {
    setData([]);
    setQueryParams((prev) => ({ ...prev, page: 0 }));
  }, []);

  return {
    data,
    loading,
    error,
    isLastPage,
    handleSearch,
    handleNextPage,
    handleDelete,
    handleInactivate,
    refresh,
  };
}
