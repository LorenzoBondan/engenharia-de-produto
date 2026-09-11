import { usePaginatedList } from '../common/usePaginatedList';
import * as medidasService from '../../services/medidasService';
import { DMedidas } from '../../models/medidas';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Measure list management
 */
export function useMeasureList(): UsePaginatedListReturn<DMedidas> {
  return usePaginatedList<DMedidas>({
    fetchFunction: medidasService.pesquisarTodos,
    searchColumn: 'altura',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: medidasService.remover,
    inactivateFunction: medidasService.inativar,
  });
}
