import { usePaginatedList } from '../common/usePaginatedList';
import * as fitaBordaService from '../../services/fitaBordaService';
import { DFitaBorda } from '../../models/fitaBorda';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Edge Banding (MDP) list management
 */
export function useEdgeBandingList(): UsePaginatedListReturn<DFitaBorda> {
  return usePaginatedList<DFitaBorda>({
    fetchFunction: fitaBordaService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: fitaBordaService.remover,
    inactivateFunction: fitaBordaService.inativar,
  });
}
