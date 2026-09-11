import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing value changes
 *
 * Features:
 * - Delays value updates until user stops changing value
 * - Prevents excessive API calls during typing
 * - Configurable delay
 * - Automatic cleanup on unmount
 *
 * @template T - The type of value being debounced
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * function SearchBox() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
 *
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // This will only run 500ms after user stops typing
 *       searchService.buscar(debouncedSearchTerm)
 *         .then(results => setResults(results));
 *     }
 *   }, [debouncedSearchTerm]);
 *
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Buscar..."
 *     />
 *   );
 * }
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout to update debounced value
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear timeout if value changes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}
