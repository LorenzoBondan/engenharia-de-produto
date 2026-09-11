import { usePaginatedList } from '../common/usePaginatedList';
import * as modeloService from '../../services/modeloService';
import { DModelo } from '../../models/modelo';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Model list management
 */
export function useModelList(): UsePaginatedListReturn<DModelo> {
  return usePaginatedList<DModelo>({
    fetchFunction: modeloService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: modeloService.remover,
    inactivateFunction: modeloService.inativar,
  });
}
