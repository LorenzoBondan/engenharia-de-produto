import { usePaginatedList } from '../common/usePaginatedList';
import * as corService from '../../services/corService';
import { DCor } from '../../models/cor';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Color list management
 */
export function useColorList(): UsePaginatedListReturn<DCor> {
  return usePaginatedList<DCor>({
    fetchFunction: corService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: corService.remover,
    inactivateFunction: corService.inativar,
  });
}
