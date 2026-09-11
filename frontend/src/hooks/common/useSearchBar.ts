import { useState, useCallback } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

/**
 * Custom hook for SearchBar component management
 * Wraps useDebouncedValue for search input with debouncing
 * Provides search callback after delay
 */
export function useSearchBar(onSearch: Function, delay: number = 500) {
  const [text, setText] = useState('');
  const debouncedText = useDebouncedValue(text, delay);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  }, []);

  const handleResetClick = useCallback(() => {
    setText('');
    onSearch('');
  }, [onSearch]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onSearch(text);
    },
    [text, onSearch]
  );

  return {
    text,
    setText,
    handleChange,
    handleResetClick,
    handleSubmit,
    debouncedText,
  };
}
