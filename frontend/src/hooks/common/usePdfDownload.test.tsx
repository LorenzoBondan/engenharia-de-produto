import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePdfDownload } from './usePdfDownload';

describe('usePdfDownload', () => {
  const mockGenerateFunction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it('should initialize with idle state', () => {
    const { result } = renderHook(() =>
      usePdfDownload(mockGenerateFunction, 'test-document')
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should download PDF successfully', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    mockGenerateFunction.mockResolvedValue({ data: mockBlob });

    const { result } = renderHook(() =>
      usePdfDownload(mockGenerateFunction, 'test-report')
    );

    await act(async () => {
      await result.current.download();
    });

    expect(mockGenerateFunction).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle download errors', async () => {
    mockGenerateFunction.mockRejectedValue(new Error('Generation failed'));

    const { result } = renderHook(() =>
      usePdfDownload(mockGenerateFunction, 'test-report')
    );

    await act(async () => {
      await result.current.download();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it('should pass parameters to generate function', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    mockGenerateFunction.mockResolvedValue({ data: mockBlob });

    const { result } = renderHook(() =>
      usePdfDownload(mockGenerateFunction, 'report')
    );

    await act(async () => {
      await result.current.download(1, 2, 3);
    });

    expect(mockGenerateFunction).toHaveBeenCalledWith(1, 2, 3);
  });

  it('should show loading state during download', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    mockGenerateFunction.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: mockBlob }), 100))
    );

    const { result } = renderHook(() =>
      usePdfDownload(mockGenerateFunction, 'report')
    );

    act(() => {
      result.current.download();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.loading).toBe(false);
  });

  it('should call generate function and complete successfully', async () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    mockGenerateFunction.mockResolvedValue({ data: mockBlob });

    const { result } = renderHook(() =>
      usePdfDownload(mockGenerateFunction, 'my-custom-report')
    );

    await act(async () => {
      await result.current.download();
    });

    expect(mockGenerateFunction).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
