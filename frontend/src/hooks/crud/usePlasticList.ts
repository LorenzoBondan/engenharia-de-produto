import { usePaginatedList } from '../common/usePaginatedList';
import * as plasticoService from '../../services/plasticoService';
import { DPlastico } from '../../models/plastico';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Plastic (Packaging) list management
 */
export function usePlasticList(): UsePaginatedListReturn<DPlastico> {
  return usePaginatedList<DPlastico>({
    fetchFunction: plasticoService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: plasticoService.remover,
    inactivateFunction: plasticoService.inativar,
  });
}
