import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUserList } from './useUserList';
import * as usePaginatedList from '../common/usePaginatedList';
import * as userService from '../../services/userService';

// Mock the dependencies
vi.mock('../common/usePaginatedList');
vi.mock('../../services/userService');

describe('useUserList', () => {
  const mockUsePaginatedList = vi.mocked(usePaginatedList.usePaginatedList);

  describe('Hook Initialization', () => {
    it('should call usePaginatedList with correct configuration', () => {
      const mockReturn = {
        data: [],
        loading: false,
        error: null,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      renderHook(() => useUserList());

      expect(mockUsePaginatedList).toHaveBeenCalledWith({
        fetchFunction: userService.pesquisarTodos,
        searchColumn: 'name',
        pageSize: 8,
        sort: 'id;d',
        deleteFunction: userService.remover,
        inactivateFunction: userService.inativar,
      });
    });

    it('should configure search by name column', () => {
      const mockReturn = {
        data: [],
        loading: false,
        error: null,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      renderHook(() => useUserList());

      const config = mockUsePaginatedList.mock.calls[0][0];
      expect(config.searchColumn).toBe('name');
    });

    it('should configure page size of 8', () => {
      const mockReturn = {
        data: [],
        loading: false,
        error: null,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      renderHook(() => useUserList());

      const config = mockUsePaginatedList.mock.calls[0][0];
      expect(config.pageSize).toBe(8);
    });

    it('should configure descending sort by id', () => {
      const mockReturn = {
        data: [],
        loading: false,
        error: null,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      renderHook(() => useUserList());

      const config = mockUsePaginatedList.mock.calls[0][0];
      expect(config.sort).toBe('id;d');
    });
  });

  describe('Service Functions', () => {
    it('should pass userService.pesquisarTodos as fetch function', () => {
      const mockReturn = {
        data: [],
        loading: false,
        error: null,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      renderHook(() => useUserList());

      const config = mockUsePaginatedList.mock.calls[0][0];
      expect(config.fetchFunction).toBe(userService.pesquisarTodos);
    });

    it('should pass userService.remover as delete function', () => {
      const mockReturn = {
        data: [],
        loading: false,
        error: null,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      renderHook(() => useUserList());

      const config = mockUsePaginatedList.mock.calls[0][0];
      expect(config.deleteFunction).toBe(userService.remover);
    });

    it('should pass userService.inativar as inactivate function', () => {
      const mockReturn = {
        data: [],
        loading: false,
        error: null,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      renderHook(() => useUserList());

      const config = mockUsePaginatedList.mock.calls[0][0];
      expect(config.inactivateFunction).toBe(userService.inativar);
    });
  });

  describe('Return Value', () => {
    it('should return usePaginatedList result', () => {
      const mockReturn = {
        data: [{ id: 1, name: 'John Doe', email: 'john@example.com' }],
        loading: false,
        error: null,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useUserList());

      expect(result.current).toEqual(mockReturn);
    });

    it('should return all required properties', () => {
      const mockReturn = {
        data: [],
        loading: true,
        error: null,
        isLastPage: true,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useUserList());

      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('isLastPage');
      expect(result.current).toHaveProperty('handleSearch');
      expect(result.current).toHaveProperty('handleNextPage');
      expect(result.current).toHaveProperty('handleDelete');
      expect(result.current).toHaveProperty('handleInactivate');
    });

    it('should pass through loading state', () => {
      const mockReturn = {
        data: [],
        loading: true,
        error: null,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useUserList());

      expect(result.current.loading).toBe(true);
    });

    it('should pass through error state', () => {
      const mockError = new Error('Test error');
      const mockReturn = {
        data: [],
        loading: false,
        error: mockError,
        isLastPage: false,
        handleSearch: vi.fn(),
        handleNextPage: vi.fn(),
        handleDelete: vi.fn(),
        handleInactivate: vi.fn(),
      };

      mockUsePaginatedList.mockReturnValue(mockReturn);

      const { result } = renderHook(() => useUserList());

      expect(result.current.error).toBe(mockError);
    });
  });
});
