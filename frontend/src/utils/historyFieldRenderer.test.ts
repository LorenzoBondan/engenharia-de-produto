import { describe, it, expect } from 'vitest';
import { renderFieldValue, SITUACAO_LABELS, TIPO_MATERIAL_LABELS } from './historyFieldRenderer';

describe('renderFieldValue', () => {
  describe('string fields', () => {
    it('should render string values directly', () => {
      const result = renderFieldValue('Simple text');
      expect(result).toBe('Simple text');
    });

    it('should render empty string', () => {
      const result = renderFieldValue('');
      expect(result).toBe('');
    });
  });

  describe('number fields', () => {
    it('should render integer numbers', () => {
      const result = renderFieldValue(123);
      expect(result).toBe('123');
    });

    it('should render decimal numbers with formatting', () => {
      const result = renderFieldValue(123.45);
      expect(result).toBe('123.45');
    });

    it('should render zero', () => {
      const result = renderFieldValue(0);
      expect(result).toBe('0');
    });

    it('should render negative numbers', () => {
      const result = renderFieldValue(-50);
      expect(result).toBe('-50');
    });
  });

  describe('boolean fields', () => {
    it('should render true as "Sim"', () => {
      const result = renderFieldValue(true);
      expect(result).toBe('Sim');
    });

    it('should render false as "Não"', () => {
      const result = renderFieldValue(false);
      expect(result).toBe('Não');
    });
  });

  describe('date fields', () => {
    it('should format ISO 8601 datetime strings', () => {
      const result = renderFieldValue('2025-07-29T19:47:47.028828');
      expect(result).toBe('29/07/2025 - 19:47');
    });

    it('should format ISO 8601 date-only strings', () => {
      const result = renderFieldValue('2024-01-01');
      expect(result).toBe('01/01/2024');
    });

    it('should handle dates with seconds', () => {
      const result = renderFieldValue('2025-03-03T08:37:44');
      expect(result).toBe('03/03/2025 - 08:37');
    });

    it('should handle dates with milliseconds', () => {
      const result = renderFieldValue('2025-07-29T19:47:47.172976');
      expect(result).toBe('29/07/2025 - 19:47');
    });
  });

  describe('null and undefined fields', () => {
    it('should render null as "N/A"', () => {
      const result = renderFieldValue(null);
      expect(result).toBe('N/A');
    });

    it('should render undefined as "N/A"', () => {
      const result = renderFieldValue(undefined);
      expect(result).toBe('N/A');
    });
  });

  describe('nested object fields', () => {
    it('should render object with codigo and descricao', () => {
      const obj = { codigo: 1, descricao: 'Minerale', hexa: 'F12398' };
      const result = renderFieldValue(obj);
      expect(result).toContain('1');
      expect(result).toContain('Minerale');
    });

    it('should handle object with only codigo', () => {
      const obj = { codigo: 5, other: 'data' };
      const result = renderFieldValue(obj);
      expect(result).toContain('5');
    });

    it('should handle object with only descricao', () => {
      const obj = { descricao: 'Test Description', other: 'data' };
      const result = renderFieldValue(obj);
      expect(result).toContain('Test Description');
    });

    it('should handle empty object', () => {
      const result = renderFieldValue({});
      expect(result).toBe('[Object]');
    });

    it('should handle object without codigo or descricao', () => {
      const obj = { field1: 'value1', field2: 'value2' };
      const result = renderFieldValue(obj);
      expect(result).toBe('[Object]');
    });
  });

  describe('enum fields', () => {
    it('should convert SITUACAO enum values', () => {
      expect(renderFieldValue('ATIVO', 'situacao')).toBe('Ativo');
      expect(renderFieldValue('INATIVO', 'situacao')).toBe('Inativo');
      expect(renderFieldValue('LIXEIRA', 'situacao')).toBe('Lixeira');
    });

    it('should convert TIPO_MATERIAL enum values', () => {
      expect(renderFieldValue('CHAPA_MDP', 'tipoMaterial')).toBe('Chapa MDP');
      expect(renderFieldValue('CHAPA_MDF', 'tipoMaterial')).toBe('Chapa MDF');
      expect(renderFieldValue('FITA_BORDA', 'tipoMaterial')).toBe('Fita de Borda');
    });

    it('should fallback to raw value if enum not found', () => {
      expect(renderFieldValue('UNKNOWN_ENUM', 'situacao')).toBe('UNKNOWN_ENUM');
    });

    it('should not apply enum conversion when fieldName not provided', () => {
      expect(renderFieldValue('ATIVO')).toBe('ATIVO');
    });

    it('should not apply enum conversion for non-enum fields', () => {
      expect(renderFieldValue('ATIVO', 'descricao')).toBe('ATIVO');
    });
  });

  describe('array fields', () => {
    it('should render array with brackets and comma-separated values', () => {
      const result = renderFieldValue(['item1', 'item2', 'item3']);
      expect(result).toContain('item1');
      expect(result).toContain('item2');
      expect(result).toContain('item3');
    });

    it('should render empty array', () => {
      const result = renderFieldValue([]);
      expect(result).toBe('[]');
    });

    it('should render array with numbers', () => {
      const result = renderFieldValue([1, 2, 3]);
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const result = renderFieldValue(longString);
      expect(result).toBe(longString);
    });

    it('should handle special characters in strings', () => {
      const result = renderFieldValue('Text with "quotes" and \'apostrophes\'');
      expect(result).toBe('Text with "quotes" and \'apostrophes\'');
    });

    it('should handle numbers with many decimal places', () => {
      const result = renderFieldValue(123.456789);
      expect(result).toBe('123.456789');
    });
  });
});

describe('Enum Label Mappings', () => {
  describe('SITUACAO_LABELS', () => {
    it('should have correct Portuguese labels for all status values', () => {
      expect(SITUACAO_LABELS.ATIVO).toBe('Ativo');
      expect(SITUACAO_LABELS.INATIVO).toBe('Inativo');
      expect(SITUACAO_LABELS.LIXEIRA).toBe('Lixeira');
    });

    it('should be an object with string keys and values', () => {
      expect(typeof SITUACAO_LABELS).toBe('object');
      Object.values(SITUACAO_LABELS).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('TIPO_MATERIAL_LABELS', () => {
    it('should have correct Portuguese labels for material types', () => {
      expect(TIPO_MATERIAL_LABELS.CHAPA_MDP).toBe('Chapa MDP');
      expect(TIPO_MATERIAL_LABELS.CHAPA_MDF).toBe('Chapa MDF');
      expect(TIPO_MATERIAL_LABELS.FITA_BORDA).toBe('Fita de Borda');
      expect(TIPO_MATERIAL_LABELS.COLA).toBe('Cola');
      expect(TIPO_MATERIAL_LABELS.PINTURA).toBe('Pintura');
      expect(TIPO_MATERIAL_LABELS.POLIESTER).toBe('Poliéster');
      expect(TIPO_MATERIAL_LABELS.PLASTICO).toBe('Plástico');
      expect(TIPO_MATERIAL_LABELS.TNT).toBe('TNT');
      expect(TIPO_MATERIAL_LABELS.POLIETILENO).toBe('Polietileno');
      expect(TIPO_MATERIAL_LABELS.PINTURA_BORDA_FUNDO).toBe('Pintura Borda Fundo');
      expect(TIPO_MATERIAL_LABELS.BAGUETE).toBe('Baguete');
      expect(TIPO_MATERIAL_LABELS.CANTONEIRA).toBe('Cantoneira');
    });

    it('should be an object with string keys and values', () => {
      expect(typeof TIPO_MATERIAL_LABELS).toBe('object');
      Object.values(TIPO_MATERIAL_LABELS).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });
});
