import { usePaginatedList } from '../common/usePaginatedList';
import * as grupoMaquinaService from '../../services/grupoMaquinaService';
import { DGrupoMaquina } from '../../models/grupoMaquina';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Machine Group (Guides) list management
 */
export function useMachineGroupList(): UsePaginatedListReturn<DGrupoMaquina> {
  return usePaginatedList<DGrupoMaquina>({
    fetchFunction: grupoMaquinaService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: grupoMaquinaService.remover,
    inactivateFunction: grupoMaquinaService.inativar,
  });
}
