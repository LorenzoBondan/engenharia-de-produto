import { usePaginatedList } from '../common/usePaginatedList';
import * as filhoService from '../../services/filhoService';
import { DFilho } from '../../models/filho';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Son (Items) list management
 */
export function useSonList(): UsePaginatedListReturn<DFilho> {
  return usePaginatedList<DFilho>({
    fetchFunction: filhoService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: filhoService.remover,
    inactivateFunction: filhoService.inativar,
  });
}
