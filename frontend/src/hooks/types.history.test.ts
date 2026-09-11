import { describe, it, expect } from 'vitest';
import type {
  HistoryRecord,
  FieldChange,
  UseEntityHistoryConfig,
  UseEntityHistoryReturn,
} from './types';
import type { DCor } from '../models/cor';
import type { AxiosResponse } from 'axios';

/**
 * Type tests for history-related interfaces
 * These tests validate that the type definitions are correct and usable
 */
describe('History Type Definitions', () => {
  describe('HistoryRecord<T>', () => {
    it('should accept valid history record with generic entity type', () => {
      const validRecord: HistoryRecord<DCor> = {
        id: 1,
        date: '2025-07-29T19:47:47.028828',
        author: 'postgres',
        entity: {
          codigo: 1,
          descricao: 'Minerale',
          hexa: 'F12398',
          situacao: 'ATIVO',
        },
        diff: {
          descricao: 'Minerale CZ',
          situacao: 'LIXEIRA',
        },
      };

      expect(validRecord.id).toBe(1);
      expect(validRecord.entity.codigo).toBe(1);
    });

    it('should accept null diff for first version', () => {
      const firstVersion: HistoryRecord<DCor> = {
        id: 1,
        date: '2025-03-03T08:37:44.798588',
        author: 'postgres',
        entity: {
          codigo: 1,
          descricao: 'Minerale',
          hexa: 'F12398',
          situacao: 'ATIVO',
        },
        diff: null,
      };

      expect(firstVersion.diff).toBeNull();
    });

    it('should preserve entity type through generic parameter', () => {
      const record: HistoryRecord<DCor> = {
        id: 1,
        date: '2025-07-29T19:47:47.028828',
        author: 'test',
        entity: {
          codigo: 1,
          descricao: 'Test',
          hexa: 'FFFFFF',
          situacao: 'ATIVO',
        },
        diff: null,
      };

      // TypeScript should enforce DCor structure
      const entityCodigo: number = record.entity.codigo;
      const entityDescricao: string = record.entity.descricao;

      expect(entityCodigo).toBeDefined();
      expect(entityDescricao).toBeDefined();
    });
  });

  describe('FieldChange', () => {
    it('should accept valid field change for primitive types', () => {
      const primitiveChange: FieldChange = {
        fieldName: 'descricao',
        oldValue: 'Minerale',
        newValue: 'Minerale CZ',
        displayName: 'Descrição',
        isNested: false,
      };

      expect(primitiveChange.fieldName).toBe('descricao');
      expect(primitiveChange.isNested).toBe(false);
    });

    it('should accept valid field change for nested objects', () => {
      const nestedChange: FieldChange = {
        fieldName: 'cor',
        oldValue: { codigo: 1, descricao: 'Azul' },
        newValue: { codigo: 2, descricao: 'Verde' },
        displayName: 'Cor',
        isNested: true,
      };

      expect(nestedChange.isNested).toBe(true);
      expect(nestedChange.oldValue).toEqual({ codigo: 1, descricao: 'Azul' });
    });

    it('should handle null/undefined values', () => {
      const nullChange: FieldChange = {
        fieldName: 'implantacao',
        oldValue: null,
        newValue: '2024-01-01',
        displayName: 'Implantação',
        isNested: false,
      };

      const undefinedChange: FieldChange = {
        fieldName: 'observacao',
        oldValue: 'Some text',
        newValue: undefined,
        displayName: 'Observação',
        isNested: false,
      };

      expect(nullChange.oldValue).toBeNull();
      expect(undefinedChange.newValue).toBeUndefined();
    });
  });

  describe('UseEntityHistoryConfig<T>', () => {
    it('should accept valid configuration with typed fetch function', () => {
      const mockFetchFn = async (
        _entityId: number
      ): Promise<AxiosResponse<HistoryRecord<DCor>[]>> => {
        return {
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        };
      };

      const config: UseEntityHistoryConfig<DCor> = {
        fetchHistoryFn: mockFetchFn,
        entityId: 123,
      };

      expect(config.entityId).toBe(123);
      expect(typeof config.fetchHistoryFn).toBe('function');
    });

    it('should enforce positive integer entityId through runtime validation', () => {
      // Type system allows any number, but runtime validation should catch invalid IDs
      const config: UseEntityHistoryConfig<DCor> = {
        fetchHistoryFn: async () => ({
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        }),
        entityId: -1, // Invalid but type-safe (validated at runtime in hook)
      };

      expect(config.entityId).toBe(-1);
    });
  });

  describe('UseEntityHistoryReturn<T>', () => {
    it('should accept valid hook return value', () => {
      const hookReturn: UseEntityHistoryReturn<DCor> = {
        history: [],
        loading: false,
        error: null,
        refresh: () => {},
      };

      expect(hookReturn.history).toEqual([]);
      expect(hookReturn.loading).toBe(false);
      expect(hookReturn.error).toBeNull();
    });

    it('should accept history array with typed records', () => {
      const hookReturn: UseEntityHistoryReturn<DCor> = {
        history: [
          {
            id: 1,
            date: '2025-07-29T19:47:47.028828',
            author: 'postgres',
            entity: {
              codigo: 1,
              descricao: 'Minerale',
              hexa: 'F12398',
              situacao: 'ATIVO',
            },
            diff: null,
          },
        ],
        loading: false,
        error: null,
        refresh: () => {},
      };

      expect(hookReturn.history).toHaveLength(1);
      expect(hookReturn.history[0].entity.codigo).toBe(1);
    });

    it('should accept error state', () => {
      const errorState: UseEntityHistoryReturn<DCor> = {
        history: [],
        loading: false,
        error: 'Failed to fetch history',
        refresh: () => {},
      };

      expect(errorState.error).toBe('Failed to fetch history');
    });

    it('should accept loading state', () => {
      const loadingState: UseEntityHistoryReturn<DCor> = {
        history: [],
        loading: true,
        error: null,
        refresh: () => {},
      };

      expect(loadingState.loading).toBe(true);
    });
  });

  describe('Type safety across different entity types', () => {
    it('should work with any entity type through generics', () => {
      // Define a different entity type
      type TestEntity = {
        id: number;
        name: string;
        active: boolean;
      };

      const record: HistoryRecord<TestEntity> = {
        id: 1,
        date: '2025-07-29T19:47:47.028828',
        author: 'test',
        entity: {
          id: 1,
          name: 'Test',
          active: true,
        },
        diff: null,
      };

      // TypeScript enforces TestEntity structure
      expect(record.entity.id).toBe(1);
      expect(record.entity.name).toBe('Test');
      expect(record.entity.active).toBe(true);
    });
  });
});
