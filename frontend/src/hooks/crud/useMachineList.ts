import { usePaginatedList } from '../common/usePaginatedList';
import * as maquinaService from '../../services/maquinaService';
import { DMaquina } from '../../models/maquina';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Machine (Guides) list management
 */
export function useMachineList(): UsePaginatedListReturn<DMaquina> {
  return usePaginatedList<DMaquina>({
    fetchFunction: maquinaService.pesquisarTodos,
    searchColumn: 'nome',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: maquinaService.remover,
    inactivateFunction: maquinaService.inativar,
  });
}
