import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as polietilenoService from './polietilenoService';
import * as requests from '../utils/requests';
import { createMockAxiosResponse } from '../tests/helpers/mockFactories';
import { createMockPolietileno } from '../tests/helpers/serviceMockFactories';


vi.mock('../utils/requests');

const mockPolietileno = createMockPolietileno();

describe('PolietilenoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pesquisarTodos', () => {
    it('should send GET request to /api/polietileno', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/polietileno',
        })
      );
    });

    it('should include colunas, operacoes, valores in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            colunas: 'codigo,descricao',
            operacoes: '=,LIKE',
            valores: '1,test',
          }),
        })
      );
    });

    it('should use default sort "codigo;d" when not provided', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarTodos('codigo', '=', '1');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            sort: 'codigo;d',
          }),
        })
      );
    });

    it('should use custom sort when provided', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarTodos('codigo', '=', '1', undefined, undefined, 'descricao;a');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            sort: 'descricao;a',
          }),
        })
      );
    });

    it('should include page and pageSize when provided', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarTodos('codigo', '=', '1', 0, 20);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            page: 0,
            pageSize: 20,
          }),
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarTodos('codigo', '=', '1');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle multiple search columns', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarTodos('codigo,descricao,tipo', '=,LIKE,=', '1,test,A');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            colunas: 'codigo,descricao,tipo',
            operacoes: '=,LIKE,=',
            valores: '1,test,A',
          }),
        })
      );
    });

    it('should handle pagination with different page sizes', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarTodos('codigo', '=', '1', 2, 50);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2,
            pageSize: 50,
          }),
        })
      );
    });

    it('should return response data', async () => {
      const mockData = [{ codigo: 1, descricao: 'Polietileno Test' }];
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockData));

      const result = await polietilenoService.pesquisarTodos('codigo', '=', '1');

      expect(result.data).toEqual(mockData);
    });
  });

  describe('pesquisarPorId', () => {
    it('should send GET request to /api/polietileno/:id', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/polietileno/123',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle different polietileno IDs', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.pesquisarPorId(999);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/polietileno/999',
        })
      );
    });

    it('should return polietileno data', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPolietileno));

      const result = await polietilenoService.pesquisarPorId(123);

      expect(result.data).toEqual(mockPolietileno);
    });
  });

  describe('pesquisarHistorico', () => {
    it('should send GET request to /api/polietileno/historico', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/polietileno/historico',
        })
      );
    });

    it('should include codigo in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarHistorico(456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: 456,
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should return historical data', async () => {
      const mockHistory = [{ codigo: 1, data: '2024-01-01', usuario: 'user1' }];
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockHistory));

      const result = await polietilenoService.pesquisarHistorico(123);

      expect(result.data).toEqual(mockHistory);
    });
  });

  describe('pesquisarAtributosEditaveisEmLote', () => {
    it('should send GET request to /api/polietileno/atributoseditaveisemlote', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/polietileno/atributoseditaveisemlote',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await polietilenoService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should return editable attributes list', async () => {
      const mockAttributes = ['descricao', 'tipo', 'unidade'];
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockAttributes));

      const result = await polietilenoService.pesquisarAtributosEditaveisEmLote();

      expect(result.data).toEqual(mockAttributes);
    });
  });

  describe('criar', () => {
    it('should send POST request to /api/polietileno', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPolietileno));

      await polietilenoService.criar(mockPolietileno);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/polietileno',
        })
      );
    });

    it('should include polietileno data in request body', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPolietileno));

      await polietilenoService.criar(mockPolietileno);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockPolietileno,
        })
      );
    });

    it('should set withCredentials to true', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPolietileno));

      await polietilenoService.criar(mockPolietileno);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should return created polietileno', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPolietileno));

      const result = await polietilenoService.criar(mockPolietileno);

      expect(result.data).toEqual(mockPolietileno);
    });
  });

  describe('atualizar', () => {
    it('should send PUT request to /api/polietileno', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPolietileno));

      await polietilenoService.atualizar(mockPolietileno);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/polietileno',
        })
      );
    });

    it('should include polietileno data in request body', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPolietileno));

      await polietilenoService.atualizar(mockPolietileno);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockPolietileno,
        })
      );
    });

    it('should set withCredentials to true', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPolietileno));

      await polietilenoService.atualizar(mockPolietileno);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should return updated polietileno', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPolietileno));

      const result = await polietilenoService.atualizar(mockPolietileno);

      expect(result.data).toEqual(mockPolietileno);
    });
  });

  describe('atualizarEmLote', () => {
    it('should send PUT request to /api/polietileno/atualizaremlote', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.atualizarEmLote(123, 'descricao', 'New Description');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/polietileno/atualizaremlote',
        })
      );
    });

    it('should include codigo, atributo, valor in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.atualizarEmLote(456, 'tipo', 'A');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: 456,
            atributo: 'tipo',
            valor: 'A',
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.atualizarEmLote(123, 'descricao', 'value');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle different attributes', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.atualizarEmLote(123, 'unidade', 'KG');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            atributo: 'unidade',
            valor: 'KG',
          }),
        })
      );
    });
  });

  describe('substituirVersao', () => {
    it('should send PUT request to /api/polietileno/substituir', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/polietileno/substituir',
        })
      );
    });

    it('should include codigoRegistro and codigoVersao in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.substituirVersao(100, 200);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigoRegistro: 100,
            codigoVersao: 200,
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle different version codes', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.substituirVersao(999, 888);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigoRegistro: 999,
            codigoVersao: 888,
          },
        })
      );
    });
  });

  describe('inativar', () => {
    it('should send PATCH request to /api/polietileno/inativar', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: '/api/polietileno/inativar',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.inativar([1, 2, 3]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: [1, 2, 3],
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.inativar([1, 2]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle single codigo in array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.inativar([999]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: [999],
          },
        })
      );
    });

    it('should handle multiple codigos', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.inativar([10, 20, 30, 40, 50]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: [10, 20, 30, 40, 50],
          },
        })
      );
    });
  });

  describe('remover', () => {
    it('should send DELETE request to /api/polietileno', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: '/api/polietileno',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.remover([10, 20, 30]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: [10, 20, 30],
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.remover([1, 2, 3]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle empty array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.remover([]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: [],
          },
        })
      );
    });

    it('should handle single deletion', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await polietilenoService.remover([777]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: [777],
          },
        })
      );
    });
  });
});
