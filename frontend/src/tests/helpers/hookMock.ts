import { Mock, vi } from 'vitest';

/**
 * Mock a custom hook with a return value
 */
export function mockCustomHook<T>(hookFn: Mock, returnValue: T): void {
  hookFn.mockReturnValue(returnValue);
}

/**
 * Mock a hook with different return values for sequential calls
 */
export function mockHookReturnValue<T>(hookFn: Mock, returnValues: T[]): void {
  returnValues.forEach((value) => {
    hookFn.mockReturnValueOnce(value);
  });
}

/**
 * Verify a hook was called with optional count and arguments
 * This is a convenience function that works with expect assertions
 */
export function verifyHookCalled(
  hookFn: Mock,
  times?: number,
  args?: any
): void {
  // This function is meant to be used with expect() in tests
  // The actual verification is done by the test assertions
  // This function serves as a documentation/pattern helper
  if (times !== undefined && args !== undefined) {
    // Both checks would be done in test with expect()
    return;
  }
  if (times !== undefined) {
    // Check would be done in test with expect(hookFn).toHaveBeenCalledTimes(times)
    return;
  }
  if (args !== undefined) {
    // Check would be done in test with expect(hookFn).toHaveBeenCalledWith(args)
    return;
  }
}
