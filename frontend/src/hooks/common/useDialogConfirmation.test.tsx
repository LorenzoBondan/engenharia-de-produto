import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDialogConfirmation } from './useDialogConfirmation';

describe('useDialogConfirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with dialog closed', () => {
    const { result } = renderHook(() => useDialogConfirmation());

    expect(result.current.isOpen).toBe(false);
  });

  it('should open dialog with pending action', () => {
    const mockAction = vi.fn();
    const { result } = renderHook(() => useDialogConfirmation());

    act(() => {
      result.current.openDialog(mockAction);
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should close dialog and clear pending action', () => {
    const mockAction = vi.fn();
    const { result } = renderHook(() => useDialogConfirmation());

    act(() => {
      result.current.openDialog(mockAction);
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeDialog();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should handle confirmation errors', async () => {
    const mockAction = vi.fn().mockRejectedValue(new Error('Action failed'));
    const { result } = renderHook(() => useDialogConfirmation());

    act(() => {
      result.current.openDialog(mockAction);
    });

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(result.current.isOpen).toBe(true); // Dialog remains open on error
    expect(result.current.error).toBeTruthy();
  });

  it('should handle confirmation with no pending action', async () => {
    const { result } = renderHook(() => useDialogConfirmation());

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should show loading state during confirmation', async () => {
    const mockAction = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const { result } = renderHook(() => useDialogConfirmation());

    act(() => {
      result.current.openDialog(mockAction);
    });

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
  });

  it('should clear error when opening new dialog', async () => {
    const mockAction1 = vi.fn().mockRejectedValue(new Error('Error 1'));
    const mockAction2 = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useDialogConfirmation());

    // First action with error
    act(() => {
      result.current.openDialog(mockAction1);
    });

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(result.current.error).toBeTruthy();

    // Open new dialog should clear error
    act(() => {
      result.current.openDialog(mockAction2);
    });

    expect(result.current.error).toBeNull();
  });

  it('should handle action with custom parameters', async () => {
    const mockAction = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useDialogConfirmation());

    const customAction = () => mockAction(1, 2, 3);

    act(() => {
      result.current.openDialog(customAction);
    });

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(mockAction).toHaveBeenCalledWith(1, 2, 3);
    expect(result.current.isOpen).toBe(false);
  });

  it('should handle backend error with custom message', async () => {
    const mockAction = vi.fn().mockRejectedValue({
      response: {
        data: {
          error: 'Cannot delete item with dependencies',
        },
      },
    });
    const { result } = renderHook(() => useDialogConfirmation());

    act(() => {
      result.current.openDialog(mockAction);
    });

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(result.current.error).toBe('Cannot delete item with dependencies');
    expect(result.current.isOpen).toBe(true);
  });
});
