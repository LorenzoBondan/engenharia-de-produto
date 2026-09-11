import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDropdownData } from './useDropdownData';
import { DropdownSource } from '../types';

describe('useDropdownData', () => {
  const mockFetchColors = vi.fn();
  const mockFetchModels = vi.fn();
  const mockFetchUsers = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    mockFetchColors.mockResolvedValue({ data: [] });

    const sources: DropdownSource<any>[] = [
      { key: 'colors', fetchFunction: mockFetchColors },
    ];

    const { result } = renderHook(() => useDropdownData(sources));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual({});
    expect(result.current.error).toBeNull();
  });

  it('should fetch data from single source', async () => {
    const colorsData = [
      { id: 1, name: 'Red' },
      { id: 2, name: 'Blue' },
    ];

    mockFetchColors.mockResolvedValue({ data: colorsData });

    const sources: DropdownSource<any>[] = [
      { key: 'colors', fetchFunction: mockFetchColors },
    ];

    const { result } = renderHook(() => useDropdownData(sources));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchColors).toHaveBeenCalledTimes(1);
    expect(result.current.data.colors).toEqual(colorsData);
    expect(result.current.error).toBeNull();
  });

  it('should fetch data from multiple sources in parallel', async () => {
    const colorsData = [{ id: 1, name: 'Red' }];
    const modelsData = [{ id: 1, name: 'Model A' }];
    const usersData = [{ id: 1, name: 'John' }];

    mockFetchColors.mockResolvedValue({ data: colorsData });
    mockFetchModels.mockResolvedValue({ data: modelsData });
    mockFetchUsers.mockResolvedValue({ data: usersData });

    const sources: DropdownSource<any>[] = [
      { key: 'colors', fetchFunction: mockFetchColors },
      { key: 'models', fetchFunction: mockFetchModels },
      { key: 'users', fetchFunction: mockFetchUsers },
    ];

    const { result } = renderHook(() => useDropdownData(sources));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchColors).toHaveBeenCalledTimes(1);
    expect(mockFetchModels).toHaveBeenCalledTimes(1);
    expect(mockFetchUsers).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual({
      colors: colorsData,
      models: modelsData,
      users: usersData,
    });
  });

  it('should apply optional transform function to data', async () => {
    const rawData = [
      { id: 1, nome: 'Red', cor: '#FF0000' },
      { id: 2, nome: 'Blue', cor: '#0000FF' },
    ];

    mockFetchColors.mockResolvedValue({ data: rawData });

    const transform = (data: any[]) =>
      data.map((item) => ({ value: item.id, label: item.nome }));

    const sources: DropdownSource<any>[] = [
      { key: 'colors', fetchFunction: mockFetchColors, transform },
    ];

    const { result } = renderHook(() => useDropdownData(sources));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data.colors).toEqual([
      { value: 1, label: 'Red' },
      { value: 2, label: 'Blue' },
    ]);
  });

  it('should handle single source failure', async () => {
    const colorsData = [{ id: 1, name: 'Red' }];

    mockFetchColors.mockResolvedValue({ data: colorsData });
    mockFetchModels.mockRejectedValue(new Error('Network error'));

    const sources: DropdownSource<any>[] = [
      { key: 'colors', fetchFunction: mockFetchColors },
      { key: 'models', fetchFunction: mockFetchModels },
    ];

    const { result } = renderHook(() => useDropdownData(sources));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toContain('models');
    expect(result.current.data.colors).toEqual(colorsData);
    expect(result.current.data.models).toBeUndefined();
  });

  it('should handle multiple source failures', async () => {
    mockFetchColors.mockRejectedValue(new Error('Error 1'));
    mockFetchModels.mockRejectedValue(new Error('Error 2'));

    const sources: DropdownSource<any>[] = [
      { key: 'colors', fetchFunction: mockFetchColors },
      { key: 'models', fetchFunction: mockFetchModels },
    ];

    const { result } = renderHook(() => useDropdownData(sources));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toContain('colors');
    expect(result.current.error).toContain('models');
  });

  it('should handle empty sources array', async () => {
    const { result } = renderHook(() => useDropdownData([]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({});
    expect(result.current.error).toBeNull();
  });

  it('should refetch data when sources change', async () => {
    mockFetchColors.mockResolvedValue({ data: [{ id: 1, name: 'Red' }] });

    const sources1: DropdownSource<any>[] = [
      { key: 'colors', fetchFunction: mockFetchColors },
    ];

    const { result, rerender } = renderHook(
      ({ sources }) => useDropdownData(sources),
      { initialProps: { sources: sources1 } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetchColors).toHaveBeenCalledTimes(1);

    // Change sources
    mockFetchModels.mockResolvedValue({ data: [{ id: 1, name: 'Model A' }] });
    const sources2: DropdownSource<any>[] = [
      { key: 'models', fetchFunction: mockFetchModels },
    ];

    rerender({ sources: sources2 });

    await waitFor(() => {
      expect(mockFetchModels).toHaveBeenCalledTimes(1);
    });

    expect(result.current.data.models).toBeDefined();
  });
});
