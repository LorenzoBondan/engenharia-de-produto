import { usePaginatedList } from '../common/usePaginatedList';
import * as bagueteService from '../../services/bagueteService';
import { DBaguete } from '../../models/baguete';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Molding (Aluminium) list management
 */
export function useMoldingList(): UsePaginatedListReturn<DBaguete> {
  return usePaginatedList<DBaguete>({
    fetchFunction: bagueteService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: bagueteService.remover,
    inactivateFunction: bagueteService.inativar,
  });
}
