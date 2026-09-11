import { usePaginatedList } from '../common/usePaginatedList';
import * as poliesterService from '../../services/poliesterService';
import { DPoliester } from '../../models/poliester';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Polyester (MDF) list management
 */
export function usePolyesterList(): UsePaginatedListReturn<DPoliester> {
  return usePaginatedList<DPoliester>({
    fetchFunction: poliesterService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: poliesterService.remover,
    inactivateFunction: poliesterService.inativar,
  });
}
