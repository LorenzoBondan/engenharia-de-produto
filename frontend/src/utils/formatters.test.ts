import { describe, it, expect } from 'vitest';
import { formatDate, formatLocalDateTime } from './formatters';

describe('Formatters Utility', () => {
  describe('formatDate', () => {
    it('should format valid date string in yyyy-MM-dd format', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024');
      expect(formatDate('2023-12-25')).toBe('25/12/2023');
      expect(formatDate('2024-06-30')).toBe('30/06/2024');
    });

    it('should throw error for invalid format strings', () => {
      expect(() => formatDate('invalid')).toThrow("Invalid date format, use 'yyyy-MM-dd'.");
      expect(() => formatDate('2024/01/15')).toThrow("Invalid date format, use 'yyyy-MM-dd'.");
      expect(() => formatDate('15-01-2024')).toThrow("Invalid date format, use 'yyyy-MM-dd'.");
      expect(() => formatDate('2024-1-15')).toThrow("Invalid date format, use 'yyyy-MM-dd'.");
      expect(() => formatDate('2024-01-5')).toThrow("Invalid date format, use 'yyyy-MM-dd'.");
    });

    it('should handle edge cases like year boundaries', () => {
      expect(formatDate('2024-12-31')).toBe('31/12/2024');
      expect(formatDate('2024-01-01')).toBe('01/01/2024');
      expect(formatDate('2023-12-31')).toBe('31/12/2023');
    });

    it('should handle leap year dates', () => {
      expect(formatDate('2024-02-29')).toBe('29/02/2024');
      expect(formatDate('2020-02-29')).toBe('29/02/2020');
    });

    it('should handle different months correctly', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024');
      expect(formatDate('2024-06-15')).toBe('15/06/2024');
      expect(formatDate('2024-12-15')).toBe('15/12/2024');
    });

    it('should throw error for empty string', () => {
      expect(() => formatDate('')).toThrow("Invalid date format, use 'yyyy-MM-dd'.");
    });

    it('should throw error for incomplete date', () => {
      expect(() => formatDate('2024-01')).toThrow("Invalid date format, use 'yyyy-MM-dd'.");
      expect(() => formatDate('2024')).toThrow("Invalid date format, use 'yyyy-MM-dd'.");
    });
  });

  describe('formatLocalDateTime', () => {
    it('should format valid ISO datetime string', () => {
      expect(formatLocalDateTime('2024-01-15T10:30:45')).toBe('15/01/2024 - 10:30');
      expect(formatLocalDateTime('2023-12-25T23:59:59')).toBe('25/12/2023 - 23:59');
      expect(formatLocalDateTime('2024-06-30T00:00:00')).toBe('30/06/2024 - 00:00');
    });

    it('should throw error for invalid format', () => {
      expect(() => formatLocalDateTime('invalid')).toThrow(
        "Invalid date format, expected 'yyyy-MM-ddTHH:mm:ss'."
      );
      expect(() => formatLocalDateTime('2024-01-15')).toThrow(
        "Invalid date format, expected 'yyyy-MM-ddTHH:mm:ss'."
      );
      expect(() => formatLocalDateTime('2024-01-15 10:30:45')).toThrow(
        "Invalid date format, expected 'yyyy-MM-ddTHH:mm:ss'."
      );
    });

    it('should extract and format date and time correctly', () => {
      const result = formatLocalDateTime('2024-03-20T14:25:30');

      expect(result).toContain('20/03/2024');
      expect(result).toContain('14:25');
      expect(result).toBe('20/03/2024 - 14:25');
    });

    it('should handle midnight time', () => {
      expect(formatLocalDateTime('2024-01-01T00:00:00')).toBe('01/01/2024 - 00:00');
    });

    it('should handle noon time', () => {
      expect(formatLocalDateTime('2024-06-15T12:00:00')).toBe('15/06/2024 - 12:00');
    });

    it('should handle end of day time', () => {
      expect(formatLocalDateTime('2024-12-31T23:59:59')).toBe('31/12/2024 - 23:59');
    });

    it('should work with datetime containing milliseconds', () => {
      expect(formatLocalDateTime('2024-01-15T10:30:45.123')).toBe('15/01/2024 - 10:30');
    });

    it('should throw error for empty string', () => {
      expect(() => formatLocalDateTime('')).toThrow(
        "Invalid date format, expected 'yyyy-MM-ddTHH:mm:ss'."
      );
    });

    it('should throw error for incomplete datetime', () => {
      expect(() => formatLocalDateTime('2024-01-15T10:30')).toThrow(
        "Invalid date format, expected 'yyyy-MM-ddTHH:mm:ss'."
      );
      expect(() => formatLocalDateTime('2024-01-15T10')).toThrow(
        "Invalid date format, expected 'yyyy-MM-ddTHH:mm:ss'."
      );
    });
  });
});
