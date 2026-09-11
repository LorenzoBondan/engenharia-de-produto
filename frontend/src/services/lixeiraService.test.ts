import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as lixeiraService from './lixeiraService';
import * as requests from '../utils/requests';
import { createMockAxiosResponse } from '../tests/helpers/mockFactories';


vi.mock('../utils/requests');

describe('LixeiraService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pesquisarTodos', () => {
    it('should send GET request to /api/lixeira', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await lixeiraService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/lixeira',
        })
      );
    });

    it('should include colunas, operacoes, valores in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await lixeiraService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

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

      await lixeiraService.pesquisarTodos('codigo', '=', '1');

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

      await lixeiraService.pesquisarTodos('codigo', '=', '1', undefined, undefined, 'descricao;a');

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

      await lixeiraService.pesquisarTodos('codigo', '=', '1', 0, 20);

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

      await lixeiraService.pesquisarTodos('codigo', '=', '1');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle multiple pagination scenarios', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await lixeiraService.pesquisarTodos('codigo', '=', '1', 2, 50);

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

  describe('recuperarPorId', () => {
    it('should send GET request to /api/lixeira/recuperar/:id', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorId(123, false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/lixeira/recuperar/123',
        })
      );
    });

    it('should include recuperarDependencias in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorId(456, true);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            recuperarDependencias: true,
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorId(123, false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle recuperarDependencias as false', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorId(789, false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            recuperarDependencias: false,
          },
        })
      );
    });

    it('should handle different lixeira IDs', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorId(999, true);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/lixeira/recuperar/999',
        })
      );
    });

    it('should handle ID 1 with recuperarDependencias true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorId(1, true);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/lixeira/recuperar/1',
          params: {
            recuperarDependencias: true,
          },
        })
      );
    });
  });

  describe('recuperarPorEntidadeId', () => {
    it('should send POST request to /api/lixeira/recuperarporentidadeid', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorEntidadeId({ id: 123 }, false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/lixeira/recuperarporentidadeid',
        })
      );
    });

    it('should include recuperarDependencias in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorEntidadeId({ id: 456 }, true);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            recuperarDependencias: true,
          },
        })
      );
    });

    it('should include entidadeid in request body', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));
      const entidadeId = { id: 789, type: 'test' };

      await lixeiraService.recuperarPorEntidadeId(entidadeId, false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: entidadeId,
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorEntidadeId({ id: 123 }, false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle recuperarDependencias as false', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorEntidadeId({ id: 100 }, false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            recuperarDependencias: false,
          },
        })
      );
    });

    it('should handle complex entidadeid object', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));
      const complexEntity = {
        id: 999,
        type: 'complex',
        metadata: { nested: 'value' },
      };

      await lixeiraService.recuperarPorEntidadeId(complexEntity, true);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: complexEntity,
        })
      );
    });

    it('should handle null entidadeid', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorEntidadeId(null, false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: null,
        })
      );
    });

    it('should handle undefined entidadeid', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorEntidadeId(undefined, false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: undefined,
        })
      );
    });

    it('should handle array of entidadeids', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));
      const entidadeIds = [{ id: 1 }, { id: 2 }, { id: 3 }];

      await lixeiraService.recuperarPorEntidadeId(entidadeIds, true);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: entidadeIds,
        })
      );
    });

    it('should handle string entidadeid', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorEntidadeId('test-id', false);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: 'test-id',
        })
      );
    });

    it('should handle numeric entidadeid', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorEntidadeId(42, true);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: 42,
        })
      );
    });

    it('should call requestBackend exactly once', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await lixeiraService.recuperarPorEntidadeId({ id: 123 }, false);

      expect(requests.requestBackend).toHaveBeenCalledTimes(1);
    });
  });
});
