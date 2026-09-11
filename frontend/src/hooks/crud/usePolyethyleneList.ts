import { usePaginatedList } from '../common/usePaginatedList';
import * as polietilenoService from '../../services/polietilenoService';
import { DPolietileno } from '../../models/polietileno';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Polyethylene (Packaging) list management
 */
export function usePolyethyleneList(): UsePaginatedListReturn<DPolietileno> {
  return usePaginatedList<DPolietileno>({
    fetchFunction: polietilenoService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: polietilenoService.remover,
    inactivateFunction: polietilenoService.inativar,
  });
}
