import { usePaginatedList } from '../common/usePaginatedList';
import * as chapaService from '../../services/chapaService';
import { DChapa } from '../../models/chapa';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Sheet (MDP) list management
 */
export function useSheetList(): UsePaginatedListReturn<DChapa> {
  return usePaginatedList<DChapa>({
    fetchFunction: chapaService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: chapaService.remover,
    inactivateFunction: chapaService.inativar,
  });
}
