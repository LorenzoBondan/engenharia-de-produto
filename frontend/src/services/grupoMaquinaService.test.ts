import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as grupoMaquinaService from './grupoMaquinaService';
import * as requests from '../utils/requests';
import { createMockAxiosResponse } from '../tests/helpers/mockFactories';
import { createMockGrupoMaquina } from '../tests/helpers/serviceMockFactories';

vi.mock('../utils/requests');

const mockGrupo = createMockGrupoMaquina();

describe('GrupoMaquinaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pesquisarTodos', () => {
    it('should send GET request to /api/grupomaquina', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await grupoMaquinaService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/grupomaquina',
        })
      );
    });

    it('should include colunas, operacoes, valores in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await grupoMaquinaService.pesquisarTodos('codigo,descricao', '=,LIKE', '1,test');

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

      await grupoMaquinaService.pesquisarTodos('codigo', '=', '1');

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

      await grupoMaquinaService.pesquisarTodos('codigo', '=', '1', undefined, undefined, 'descricao;a');

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

      await grupoMaquinaService.pesquisarTodos('codigo', '=', '1', 0, 20);

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

      await grupoMaquinaService.pesquisarTodos('codigo', '=', '1');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle multiple search columns', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await grupoMaquinaService.pesquisarTodos('codigo,descricao,nome', '=,LIKE,=', '1,test,G1');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            colunas: 'codigo,descricao,nome',
            operacoes: '=,LIKE,=',
            valores: '1,test,G1',
          }),
        })
      );
    });

    it('should handle pagination with different page sizes', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await grupoMaquinaService.pesquisarTodos('codigo', '=', '1', 2, 50);

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
      const mockData = [{ codigo: 1, descricao: 'Grupo Test' }];
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockData));

      const result = await grupoMaquinaService.pesquisarTodos('codigo', '=', '1');

      expect(result.data).toEqual(mockData);
    });
  });

  describe('pesquisarPorId', () => {
    it('should send GET request to /api/grupomaquina/:id', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/grupomaquina/123',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle different grupo maquina IDs', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.pesquisarPorId(999);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/grupomaquina/999',
        })
      );
    });

    it('should return grupo maquina data', async () => {
      const mockGrupo = { codigo: 123, descricao: 'Test Grupo' };
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockGrupo));

      const result = await grupoMaquinaService.pesquisarPorId(123);

      expect(result.data).toEqual(mockGrupo);
    });
  });

  describe('pesquisarHistorico', () => {
    it('should send GET request to /api/grupomaquina/historico', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await grupoMaquinaService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/grupomaquina/historico',
        })
      );
    });

    it('should include codigo in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await grupoMaquinaService.pesquisarHistorico(456);

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

      await grupoMaquinaService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should return historical data', async () => {
      const mockHistory = [{ codigo: 1, data: '2024-01-01', usuario: 'user1' }];
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockHistory));

      const result = await grupoMaquinaService.pesquisarHistorico(123);

      expect(result.data).toEqual(mockHistory);
    });
  });

  describe('pesquisarAtributosEditaveisEmLote', () => {
    it('should send GET request to /api/grupomaquina/atributoseditaveisemlote', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await grupoMaquinaService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/grupomaquina/atributoseditaveisemlote',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await grupoMaquinaService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should return editable attributes list', async () => {
      const mockAttributes = ['descricao', 'nome', 'tipo'];
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockAttributes));

      const result = await grupoMaquinaService.pesquisarAtributosEditaveisEmLote();

      expect(result.data).toEqual(mockAttributes);
    });
  });

  describe('criar', () => {
    it('should send POST request to /api/grupomaquina', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockGrupo));

      await grupoMaquinaService.criar(mockGrupo);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/grupomaquina',
        })
      );
    });

    it('should include grupo maquina data in request body', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockGrupo));

      await grupoMaquinaService.criar(mockGrupo);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockGrupo,
        })
      );
    });

    it('should set withCredentials to true', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockGrupo));

      await grupoMaquinaService.criar(mockGrupo);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should return created grupo maquina', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockGrupo));

      const result = await grupoMaquinaService.criar(mockGrupo);

      expect(result.data).toEqual(mockGrupo);
    });
  });

  describe('atualizar', () => {
    it('should send PUT request to /api/grupomaquina', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockGrupo));

      await grupoMaquinaService.atualizar(mockGrupo);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/grupomaquina',
        })
      );
    });

    it('should include grupo maquina data in request body', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockGrupo));

      await grupoMaquinaService.atualizar(mockGrupo);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockGrupo,
        })
      );
    });

    it('should set withCredentials to true', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockGrupo));

      await grupoMaquinaService.atualizar(mockGrupo);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should return updated grupo maquina', async () => {

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockGrupo));

      const result = await grupoMaquinaService.atualizar(mockGrupo);

      expect(result.data).toEqual(mockGrupo);
    });
  });

  describe('atualizarEmLote', () => {
    it('should send PUT request to /api/grupomaquina/atualizaremlote', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.atualizarEmLote(123, 'descricao', 'New Description');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/grupomaquina/atualizaremlote',
        })
      );
    });

    it('should include codigo, atributo, valor in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.atualizarEmLote(456, 'nome', 'G5');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            codigo: 456,
            atributo: 'nome',
            valor: 'G5',
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.atualizarEmLote(123, 'descricao', 'value');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle different attributes', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.atualizarEmLote(123, 'tipo', 'Type A');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            atributo: 'tipo',
            valor: 'Type A',
          }),
        })
      );
    });
  });

  describe('substituirVersao', () => {
    it('should send PUT request to /api/grupomaquina/substituir', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/grupomaquina/substituir',
        })
      );
    });

    it('should include codigoRegistro and codigoVersao in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.substituirVersao(100, 200);

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

      await grupoMaquinaService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle different version codes', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.substituirVersao(999, 888);

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
    it('should send PATCH request to /api/grupomaquina/inativar', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: '/api/grupomaquina/inativar',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.inativar([1, 2, 3]);

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

      await grupoMaquinaService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.inativar([1, 2]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle single codigo in array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.inativar([999]);

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

      await grupoMaquinaService.inativar([10, 20, 30, 40, 50]);

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
    it('should send DELETE request to /api/grupomaquina', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: '/api/grupomaquina',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.remover([10, 20, 30]);

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

      await grupoMaquinaService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.remover([1, 2, 3]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle empty array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await grupoMaquinaService.remover([]);

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

      await grupoMaquinaService.remover([777]);

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
