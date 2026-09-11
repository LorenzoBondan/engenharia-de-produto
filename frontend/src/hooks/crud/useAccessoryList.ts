import { usePaginatedList } from '../common/usePaginatedList';
import * as acessorioService from '../../services/acessorioService';
import { DAcessorio } from '../../models/acessorio';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Accessory (Aluminium) list management
 */
export function useAccessoryList(): UsePaginatedListReturn<DAcessorio> {
  return usePaginatedList<DAcessorio>({
    fetchFunction: acessorioService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: acessorioService.remover,
    inactivateFunction: acessorioService.inativar,
  });
}
