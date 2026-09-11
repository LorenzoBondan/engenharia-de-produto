import { usePaginatedList } from '../common/usePaginatedList';
import * as colaService from '../../services/colaService';
import { DCola } from '../../models/cola';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Glue (MDP) list management
 */
export function useGlueList(): UsePaginatedListReturn<DCola> {
  return usePaginatedList<DCola>({
    fetchFunction: colaService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: colaService.remover,
    inactivateFunction: colaService.inativar,
  });
}
