import { usePaginatedList } from '../common/usePaginatedList';
import * as pinturaService from '../../services/pinturaService';
import { DPintura } from '../../models/pintura';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Painting (MDF) list management
 */
export function usePaintingList(): UsePaginatedListReturn<DPintura> {
  return usePaginatedList<DPintura>({
    fetchFunction: pinturaService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: pinturaService.remover,
    inactivateFunction: pinturaService.inativar,
  });
}
