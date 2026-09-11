import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEntityHistory, clearHistoryCache } from './useEntityHistory';
import type { HistoryRecord } from '../types';
import type { AxiosResponse } from 'axios';

// Mock entity type for testing
type TestEntity = {
  codigo: number;
  descricao: string;
  situacao: string;
};

// Helper to create mock history records
function createMockHistoryRecord(
  id: number,
  entity: TestEntity,
  date: string = '2025-07-29T19:47:47.028828',
  author: string = 'test@test.com'
): HistoryRecord<TestEntity> {
  return {
    id,
    date,
    author,
    entity,
    diff: null,
  };
}

// Helper to create mock axios response
function createMockAxiosResponse<T>(
  data: T,
  status: number = 200
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

describe('useEntityHistory', () => {
  beforeEach(() => {
    // Clear all mocks and cache before each test
    vi.clearAllMocks();
    clearHistoryCache();
  });

  describe('successful history fetch', () => {
    it('should fetch and return history records', async () => {
      const mockHistory = [
        createMockHistoryRecord(2, {
          codigo: 1,
          descricao: 'New',
          situacao: 'ATIVO',
        }),
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Old',
          situacao: 'INATIVO',
        }),
      ];

      const mockFetchFn = vi
        .fn()
        .mockResolvedValue(createMockAxiosResponse(mockHistory));

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.history).toEqual([]);
      expect(result.current.error).toBeNull();

      // Wait for fetch to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify results
      expect(result.current.history).toEqual(mockHistory);
      expect(result.current.error).toBeNull();
      expect(mockFetchFn).toHaveBeenCalledWith(1);
      expect(mockFetchFn).toHaveBeenCalledTimes(1);
    });

    it('should sort history records by date in reverse chronological order', async () => {
      const mockHistory = [
        createMockHistoryRecord(
          1,
          { codigo: 1, descricao: 'Old', situacao: 'ATIVO' },
          '2025-01-01T10:00:00'
        ),
        createMockHistoryRecord(
          3,
          { codigo: 1, descricao: 'Newest', situacao: 'ATIVO' },
          '2025-07-29T19:47:47'
        ),
        createMockHistoryRecord(
          2,
          { codigo: 1, descricao: 'Middle', situacao: 'ATIVO' },
          '2025-05-15T12:00:00'
        ),
      ];

      const mockFetchFn = vi
        .fn()
        .mockResolvedValue(createMockAxiosResponse(mockHistory));

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify sorted by date descending (newest first)
      expect(result.current.history[0].id).toBe(3); // Newest
      expect(result.current.history[1].id).toBe(2); // Middle
      expect(result.current.history[2].id).toBe(1); // Oldest
    });
  });

  describe('loading states', () => {
    it('should set loading true during fetch and false when complete', async () => {
      const mockFetchFn = vi
        .fn()
        .mockResolvedValue(createMockAxiosResponse([]));

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('error handling', () => {
    it('should handle 404 error with appropriate message', async () => {
      const mockFetchFn = vi.fn().mockRejectedValue({
        response: { status: 404, data: { error: 'Not found' } },
      });

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 999,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain(
        'Histórico não encontrado para esta entidade'
      );
      expect(result.current.history).toEqual([]);
    });

    it('should handle 403 error with appropriate message', async () => {
      const mockFetchFn = vi.fn().mockRejectedValue({
        response: { status: 403, data: { error: 'Forbidden' } },
      });

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain('Você não tem permissão');
      expect(result.current.history).toEqual([]);
    });

    it('should handle 500 error with appropriate message', async () => {
      const mockFetchFn = vi.fn().mockRejectedValue({
        response: { status: 500, data: { error: 'Server error' } },
      });

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain('Erro no servidor');
      expect(result.current.history).toEqual([]);
    });

    it('should handle network error with appropriate message', async () => {
      const mockFetchFn = vi.fn().mockRejectedValue({
        message: 'Network Error',
      });

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain('Erro de rede');
      expect(result.current.history).toEqual([]);
    });

    it('should clear error on successful fetch', async () => {
      const mockFetchFn = vi
        .fn()
        .mockRejectedValueOnce({ response: { status: 500 } })
        .mockResolvedValueOnce(createMockAxiosResponse([]));

      const { result, rerender } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      // Wait for error
      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // Call refresh to retry
      result.current.refresh();

      // Wait for successful fetch
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.history).toEqual([]);
    });
  });

  describe('caching mechanism', () => {
    it('should cache history data for same entity', async () => {
      const mockHistory = [
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Test',
          situacao: 'ATIVO',
        }),
      ];

      const mockFetchFn = vi
        .fn()
        .mockResolvedValue(createMockAxiosResponse(mockHistory));

      // First render
      const { result, unmount } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetchFn).toHaveBeenCalledTimes(1);

      unmount();

      // Second render with same entityId should use cache
      const { result: result2 } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      await waitFor(() => {
        expect(result2.current.loading).toBe(false);
      });

      // Should not call fetch again (uses cache)
      expect(mockFetchFn).toHaveBeenCalledTimes(1);
      expect(result2.current.history).toEqual(mockHistory);
    });

    it('should fetch new data for different entity', async () => {
      const mockHistory1 = [
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Entity 1',
          situacao: 'ATIVO',
        }),
      ];
      const mockHistory2 = [
        createMockHistoryRecord(2, {
          codigo: 2,
          descricao: 'Entity 2',
          situacao: 'ATIVO',
        }),
      ];

      const mockFetchFn = vi
        .fn()
        .mockResolvedValueOnce(createMockAxiosResponse(mockHistory1))
        .mockResolvedValueOnce(createMockAxiosResponse(mockHistory2));

      // First entity
      const { result, unmount } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetchFn).toHaveBeenCalledWith(1);
      unmount();

      // Second entity (different ID)
      const { result: result2 } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 2,
        })
      );

      await waitFor(() => {
        expect(result2.current.loading).toBe(false);
      });

      // Should call fetch for new entity
      expect(mockFetchFn).toHaveBeenCalledWith(2);
      expect(mockFetchFn).toHaveBeenCalledTimes(2);
      expect(result2.current.history).toEqual(mockHistory2);
    });
  });

  describe('refresh mechanism', () => {
    it('should refetch data when refresh is called', async () => {
      const mockHistory1 = [
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Original',
          situacao: 'ATIVO',
        }),
      ];
      const mockHistory2 = [
        createMockHistoryRecord(2, {
          codigo: 1,
          descricao: 'Updated',
          situacao: 'ATIVO',
        }),
      ];

      const mockFetchFn = vi
        .fn()
        .mockResolvedValueOnce(createMockAxiosResponse(mockHistory1))
        .mockResolvedValueOnce(createMockAxiosResponse(mockHistory2));

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.history).toEqual(mockHistory1);

      // Call refresh
      result.current.refresh();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have refetched
      expect(mockFetchFn).toHaveBeenCalledTimes(2);
      expect(result.current.history).toEqual(mockHistory2);
    });

    it('should bypass cache when refresh is called', async () => {
      const mockHistory = [
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Test',
          situacao: 'ATIVO',
        }),
      ];

      const mockFetchFn = vi
        .fn()
        .mockResolvedValue(createMockAxiosResponse(mockHistory));

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 1,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetchFn).toHaveBeenCalledTimes(1);

      // Call refresh multiple times
      result.current.refresh();
      await waitFor(() => expect(result.current.loading).toBe(false));

      result.current.refresh();
      await waitFor(() => expect(result.current.loading).toBe(false));

      // Should have called fetch 3 times (initial + 2 refreshes)
      expect(mockFetchFn).toHaveBeenCalledTimes(3);
    });
  });

  describe('entityId validation', () => {
    it('should handle invalid entityId gracefully', async () => {
      const mockFetchFn = vi.fn();

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: 0, // Invalid ID
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain('ID da entidade inválido');
      expect(mockFetchFn).not.toHaveBeenCalled();
    });

    it('should handle negative entityId', async () => {
      const mockFetchFn = vi.fn();

      const { result } = renderHook(() =>
        useEntityHistory({
          fetchHistoryFn: mockFetchFn,
          entityId: -1,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toContain('ID da entidade inválido');
      expect(mockFetchFn).not.toHaveBeenCalled();
    });
  });
});
