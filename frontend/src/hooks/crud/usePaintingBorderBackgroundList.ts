import { usePaginatedList } from '../common/usePaginatedList';
import * as pinturaBordaFundoService from '../../services/pinturaBordaFundoService';
import { DPinturaBordaFundo } from '../../models/pinturaBordaFundo';
import { UsePaginatedListReturn } from '../types';

/**
 * Custom hook for Painting Border Background (MDF) list management
 */
export function usePaintingBorderBackgroundList(): UsePaginatedListReturn<DPinturaBordaFundo> {
  return usePaginatedList<DPinturaBordaFundo>({
    fetchFunction: pinturaBordaFundoService.pesquisarTodos,
    searchColumn: 'descricao',
    pageSize: 8,
    sort: 'codigo;d',
    deleteFunction: pinturaBordaFundoService.remover,
    inactivateFunction: pinturaBordaFundoService.inativar,
  });
}
