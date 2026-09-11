import { usePaginatedList } from '../common/usePaginatedList';
import * as roteiroService from '../../services/roteiroService';
import { DRoteiro } from '../../models/roteiro';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Guide (Items) list management
 */
export function useGuideList(): UsePaginatedListReturn<DRoteiro> {
  return usePaginatedList<DRoteiro>({
    fetchFunction: roteiroService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: roteiroService.remover,
    inactivateFunction: roteiroService.inativar,
  });
}
