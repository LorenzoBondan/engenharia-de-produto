import { describe, it, expect } from 'vitest';
import { calculateFieldDifferences } from './historyDiff';

describe('calculateFieldDifferences', () => {
  describe('primitive field changes', () => {
    it('should detect string field changes', () => {
      const current = { codigo: 1, descricao: 'Minerale CZ' };
      const previous = { codigo: 1, descricao: 'Minerale' };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0]).toEqual({
        fieldName: 'descricao',
        oldValue: 'Minerale',
        newValue: 'Minerale CZ',
        displayName: 'Descrição',
        isNested: false,
      });
    });

    it('should detect number field changes', () => {
      const current = { codigo: 1, valor: 150.0 };
      const previous = { codigo: 1, valor: 100.0 };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].fieldName).toBe('valor');
      expect(changes[0].oldValue).toBe(100.0);
      expect(changes[0].newValue).toBe(150.0);
    });

    it('should detect boolean field changes', () => {
      const current = { codigo: 1, ativo: true };
      const previous = { codigo: 1, ativo: false };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].fieldName).toBe('ativo');
      expect(changes[0].oldValue).toBe(false);
      expect(changes[0].newValue).toBe(true);
    });

    it('should detect date field changes', () => {
      const current = { codigo: 1, implantacao: '2024-01-01' };
      const previous = { codigo: 1, implantacao: '2023-12-01' };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].fieldName).toBe('implantacao');
      expect(changes[0].oldValue).toBe('2023-12-01');
      expect(changes[0].newValue).toBe('2024-01-01');
    });
  });

  describe('nested object field changes', () => {
    it('should detect nested object changes', () => {
      const current = {
        codigo: 1,
        cor: { codigo: 2, descricao: 'Verde' },
      };
      const previous = {
        codigo: 1,
        cor: { codigo: 1, descricao: 'Azul' },
      };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].fieldName).toBe('cor');
      expect(changes[0].oldValue).toEqual({ codigo: 1, descricao: 'Azul' });
      expect(changes[0].newValue).toEqual({ codigo: 2, descricao: 'Verde' });
      expect(changes[0].isNested).toBe(true);
    });

    it('should detect changes within nested objects by comparing nested properties', () => {
      const current = {
        codigo: 1,
        medidas: { altura: 100, largura: 200, espessura: 18 },
      };
      const previous = {
        codigo: 1,
        medidas: { altura: 100, largura: 180, espessura: 18 },
      };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].fieldName).toBe('medidas');
      expect(changes[0].isNested).toBe(true);
    });

    it('should detect deeply nested object changes', () => {
      const current = {
        codigo: 1,
        filho: {
          codigo: 1,
          cor: { codigo: 2, descricao: 'Verde' },
        },
      };
      const previous = {
        codigo: 1,
        filho: {
          codigo: 1,
          cor: { codigo: 1, descricao: 'Azul' },
        },
      };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].fieldName).toBe('filho');
      expect(changes[0].isNested).toBe(true);
    });
  });

  describe('null and undefined handling', () => {

    it('should detect change from undefined to value', () => {
      const current = { codigo: 1, observacao: 'New value' };
      const previous = { codigo: 1 };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].oldValue).toBeUndefined();
      expect(changes[0].newValue).toBe('New value');
    });

    it('should detect change from value to undefined', () => {
      const current = { codigo: 1 };
      const previous = { codigo: 1, observacao: 'Old value' };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].oldValue).toBe('Old value');
      expect(changes[0].newValue).toBeUndefined();
    });

    it('should not report change when both are null', () => {
      const current = { codigo: 1, observacao: null };
      const previous = { codigo: 1, observacao: null };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(0);
    });
  });

  describe('audit field exclusion', () => {
    it('should exclude criadoem from diff results', () => {
      const current = {
        codigo: 1,
        descricao: 'Test',
        criadoem: '2025-07-29T19:47:47.172976',
      };
      const previous = {
        codigo: 1,
        descricao: 'Test',
        criadoem: '2025-03-03T08:37:44.798588',
      };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(0);
    });

    it('should exclude criadopor from diff results', () => {
      const current = { codigo: 1, descricao: 'Test', criadopor: 'user2@test.com' };
      const previous = { codigo: 1, descricao: 'Test', criadopor: 'user1@test.com' };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(0);
    });

    it('should exclude modificadoem from diff results', () => {
      const current = {
        codigo: 1,
        descricao: 'Test',
        modificadoem: '2025-07-29T19:47:47.172976',
      };
      const previous = {
        codigo: 1,
        descricao: 'Test',
        modificadoem: '2025-03-03T08:37:44.798588',
      };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(0);
    });

    it('should exclude modificadopor from diff results', () => {
      const current = {
        codigo: 1,
        descricao: 'Test',
        modificadopor: 'user2@test.com',
      };
      const previous = {
        codigo: 1,
        descricao: 'Test',
        modificadopor: 'user1@test.com',
      };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(0);
    });

    it('should include non-audit fields even when audit fields present', () => {
      const current = {
        codigo: 1,
        descricao: 'New Description',
        criadoem: '2025-07-29T19:47:47.172976',
        criadopor: 'user2@test.com',
      };
      const previous = {
        codigo: 1,
        descricao: 'Old Description',
        criadoem: '2025-03-03T08:37:44.798588',
        criadopor: 'user1@test.com',
      };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].fieldName).toBe('descricao');
    });
  });

  describe('unchanged fields', () => {
    it('should not include unchanged fields in diff', () => {
      const current = { codigo: 1, descricao: 'Test', valor: 100 };
      const previous = { codigo: 1, descricao: 'Test', valor: 100 };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(0);
    });

    it('should only include changed fields when some fields unchanged', () => {
      const current = {
        codigo: 1,
        descricao: 'New',
        valor: 100,
        situacao: 'ATIVO',
      };
      const previous = {
        codigo: 1,
        descricao: 'Old',
        valor: 100,
        situacao: 'ATIVO',
      };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].fieldName).toBe('descricao');
    });
  });

  describe('multiple field changes', () => {
    it('should detect multiple changed fields', () => {
      const current = {
        codigo: 1,
        descricao: 'New Description',
        valor: 150,
        situacao: 'INATIVO',
      };
      const previous = {
        codigo: 1,
        descricao: 'Old Description',
        valor: 100,
        situacao: 'ATIVO',
      };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(3);
      expect(changes.map((c) => c.fieldName)).toEqual(
        expect.arrayContaining(['descricao', 'valor', 'situacao'])
      );
    });
  });

  describe('human-readable field labels', () => {
    it('should map common Portuguese field names', () => {
      const current = {
        codigo: 1,
        descricao: 'New',
        situacao: 'ATIVO',
        valor: 100,
      };
      const previous = {
        codigo: 1,
        descricao: 'Old',
        situacao: 'INATIVO',
        valor: 50,
      };

      const changes = calculateFieldDifferences(current, previous);

      const descricaoChange = changes.find((c) => c.fieldName === 'descricao');
      const situacaoChange = changes.find((c) => c.fieldName === 'situacao');
      const valorChange = changes.find((c) => c.fieldName === 'valor');

      expect(descricaoChange?.displayName).toBe('Descrição');
      expect(situacaoChange?.displayName).toBe('Situação');
      expect(valorChange?.displayName).toBe('Valor');
    });

    it('should use custom field labels when provided', () => {
      const current = { codigo: 1, customField: 'New' };
      const previous = { codigo: 1, customField: 'Old' };

      const customLabels = { customField: 'Campo Customizado' };
      const changes = calculateFieldDifferences(current, previous, customLabels);

      expect(changes[0].displayName).toBe('Campo Customizado');
    });

    it('should fallback to field name if label not found', () => {
      const current = { codigo: 1, unknownField: 'New' };
      const previous = { codigo: 1, unknownField: 'Old' };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes[0].displayName).toBe('unknownField');
    });
  });

  describe('circular reference detection', () => {
    it('should handle circular references without infinite recursion', () => {
      const current: any = { codigo: 1, name: 'Current' };
      current.self = current; // Create circular reference

      const previous: any = { codigo: 1, name: 'Previous' };
      previous.self = previous; // Create circular reference

      const changes = calculateFieldDifferences(current, previous);

      // Should detect name change but handle circular reference gracefully
      expect(changes.some((c) => c.fieldName === 'name')).toBe(true);
      // Should not throw stack overflow error
      expect(changes).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const current = {};
      const previous = {};

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(0);
    });

    it('should handle arrays as field values', () => {
      const current = { codigo: 1, tags: ['a', 'b', 'c'] };
      const previous = { codigo: 1, tags: ['a', 'b'] };

      const changes = calculateFieldDifferences(current, previous);

      expect(changes).toHaveLength(1);
      expect(changes[0].fieldName).toBe('tags');
      expect(changes[0].oldValue).toEqual(['a', 'b']);
      expect(changes[0].newValue).toEqual(['a', 'b', 'c']);
    });
  });
});
