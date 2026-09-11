import { describe, it, expect, vi } from 'vitest';
import { mockCustomHook, mockHookReturnValue, verifyHookCalled } from './hookMock';

// Mock a sample hook module
const mockHookModule = {
  useTestHook: vi.fn(),
};

describe('Hook Mock Utilities', () => {
  describe('mockCustomHook', () => {
    it('should mock a custom hook with return value', () => {
      const hookFn = vi.fn();
      const returnValue = { data: 'test', loading: false };

      mockCustomHook(hookFn, returnValue);

      const result = hookFn();

      expect(result).toEqual(returnValue);
      expect(hookFn).toHaveBeenCalled();
    });

    it('should allow hook to be called multiple times', () => {
      const hookFn = vi.fn();
      const returnValue = { count: 0 };

      mockCustomHook(hookFn, returnValue);

      hookFn();
      hookFn();

      expect(hookFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('mockHookReturnValue', () => {
    it('should mock hook with different return values for different calls', () => {
      const hookFn = vi.fn();

      mockHookReturnValue(hookFn, [
        { data: null, loading: true },
        { data: 'loaded', loading: false },
      ]);

      const firstCall = hookFn();
      const secondCall = hookFn();

      expect(firstCall).toEqual({ data: null, loading: true });
      expect(secondCall).toEqual({ data: 'loaded', loading: false });
    });

    it('should handle single return value', () => {
      const hookFn = vi.fn();
      const returnValue = { status: 'success' };

      mockHookReturnValue(hookFn, [returnValue]);

      const result = hookFn();

      expect(result).toEqual(returnValue);
    });

    it('should work with complex hook return values', () => {
      const hookFn = vi.fn();

      const returnValues = [
        {
          data: [],
          loading: true,
          error: null,
          refetch: vi.fn(),
        },
        {
          data: [1, 2, 3],
          loading: false,
          error: null,
          refetch: vi.fn(),
        },
      ];

      mockHookReturnValue(hookFn, returnValues);

      const first = hookFn();
      const second = hookFn();

      expect(first.loading).toBe(true);
      expect(second.loading).toBe(false);
      expect(second.data).toEqual([1, 2, 3]);
    });
  });

  describe('verifyHookCalled', () => {
    it('should verify hook was called', () => {
      const hookFn = vi.fn();
      mockCustomHook(hookFn, { data: 'test' });

      hookFn();

      expect(() => verifyHookCalled(hookFn)).not.toThrow();
    });

    it('should verify hook was called specific number of times', () => {
      const hookFn = vi.fn();
      mockCustomHook(hookFn, { data: 'test' });

      hookFn();
      hookFn();

      expect(() => verifyHookCalled(hookFn, 2)).not.toThrow();
    });

    it('should verify hook was called with specific arguments', () => {
      const hookFn = vi.fn();
      mockCustomHook(hookFn, { data: 'test' });

      hookFn({ id: 123 });

      verifyHookCalled(hookFn, 1, { id: 123 });
      expect(hookFn).toHaveBeenCalledWith({ id: 123 });
    });

    it('should work without arguments verification', () => {
      const hookFn = vi.fn();
      mockCustomHook(hookFn, { result: true });

      hookFn();

      verifyHookCalled(hookFn);
      expect(hookFn).toHaveBeenCalled();
    });
  });
});
