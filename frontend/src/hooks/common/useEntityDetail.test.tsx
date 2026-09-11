import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEntityDetail } from './useEntityDetail';
import { EntityDetailConfig } from '../types';

describe('useEntityDetail', () => {
  const mockFetchFunction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Without entityId', () => {
    it('should return error when entityId is not provided', () => {
      const config: EntityDetailConfig<any, any> = {
        fetchFunction: mockFetchFunction,
      };

      const { result } = renderHook(() => useEntityDetail(config));

      expect(result.current.entity).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('ID da entidade não fornecido');
      expect(mockFetchFunction).not.toHaveBeenCalled();
    });
  });

  describe('With entityId', () => {
    it('should fetch entity data on mount', async () => {
      const entityData = {
        id: 1,
        name: 'Test Entity',
        description: 'Test Description',
      };

      mockFetchFunction.mockResolvedValue({ data: entityData });

      const config: EntityDetailConfig<any, any> = {
        entityId: 1,
        fetchFunction: mockFetchFunction,
      };

      const { result } = renderHook(() => useEntityDetail(config));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetchFunction).toHaveBeenCalledWith(1);
      expect(result.current.entity).toEqual(entityData);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch errors', async () => {
      mockFetchFunction.mockRejectedValue(new Error('Not found'));

      const config: EntityDetailConfig<any, any> = {
        entityId: 1,
        fetchFunction: mockFetchFunction,
      };

      const { result } = renderHook(() => useEntityDetail(config));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.entity).toBeNull();
    });

    it('should refresh entity data', async () => {
      const entityData = {
        id: 1,
        name: 'Test Entity',
      };

      mockFetchFunction.mockResolvedValue({ data: entityData });

      const config: EntityDetailConfig<any, any> = {
        entityId: 1,
        fetchFunction: mockFetchFunction,
      };

      const { result } = renderHook(() => useEntityDetail(config));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetchFunction).toHaveBeenCalledTimes(1);

      // Call refresh
      act(() => {
        result.current.refresh();
      });

      await waitFor(() => {
        expect(mockFetchFunction).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Nested List Operations', () => {
    const entityWithNested = {
      id: 1,
      name: 'Parent',
      children: [
        { id: 1, name: 'Child 1' },
        { id: 2, name: 'Child 2' },
      ],
    };

    it('should add item to nested list', async () => {
      mockFetchFunction.mockResolvedValue({ data: entityWithNested });

      const config: EntityDetailConfig<any, any> = {
        entityId: 1,
        fetchFunction: mockFetchFunction,
        nestedListKey: 'children',
      };

      const { result } = renderHook(() => useEntityDetail(config));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newChild = { id: 3, name: 'Child 3' };

      act(() => {
        result.current.addToNested(newChild);
      });

      expect(result.current.entity?.children).toHaveLength(3);
      expect(result.current.entity?.children[2]).toEqual(newChild);
    });

    it('should remove item from nested list', async () => {
      mockFetchFunction.mockResolvedValue({ data: entityWithNested });

      const config: EntityDetailConfig<any, any> = {
        entityId: 1,
        fetchFunction: mockFetchFunction,
        nestedListKey: 'children',
      };

      const { result } = renderHook(() => useEntityDetail(config));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.removeFromNested(1);
      });

      expect(result.current.entity?.children).toHaveLength(1);
      expect(result.current.entity?.children[0].id).toBe(2);
    });

    it('should update item in nested list', async () => {
      mockFetchFunction.mockResolvedValue({ data: entityWithNested });

      const config: EntityDetailConfig<any, any> = {
        entityId: 1,
        fetchFunction: mockFetchFunction,
        nestedListKey: 'children',
      };

      const { result } = renderHook(() => useEntityDetail(config));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.updateNested(1, { name: 'Updated Child 1' });
      });

      expect(result.current.entity?.children[0].name).toBe('Updated Child 1');
    });

    it('should handle nested operations without nestedListKey', async () => {
      mockFetchFunction.mockResolvedValue({ data: { id: 1, name: 'Test' } });

      const config: EntityDetailConfig<any, any> = {
        entityId: 1,
        fetchFunction: mockFetchFunction,
      };

      const { result } = renderHook(() => useEntityDetail(config));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // These operations should not throw errors
      act(() => {
        result.current.addToNested({ id: 1 });
        result.current.removeFromNested(1);
        result.current.updateNested(1, {});
      });

      // Entity should remain unchanged
      expect(result.current.entity).toEqual({ id: 1, name: 'Test' });
    });
  });

  describe('EntityId changes', () => {
    it('should refetch when entityId changes', async () => {
      mockFetchFunction
        .mockResolvedValueOnce({ data: { id: 1, name: 'Entity 1' } })
        .mockResolvedValueOnce({ data: { id: 2, name: 'Entity 2' } });

      const config1: EntityDetailConfig<any, any> = {
        entityId: 1,
        fetchFunction: mockFetchFunction,
      };

      const { result, rerender } = renderHook(
        ({ config }) => useEntityDetail(config),
        { initialProps: { config: config1 } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.entity?.id).toBe(1);

      // Change entityId
      const config2: EntityDetailConfig<any, any> = {
        entityId: 2,
        fetchFunction: mockFetchFunction,
      };

      rerender({ config: config2 });

      await waitFor(() => {
        expect(result.current.entity?.id).toBe(2);
      });

      expect(mockFetchFunction).toHaveBeenCalledTimes(2);
    });
  });
});
