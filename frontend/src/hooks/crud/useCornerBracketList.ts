import { usePaginatedList } from '../common/usePaginatedList';
import * as cantoneiraService from '../../services/cantoneiraService';
import { DCantoneira } from '../../models/cantoneira';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Corner Bracket (Packaging) list management
 */
export function useCornerBracketList(): UsePaginatedListReturn<DCantoneira> {
  return usePaginatedList<DCantoneira>({
    fetchFunction: cantoneiraService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: cantoneiraService.remover,
    inactivateFunction: cantoneiraService.inativar,
  });
}
