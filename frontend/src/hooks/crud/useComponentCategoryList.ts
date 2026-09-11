import { usePaginatedList } from '../common/usePaginatedList';
import * as categoriaComponenteService from '../../services/categoriaComponenteService';
import { DCategoriaComponente } from '../../models/categoriaComponente';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Component Category list management
 */
export function useComponentCategoryList(): UsePaginatedListReturn<DCategoriaComponente> {
  return usePaginatedList<DCategoriaComponente>({
    fetchFunction: categoriaComponenteService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: categoriaComponenteService.remover,
    inactivateFunction: categoriaComponenteService.inativar,
  });
}
