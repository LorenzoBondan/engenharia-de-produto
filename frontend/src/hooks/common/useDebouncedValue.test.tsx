import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by 499ms
    act(() => {
      vi.advanceTimersByTime(499);
    });

    // Value should still be old
    expect(result.current).toBe('initial');

    // Fast-forward time by 1ms (total 500ms)
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Value should now be updated
    expect(result.current).toBe('updated');
  });

  it('should reset timer on value change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // First update
    rerender({ value: 'first', delay: 500 });

    // Wait 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Second update (should reset timer)
    rerender({ value: 'second', delay: 500 });

    // Wait 300ms (total 600ms from first update)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should still be initial (timer was reset)
    expect(result.current).toBe('initial');

    // Wait 200ms more (total 500ms from second update)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Now value should be second
    expect(result.current).toBe('second');
  });

  it('should work with different data types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 123, delay: 500 } }
    );

    expect(result.current).toBe(123);

    rerender({ value: 456, delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(456);
  });

  it('should work with objects', () => {
    const obj1 = { name: 'John', age: 30 };
    const obj2 = { name: 'Jane', age: 25 };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: obj1, delay: 500 } }
    );

    expect(result.current).toEqual(obj1);

    rerender({ value: obj2, delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toEqual(obj2);
  });

  it('should use default delay of 500ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('updated');
  });

  it('should cleanup timer on unmount', () => {
    const { unmount } = renderHook(() => useDebouncedValue('test', 500));

    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should handle rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'v0', delay: 500 } }
    );

    // Rapid changes
    rerender({ value: 'v1', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'v2', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'v3', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Still showing initial value
    expect(result.current).toBe('v0');

    // Wait for full delay from last change
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should show last value
    expect(result.current).toBe('v3');
  });
});
