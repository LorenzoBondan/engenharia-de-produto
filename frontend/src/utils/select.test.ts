import { describe, it, expect } from 'vitest';
import { selectStyles } from './select';

describe('Select Utility', () => {
  describe('selectStyles', () => {
    it('should have control style configuration', () => {
      expect(selectStyles.control).toBeDefined();
      expect(typeof selectStyles.control).toBe('function');
    });

    it('should configure control with minimum height', () => {
      const provided = {};
      const result = selectStyles.control(provided);

      expect(result.minHeight).toBe('40px');
    });

    it('should remove border from control', () => {
      const provided = {};
      const result = selectStyles.control(provided);

      expect(result.border).toBe('none');
      expect(result.boxShadow).toBe('none');
    });

    it('should preserve provided control styles', () => {
      const provided = { backgroundColor: 'white', padding: '10px' };
      const result = selectStyles.control(provided);

      expect(result.backgroundColor).toBe('white');
      expect(result.padding).toBe('10px');
    });

    it('should configure hover state for control', () => {
      const provided = {};
      const result = selectStyles.control(provided);

      expect(result['&:hover']).toEqual({ border: 'none' });
    });

    it('should have placeholder style configuration', () => {
      expect(selectStyles.placeholder).toBeDefined();
      expect(typeof selectStyles.placeholder).toBe('function');
    });

    it('should set placeholder color', () => {
      const provided = {};
      const result = selectStyles.placeholder(provided);

      expect(result.color).toBe('var(--color-font-placeholder)');
    });

    it('should preserve provided placeholder styles', () => {
      const provided = { fontSize: '14px', fontWeight: 'normal' };
      const result = selectStyles.placeholder(provided);

      expect(result.fontSize).toBe('14px');
      expect(result.fontWeight).toBe('normal');
      expect(result.color).toBe('var(--color-font-placeholder)');
    });

    it('should have option style configuration', () => {
      expect(selectStyles.option).toBeDefined();
      expect(typeof selectStyles.option).toBe('function');
    });

    it('should set option color', () => {
      const provided = {};
      const result = selectStyles.option(provided);

      expect(result.color).toBe('var(--color-font-primary)');
    });

    it('should preserve provided option styles', () => {
      const provided = { padding: '8px', cursor: 'pointer' };
      const result = selectStyles.option(provided);

      expect(result.padding).toBe('8px');
      expect(result.cursor).toBe('pointer');
      expect(result.color).toBe('var(--color-font-primary)');
    });

    it('should have indicatorSeparator style configuration', () => {
      expect(selectStyles.indicatorSeparator).toBeDefined();
      expect(typeof selectStyles.indicatorSeparator).toBe('function');
    });

    it('should hide indicator separator', () => {
      const provided = {};
      const result = selectStyles.indicatorSeparator(provided);

      expect(result.display).toBe('none');
    });

    it('should preserve provided indicator separator styles', () => {
      const provided = { width: '1px', backgroundColor: 'gray' };
      const result = selectStyles.indicatorSeparator(provided);

      expect(result.width).toBe('1px');
      expect(result.backgroundColor).toBe('gray');
      expect(result.display).toBe('none');
    });

    it('should handle empty provided object for all styles', () => {
      const emptyProvided = {};

      expect(() => selectStyles.control(emptyProvided)).not.toThrow();
      expect(() => selectStyles.placeholder(emptyProvided)).not.toThrow();
      expect(() => selectStyles.option(emptyProvided)).not.toThrow();
      expect(() => selectStyles.indicatorSeparator(emptyProvided)).not.toThrow();
    });

    it('should handle null provided values gracefully', () => {
      const control = selectStyles.control(null);
      expect(control).toBeDefined();
      expect(control.minHeight).toBe('40px');
    });

    it('should merge styles correctly using spread operator', () => {
      const provided = {
        existingProp: 'value',
        minHeight: '30px' // This should be overridden
      };

      const result = selectStyles.control(provided);

      expect(result.existingProp).toBe('value');
      expect(result.minHeight).toBe('40px'); // Should override provided value
    });
  });
});
