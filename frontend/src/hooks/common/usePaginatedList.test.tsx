import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePaginatedList } from './usePaginatedList';
import { PaginatedListConfig } from '../types';

describe('usePaginatedList', () => {
  const mockFetchFunction = vi.fn();
  const mockDeleteFunction = vi.fn();
  const mockInactivateFunction = vi.fn();

  const defaultConfig: PaginatedListConfig<{ id: number; name: string }> = {
    fetchFunction: mockFetchFunction,
    searchColumn: 'name',
    pageSize: 8,
    sort: 'id;a',
    deleteFunction: mockDeleteFunction,
    inactivateFunction: mockInactivateFunction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty data and loading state', () => {
    mockFetchFunction.mockResolvedValue({
      data: { content: [], last: true },
    });

    const { result } = renderHook(() => usePaginatedList(defaultConfig));

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isLastPage).toBe(false);
  });

  it('should fetch initial data on mount', async () => {
    const mockData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    mockFetchFunction.mockResolvedValue({
      data: { content: mockData, last: false },
    });

    const { result } = renderHook(() => usePaginatedList(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchFunction).toHaveBeenCalledWith(
      'name',
      '=',
      '',
      0,
      8,
      'id;a'
    );
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLastPage).toBe(false);
  });

  it('should handle search and reset page to 0', async () => {
    mockFetchFunction.mockResolvedValue({
      data: { content: [], last: true },
    });

    const { result } = renderHook(() => usePaginatedList(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleSearch('test query');
    });

    await waitFor(() => {
      expect(mockFetchFunction).toHaveBeenCalledWith(
        'name',
        '=',
        'test query',
        0,
        8,
        'id;a'
      );
    });

    expect(result.current.data).toEqual([]);
  });

  it('should handle pagination and accumulate results', async () => {
    const page1Data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];
    const page2Data = [
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
    ];

    mockFetchFunction
      .mockResolvedValueOnce({ data: { content: page1Data, last: false } })
      .mockResolvedValueOnce({ data: { content: page2Data, last: true } });

    const { result } = renderHook(() => usePaginatedList(defaultConfig));

    await waitFor(() => {
      expect(result.current.data).toEqual(page1Data);
    });

    act(() => {
      result.current.handleNextPage();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([...page1Data, ...page2Data]);
    });

    expect(result.current.isLastPage).toBe(true);
  });

  it('should handle delete operation and refresh list', async () => {
    const initialData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    mockFetchFunction.mockResolvedValue({
      data: { content: initialData, last: true },
    });
    mockDeleteFunction.mockResolvedValue({});

    const { result } = renderHook(() => usePaginatedList(defaultConfig));

    await waitFor(() => {
      expect(result.current.data).toEqual(initialData);
    });

    await act(async () => {
      await result.current.handleDelete([1]);
    });

    expect(mockDeleteFunction).toHaveBeenCalledWith([1]);
    expect(mockFetchFunction).toHaveBeenCalledTimes(2); // Initial + refresh
  });

  it('should handle inactivate operation and refresh list', async () => {
    mockFetchFunction.mockResolvedValue({
      data: { content: [], last: true },
    });
    mockInactivateFunction.mockResolvedValue({});

    const { result } = renderHook(() => usePaginatedList(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleInactivate([1]);
    });

    expect(mockInactivateFunction).toHaveBeenCalledWith([1]);
    expect(mockFetchFunction).toHaveBeenCalledTimes(2);
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    mockFetchFunction.mockRejectedValue(error);

    const { result } = renderHook(() => usePaginatedList(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toEqual([]);
  });

  it('should handle delete errors without refreshing', async () => {
    mockFetchFunction.mockResolvedValue({
      data: { content: [], last: true },
    });
    mockDeleteFunction.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => usePaginatedList(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleDelete([1]);
    });

    expect(result.current.error).toBeTruthy();
    expect(mockFetchFunction).toHaveBeenCalledTimes(1); // Only initial call
  });

  it('should allow manual refresh', async () => {
    mockFetchFunction.mockResolvedValue({
      data: { content: [], last: true },
    });

    const { result } = renderHook(() => usePaginatedList(defaultConfig));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(mockFetchFunction).toHaveBeenCalledTimes(2);
    });
  });
});
