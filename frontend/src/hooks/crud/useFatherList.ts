import { usePaginatedList } from '../common/usePaginatedList';
import * as paiService from '../../services/paiService';
import { DPai } from '../../models/pai';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Father (Items) list management
 */
export function useFatherList(): UsePaginatedListReturn<DPai> {
  return usePaginatedList<DPai>({
    fetchFunction: paiService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: paiService.remover,
    inactivateFunction: paiService.inativar,
  });
}
