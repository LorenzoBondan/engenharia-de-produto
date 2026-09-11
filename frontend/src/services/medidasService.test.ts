import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as medidasService from './medidasService';
import * as requests from '../utils/requests';
import { DMedidas } from '../models/medidas';
import { createMockAxiosResponse } from '../tests/helpers/mockFactories';


vi.mock('../utils/requests');

describe('MedidasService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pesquisarTodos', () => {
    it('should send GET request to /api/medidas', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await medidasService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/medidas',
        })
      );
    });

    it('should include colunas, operacoes, valores in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await medidasService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

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

      await medidasService.pesquisarTodos('codigo', '=', '1');

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

      await medidasService.pesquisarTodos('codigo', '=', '1', undefined, undefined, 'descricao;a');

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

      await medidasService.pesquisarTodos('codigo', '=', '1', 0, 20);

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

      await medidasService.pesquisarTodos('codigo', '=', '1');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle multiple pagination scenarios', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await medidasService.pesquisarTodos('codigo', '=', '1', 2, 50);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2,
            pageSize: 50,
          }),
        })
      );
    });
  });

  describe('pesquisarPorId', () => {
    it('should send GET request to /api/medidas/:id', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/medidas/123',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle different medidas IDs', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.pesquisarPorId(999);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/medidas/999',
        })
      );
    });
  });

  describe('pesquisarPorMedidas', () => {
    it('should send GET request to /api/medidas/pesquisarpormedidas', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.pesquisarPorMedidas(100, 50, 20);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/medidas/pesquisarpormedidas',
        })
      );
    });

    it('should include altura, largura, espessura in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.pesquisarPorMedidas(150, 75, 30);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            altura: 150,
            largura: 75,
            espessura: 30,
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.pesquisarPorMedidas(100, 50, 20);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle zero values', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.pesquisarPorMedidas(0, 0, 0);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            altura: 0,
            largura: 0,
            espessura: 0,
          },
        })
      );
    });

    it('should handle different dimension combinations', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.pesquisarPorMedidas(200, 100, 15);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            altura: 200,
            largura: 100,
            espessura: 15,
          },
        })
      );
    });
  });

  describe('pesquisarHistorico', () => {
    it('should send GET request to /api/medidas/historico', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await medidasService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/medidas/historico',
        })
      );
    });

    it('should include codigo in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await medidasService.pesquisarHistorico(456);

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

      await medidasService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('pesquisarAtributosEditaveisEmLote', () => {
    it('should send GET request to /api/medidas/atributoseditaveisemlote', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await medidasService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/medidas/atributoseditaveisemlote',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await medidasService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('criar', () => {
    it('should send POST request to /api/medidas', async () => {
      const mockMedidas: DMedidas = {
        altura: 100,
        largura: 50,
        espessura: 20,
      } as DMedidas;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockMedidas));

      await medidasService.criar(mockMedidas);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/medidas',
        })
      );
    });

    it('should include medidas data in request body', async () => {
      const mockMedidas: DMedidas = {
        altura: 100,
        largura: 50,
        espessura: 20,
      } as DMedidas;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockMedidas));

      await medidasService.criar(mockMedidas);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockMedidas,
        })
      );
    });

    it('should set withCredentials to true', async () => {
      const mockMedidas: DMedidas = {
        altura: 100,
        largura: 50,
        espessura: 20,
      } as DMedidas;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockMedidas));

      await medidasService.criar(mockMedidas);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('atualizar', () => {
    it('should send PUT request to /api/medidas', async () => {
      const mockMedidas: DMedidas = {
        codigo: 123,
        altura: 150,
        largura: 75,
        espessura: 30,
      } as DMedidas;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockMedidas));

      await medidasService.atualizar(mockMedidas);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/medidas',
        })
      );
    });

    it('should include medidas data in request body', async () => {
      const mockMedidas: DMedidas = {
        codigo: 123,
        altura: 150,
        largura: 75,
        espessura: 30,
      } as DMedidas;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockMedidas));

      await medidasService.atualizar(mockMedidas);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockMedidas,
        })
      );
    });

    it('should set withCredentials to true', async () => {
      const mockMedidas: DMedidas = {
        codigo: 123,
        altura: 150,
        largura: 75,
        espessura: 30,
      } as DMedidas;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockMedidas));

      await medidasService.atualizar(mockMedidas);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('atualizarEmLote', () => {
    it('should send PUT request to /api/medidas/atualizaremlote', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.atualizarEmLote(123, 'altura', '200');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/medidas/atualizaremlote',
        })
      );
    });

    it('should include codigo, atributo, valor in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.atualizarEmLote(456, 'largura', '100');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: 456,
            atributo: 'largura',
            valor: '100',
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.atualizarEmLote(123, 'altura', '200');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('substituirVersao', () => {
    it('should send PUT request to /api/medidas/substituir', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/medidas/substituir',
        })
      );
    });

    it('should include codigoRegistro and codigoVersao in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.substituirVersao(100, 200);

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

      await medidasService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('inativar', () => {
    it('should send PATCH request to /api/medidas/inativar', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: '/api/medidas/inativar',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.inativar([1, 2, 3]);

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

      await medidasService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.inativar([1, 2]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle single codigo in array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.inativar([999]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: [999],
          },
        })
      );
    });
  });

  describe('remover', () => {
    it('should send DELETE request to /api/medidas', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: '/api/medidas',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.remover([10, 20, 30]);

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

      await medidasService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.remover([1, 2, 3]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle empty array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await medidasService.remover([]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: [],
          },
        })
      );
    });
  });
});
