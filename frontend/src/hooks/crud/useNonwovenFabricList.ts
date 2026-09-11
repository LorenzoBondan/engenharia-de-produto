import { usePaginatedList } from '../common/usePaginatedList';
import * as tntService from '../../services/tntService';
import { DTnt } from '../../models/tnt';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Nonwoven Fabric (TNT/Packaging) list management
 */
export function useNonwovenFabricList(): UsePaginatedListReturn<DTnt> {
  return usePaginatedList<DTnt>({
    fetchFunction: tntService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: tntService.remover,
    inactivateFunction: tntService.inativar,
  });
}
