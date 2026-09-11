import { usePaginatedList } from '../common/usePaginatedList';
import * as userService from '../../services/userService';
import { DUser } from '../../models/user';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for User list management
 *
 * Features:
 * - Wraps usePaginatedList with userService configuration
 * - Type-safe DUser interface
 * - Search by name
 * - Delete and inactivate operations
 *
 * @returns User list state and control functions
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
 *     handleDelete,
 *     handleInactivate
 *   } = useUserList();
 *
 *   return (
 *     <div>
 *       <SearchBar onSearch={handleSearch} />
 *       <UserTable
 *         users={users}
 *         onDelete={handleDelete}
 *         onInactivate={handleInactivate}
 *       />
 *       {!isLastPage && <button onClick={handleNextPage}>Load More</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserList(): UsePaginatedListReturn<DUser> {
  return usePaginatedList<DUser>({
    fetchFunction: userService.pesquisarTodos,
    searchColumn: 'name',
    pageSize: 8,
    sort: 'id;d',
    deleteFunction: userService.remover,
    inactivateFunction: userService.inativar,
  });
}
