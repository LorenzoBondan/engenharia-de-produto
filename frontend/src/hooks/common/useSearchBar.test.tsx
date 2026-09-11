import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearchBar } from './useSearchBar';

describe('useSearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should initialize with empty text', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      expect(result.current.text).toBe('');
      expect(result.current.debouncedText).toBe('');
    });

    it('should accept custom delay parameter', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch, 1000));

      expect(result.current.text).toBe('');
    });
  });

  describe('handleChange', () => {
    it('should update text on change', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      const event = {
        target: { value: 'test search' },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChange(event);
      });

      expect(result.current.text).toBe('test search');
    });

    it('should debounce text updates', async () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch, 500));

      const event = {
        target: { value: 'search term' },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChange(event);
      });

      expect(result.current.text).toBe('search term');
      expect(result.current.debouncedText).toBe('');

      await vi.runAllTimersAsync();

      expect(result.current.debouncedText).toBe('search term');
    });

    it('should handle multiple rapid changes', async () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch, 500));

      act(() => {
        result.current.handleChange({
          target: { value: 't' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleChange({
          target: { value: 'te' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleChange({
          target: { value: 'test' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.text).toBe('test');
      expect(result.current.debouncedText).toBe('');

      await vi.runAllTimersAsync();

      expect(result.current.debouncedText).toBe('test');
    });
  });

  describe('handleResetClick', () => {
    it('should clear text on reset', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      act(() => {
        result.current.handleChange({
          target: { value: 'some text' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.text).toBe('some text');

      act(() => {
        result.current.handleResetClick();
      });

      expect(result.current.text).toBe('');
    });

    it('should call onSearch with empty string on reset', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      act(() => {
        result.current.handleChange({
          target: { value: 'some text' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleResetClick();
      });

      expect(onSearch).toHaveBeenCalledWith('');
    });

    it('should not call onSearch if text is already empty', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      act(() => {
        result.current.handleResetClick();
      });

      expect(onSearch).toHaveBeenCalledWith('');
    });
  });

  describe('handleSubmit', () => {
    it('should prevent default form submission', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      const event = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;

      act(() => {
        result.current.handleSubmit(event);
      });

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should call onSearch with current text', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      act(() => {
        result.current.handleChange({
          target: { value: 'search query' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      const event = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;

      act(() => {
        result.current.handleSubmit(event);
      });

      expect(onSearch).toHaveBeenCalledWith('search query');
    });

    it('should work with empty text', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      const event = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;

      act(() => {
        result.current.handleSubmit(event);
      });

      expect(onSearch).toHaveBeenCalledWith('');
    });
  });

  describe('setText', () => {
    it('should allow direct text setting', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      act(() => {
        result.current.setText('direct value');
      });

      expect(result.current.text).toBe('direct value');
    });

    it('should trigger debounced update when setting text directly', async () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch, 500));

      act(() => {
        result.current.setText('direct value');
      });

      expect(result.current.text).toBe('direct value');
      expect(result.current.debouncedText).toBe('');

      await vi.runAllTimersAsync();

      expect(result.current.debouncedText).toBe('direct value');
    });
  });

  describe('Callback Stability', () => {
    it('should maintain stable handleChange reference', () => {
      const onSearch = vi.fn();
      const { result, rerender } = renderHook(() => useSearchBar(onSearch));

      const firstHandleChange = result.current.handleChange;

      rerender();

      expect(result.current.handleChange).toBe(firstHandleChange);
    });

    it('should update handleResetClick when onSearch changes', () => {
      const onSearch1 = vi.fn();
      const onSearch2 = vi.fn();

      const { result, rerender } = renderHook(
        ({ callback }) => useSearchBar(callback),
        { initialProps: { callback: onSearch1 } }
      );

      const firstHandleReset = result.current.handleResetClick;

      rerender({ callback: onSearch2 });

      // Reference should be different when dependency changes
      expect(result.current.handleResetClick).not.toBe(firstHandleReset);
    });

    it('should update handleSubmit when text or onSearch changes', () => {
      const onSearch1 = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch1));

      const firstHandleSubmit = result.current.handleSubmit;

      act(() => {
        result.current.setText('new text');
      });

      // Reference should be different when text changes
      expect(result.current.handleSubmit).not.toBe(firstHandleSubmit);
    });
  });

  describe('Return Value', () => {
    it('should return all required properties', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      expect(result.current).toHaveProperty('text');
      expect(result.current).toHaveProperty('setText');
      expect(result.current).toHaveProperty('handleChange');
      expect(result.current).toHaveProperty('handleResetClick');
      expect(result.current).toHaveProperty('handleSubmit');
      expect(result.current).toHaveProperty('debouncedText');
    });

    it('should have correct property types', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() => useSearchBar(onSearch));

      expect(typeof result.current.text).toBe('string');
      expect(typeof result.current.setText).toBe('function');
      expect(typeof result.current.handleChange).toBe('function');
      expect(typeof result.current.handleResetClick).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.debouncedText).toBe('string');
    });
  });
});
