import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as userService from './userService';
import * as requests from '../utils/requests';
import { DUser } from '../models/user';
import { createMockAxiosResponse } from '../tests/helpers/mockFactories';

vi.mock('../utils/requests');

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('pesquisarTodos', () => {
    it('should send GET request to /api/user', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await userService.pesquisarTodos('id,username', '=,LIKE', '1,test');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/user',
        })
      );
    });

    it('should include colunas, operacoes, valores in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await userService.pesquisarTodos('id,username', '=,LIKE', '1,test');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            colunas: 'id,username',
            operacoes: '=,LIKE',
            valores: '1,test',
          }),
        })
      );
    });

    it('should use default sort "id;d" when not provided', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await userService.pesquisarTodos('id', '=', '1');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            sort: 'id;d',
          }),
        })
      );
    });

    it('should use custom sort when provided', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await userService.pesquisarTodos('id', '=', '1', undefined, undefined, 'username;a');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            sort: 'username;a',
          }),
        })
      );
    });

    it('should include page and pageSize when provided', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await userService.pesquisarTodos('id', '=', '1', 0, 20);

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

      await userService.pesquisarTodos('id', '=', '1');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('pesquisarPorId', () => {
    it('should send GET request to /api/user/:id', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/user/123',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.pesquisarPorId(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle different user IDs', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.pesquisarPorId(999);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/user/999',
        })
      );
    });
  });

  describe('pesquisarPorEmail', () => {
    it('should send GET request to /api/user/email/:email', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.pesquisarPorEmail('test@example.com');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/user/email/test@example.com',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.pesquisarPorEmail('test@example.com');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should handle email with special characters', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.pesquisarPorEmail('user+test@example.com');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/user/email/user+test@example.com',
        })
      );
    });
  });

  describe('findMe', () => {
    it('should send GET request to /api/user/me', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.findMe();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/user/me',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.findMe();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('pesquisarHistorico', () => {
    it('should send GET request to /api/user/historico', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await userService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/user/historico',
        })
      );
    });

    it('should include codigo in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await userService.pesquisarHistorico(456);

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

      await userService.pesquisarHistorico(123);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('pesquisarAtributosEditaveisEmLote', () => {
    it('should send GET request to /api/user/atributoseditaveisemlote', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await userService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/user/atributoseditaveisemlote',
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse([]));

      await userService.pesquisarAtributosEditaveisEmLote();

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('criar', () => {
    it('should send POST request to /api/user', async () => {
      const mockUser: DUser = {
        id: 123,
        name: 'updateduser',
        email: 'updated@test.com',
        situacao: 'ATIVO',
        password: '',
        userAnexo: {} as any,
        roles: [],
      };

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockUser));

      await userService.criar(mockUser);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/user',
        })
      );
    });

    it('should include user data in request body', async () => {
      const mockUser: DUser = {
        id: 123,
        name: 'updateduser',
        email: 'updated@test.com',
        situacao: 'ATIVO',
        password: '',
        userAnexo: {} as any,
        roles: [],
      };

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockUser));

      await userService.criar(mockUser);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockUser,
        })
      );
    });

    it('should not include withCredentials for user creation', async () => {
      const mockUser: DUser = {
        id: 123,
        name: 'updateduser',
        email: 'updated@test.com',
        situacao: 'ATIVO',
        password: '',
        userAnexo: {} as any,
        roles: [],
      };

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockUser));

      await userService.criar(mockUser);

      const call = vi.mocked(requests.requestBackend).mock.calls[0][0];
      expect(call.withCredentials).toBeUndefined();
    });
  });

  describe('atualizar', () => {
    it('should send PUT request to /api/user', async () => {
      const mockUser: DUser = {
        id: 123,
        name: 'updateduser',
        email: 'updated@test.com',
        situacao: 'ATIVO',
        password: '',
        userAnexo: {} as any,
        roles: [],
      };

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockUser));

      await userService.atualizar(mockUser);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/user',
        })
      );
    });

    it('should include user data in request body', async () => {
      const mockUser: DUser = {
        id: 123,
        name: 'updateduser',
        email: 'updated@test.com',
        situacao: 'ATIVO',
        password: '',
        userAnexo: {} as any,
        roles: [],
      };

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockUser));

      await userService.atualizar(mockUser);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockUser,
        })
      );
    });

    it('should set withCredentials to true', async () => {
      const mockUser: DUser = {
        id: 123,
        name: 'updateduser',
        email: 'updated@test.com',
        situacao: 'ATIVO',
        password: '',
        userAnexo: {} as any,
        roles: [],
      };

      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse(mockUser));

      await userService.atualizar(mockUser);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('atualizarSenha', () => {
    it('should send PUT request to /api/user/password', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.atualizarSenha('newpass123', 'oldpass123');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/user/password',
        })
      );
    });

    it('should include newPassword and oldPassword in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.atualizarSenha('newSecurePass', 'oldSecurePass');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            newPassword: 'newSecurePass',
            oldPassword: 'oldSecurePass',
          },
        })
      );
    });

    it('should set withCredentials to true', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.atualizarSenha('newpass', 'oldpass');

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('substituirVersao', () => {
    it('should send PUT request to /api/user/substituir', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/user/substituir',
        })
      );
    });

    it('should include codigoRegistro and codigoVersao in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.substituirVersao(100, 200);

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

      await userService.substituirVersao(123, 456);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });
  });

  describe('inativar', () => {
    it('should send PATCH request to /api/user/inativar', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: '/api/user/inativar',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.inativar([1, 2, 3]);

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

      await userService.inativar([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.inativar([1, 2]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle single codigo in array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.inativar([999]);

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
    it('should send DELETE request to /api/user', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: '/api/user',
        })
      );
    });

    it('should include codigo array in params', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.remover([10, 20, 30]);

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

      await userService.remover([123]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: true,
        })
      );
    });

    it('should use paramsSerializer with arrayFormat repeat', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.remover([1, 2, 3]);

      expect(requests.requestBackend).toHaveBeenCalledWith(
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
        })
      );
    });

    it('should handle empty array', async () => {
      vi.mocked(requests.requestBackend).mockResolvedValue(createMockAxiosResponse({}));

      await userService.remover([]);

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
