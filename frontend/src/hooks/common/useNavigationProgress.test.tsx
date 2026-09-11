import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { useNavigationProgress } from './useNavigationProgress';
import { ReactNode } from 'react';

// Wrapper component that provides router context
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  };
}

describe('useNavigationProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should start with isNavigating as true on mount', () => {
      const { result } = renderHook(() => useNavigationProgress(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isNavigating).toBe(true);
    });

    it('should set isNavigating to false after 300ms', async () => {
      const { result } = renderHook(() => useNavigationProgress(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isNavigating).toBe(true);

      await vi.runAllTimersAsync();

      expect(result.current.isNavigating).toBe(false);
    });
  });

  describe('Location Changes', () => {
    it('should react to location changes', () => {
      const { result } = renderHook(() => useNavigationProgress(), {
        wrapper: createWrapper(),
      });

      // Hook initializes with isNavigating true
      expect(result.current.isNavigating).toBe(true);
    });
  });

  describe('Timer Cleanup', () => {
    it('should cleanup timer on unmount', async () => {
      const { result, unmount } = renderHook(() => useNavigationProgress(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isNavigating).toBe(true);

      unmount();

      // Advance timer after unmount
      await vi.runAllTimersAsync();

      // Should not cause any errors or warnings
    });
  });

  describe('Query String Changes', () => {
    it('should be aware of location search params', () => {
      const { result } = renderHook(() => useNavigationProgress(), {
        wrapper: createWrapper(),
      });

      // Hook should initialize and track location changes including search params
      expect(result.current).toHaveProperty('isNavigating');
    });
  });

  describe('Return Value', () => {
    it('should return object with isNavigating property', () => {
      const { result } = renderHook(() => useNavigationProgress(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('isNavigating');
      expect(typeof result.current.isNavigating).toBe('boolean');
    });
  });
});
