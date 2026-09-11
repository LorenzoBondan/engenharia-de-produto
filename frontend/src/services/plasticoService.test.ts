import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as plasticoService from './plasticoService';
import * as requests from '../utils/requests';
import { DPlastico } from '../models/plastico';
import { createMockAxiosResponse } from '../tests/helpers/mockFactories';
import { createMockPlastico } from '../tests/helpers/serviceMockFactories';


vi.mock('../utils/requests');

const mockPlastico = createMockPlastico();

describe('PlasticoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pesquisarTodos', () => {
    it('should send GET request to /api/plastico', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await plasticoService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/plastico',
        })
      );
    });

    it('should include colunas, operacoes, valores in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await plasticoService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

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

      await plasticoService.pesquisarTodos('codigo', '=', '1');

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

      await plasticoService.pesquisarTodos('codigo', '=', '1', undefined, undefined, 'descricao;a');

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

      await plasticoService.pesquisarTodos('codigo', '=', '1', 0, 20);

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

      await plasticoService.pesquisarTodos('codigo', '=', '1');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('pesquisarPorId', () => {
    it('should send GET request to /api/plastico/:id', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/plastico/123',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle different plastico IDs', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.pesquisarPorId(999);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/plastico/999',
        })
      );
    });
  });

  describe('pesquisarHistorico', () => {
    it('should send GET request to /api/plastico/historico', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await plasticoService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/plastico/historico',
        })
      );
    });

    it('should include codigo in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await plasticoService.pesquisarHistorico(456);

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

      await plasticoService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('pesquisarAtributosEditaveisEmLote', () => {
    it('should send GET request to /api/plastico/atributoseditaveisemlote', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await plasticoService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/plastico/atributoseditaveisemlote',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await plasticoService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('criar', () => {
    it('should send POST request to /api/plastico', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPlastico));

      await plasticoService.criar(mockPlastico);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/plastico',
        })
      );
    });

    it('should include plastico data in request body', async () => {
      const mock: DPlastico = {
        descricao: 'Test Plastico',
      } as DPlastico;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mock));

      await plasticoService.criar(mock);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mock,
        })
      );
    });

    it('should set withCredentials to true', async () => {
      const mock: DPlastico = {
        descricao: 'Test Plastico',
      } as DPlastico;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mock));

      await plasticoService.criar(mock);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('atualizar', () => {
    it('should send PUT request to /api/plastico', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockPlastico));

      await plasticoService.atualizar(mockPlastico);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/plastico',
        })
      );
    });

    it('should include plastico data in request body', async () => {
      const mock = createMockPlastico({ codigo: 123, descricao: 'Updated Plastico' }) as DPlastico;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mock));

      await plasticoService.atualizar(mock);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mock,
        })
      );
    });

    it('should set withCredentials to true', async () => {
      const mock = createMockPlastico({ codigo: 123, descricao: 'Updated Plastico' }) as DPlastico;

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mock));

      await plasticoService.atualizar(mock);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('atualizarEmLote', () => {
    it('should send PUT request to /api/plastico/atualizaremlote', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.atualizarEmLote(123, 'tipo', 'PVC');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/plastico/atualizaremlote',
        })
      );
    });

    it('should include codigo, atributo, valor in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.atualizarEmLote(456, 'densidade', '1.4');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: 456,
            atributo: 'densidade',
            valor: '1.4',
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.atualizarEmLote(123, 'tipo', 'PVC');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('substituirVersao', () => {
    it('should send PUT request to /api/plastico/substituir', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/plastico/substituir',
        })
      );
    });

    it('should include codigoRegistro and codigoVersao in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.substituirVersao(100, 200);

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

      await plasticoService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('inativar', () => {
    it('should send PATCH request to /api/plastico/inativar', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: '/api/plastico/inativar',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.inativar([1, 2, 3]);

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

      await plasticoService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.inativar([1, 2]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle single codigo in array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.inativar([999]);

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
    it('should send DELETE request to /api/plastico', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: '/api/plastico',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.remover([10, 20, 30]);

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

      await plasticoService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.remover([1, 2, 3]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle empty array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await plasticoService.remover([]);

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
