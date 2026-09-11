import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HistoryRecordCard } from './HistoryRecordCard';
import type { HistoryRecord } from '../../hooks/types';

// Mock entity type for testing
type TestEntity = {
  codigo: number;
  descricao: string;
  situacao: string;
  valor?: number;
  cor?: {
    codigo: number;
    descricao: string;
  };
};

// Helper to create mock history records
function createMockHistoryRecord(
  id: number,
  entity: TestEntity,
  date: string = '2025-07-29T19:47:47.028828',
  author: string = 'test@test.com',
  diff: Record<string, unknown> | null = null
): HistoryRecord<TestEntity> {
  return {
    id,
    date,
    author,
    entity,
    diff,
  };
}

describe('HistoryRecordCard', () => {
  describe('metadata display', () => {
    it('should display formatted date', () => {
      const record = createMockHistoryRecord(1, {
        codigo: 1,
        descricao: 'Test',
        situacao: 'ATIVO',
      });

      render(<HistoryRecordCard record={record} isLatest={false} />);

      // Date should be formatted as dd/MM/yyyy - HH:mm
      expect(screen.getByText(/29\/07\/2025/)).toBeInTheDocument();
    });

    it('should display author name', () => {
      const record = createMockHistoryRecord(
        1,
        { codigo: 1, descricao: 'Test', situacao: 'ATIVO' },
        '2025-07-29T19:47:47.028828',
        'user@example.com'
      );

      render(<HistoryRecordCard record={record} isLatest={false} />);

      expect(screen.getByText(/user@example\.com/)).toBeInTheDocument();
    });

    it('should show "Versão Atual" indicator when isLatest is true', () => {
      const record = createMockHistoryRecord(1, {
        codigo: 1,
        descricao: 'Test',
        situacao: 'ATIVO',
      });

      render(<HistoryRecordCard record={record} isLatest={true} />);

      expect(screen.getByText('Versão Atual')).toBeInTheDocument();
    });

    it('should not show "Versão Atual" indicator when isLatest is false', () => {
      const record = createMockHistoryRecord(1, {
        codigo: 1,
        descricao: 'Test',
        situacao: 'ATIVO',
      });

      render(<HistoryRecordCard record={record} isLatest={false} />);

      expect(screen.queryByText('Versão Atual')).not.toBeInTheDocument();
    });
  });

  describe('field changes display', () => {
    it('should display field changes using backend diff', () => {
      const record = createMockHistoryRecord(
        2,
        {
          codigo: 1,
          descricao: 'New Description',
          situacao: 'ATIVO',
        },
        '2025-07-29T20:00:00',
        'test@test.com',
        {
          descricao: 'Old Description',
          situacao: 'INATIVO',
        }
      );

      render(<HistoryRecordCard record={record} isLatest={false} />);

      // Should show field label
      expect(screen.getByText(/Descrição/)).toBeInTheDocument();
      expect(screen.getByText(/Situação/)).toBeInTheDocument();

      // Should show old and new values (enum values are converted to labels)
      expect(screen.getByText(/Old Description/)).toBeInTheDocument();
      expect(screen.getByText(/New Description/)).toBeInTheDocument();
      expect(screen.getByText(/Inativo/)).toBeInTheDocument();
      expect(screen.getByText(/Ativo/)).toBeInTheDocument();
    });

    it('should show arrow (→) between old and new values', () => {
      const record = createMockHistoryRecord(
        2,
        {
          codigo: 1,
          descricao: 'New',
          situacao: 'ATIVO',
        },
        '2025-07-29T20:00:00',
        'test@test.com',
        {
          descricao: 'Old',
        }
      );

      render(<HistoryRecordCard record={record} isLatest={false} />);

      const arrows = screen.getAllByText('→');
      expect(arrows.length).toBeGreaterThan(0);
    });

    it('should display "Versão inicial criada" when diff is null', () => {
      const record = createMockHistoryRecord(
        1,
        {
          codigo: 1,
          descricao: 'First Version',
          situacao: 'ATIVO',
        },
        '2025-07-29T19:47:47.028828',
        'test@test.com',
        null
      );

      render(<HistoryRecordCard record={record} isLatest={false} />);

      expect(screen.getByText('Versão inicial criada')).toBeInTheDocument();
    });

    it('should format field values using renderFieldValue utility', () => {
      const record = createMockHistoryRecord(
        2,
        {
          codigo: 1,
          descricao: 'Test',
          situacao: 'ATIVO',
          valor: 200,
        },
        '2025-07-29T20:00:00',
        'test@test.com',
        {
          valor: 100,
        }
      );

      render(<HistoryRecordCard record={record} isLatest={false} />);

      // Numbers should be rendered
      expect(screen.getByText(/100/)).toBeInTheDocument();
      expect(screen.getByText(/200/)).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty diff gracefully', () => {
      const record = createMockHistoryRecord(
        2,
        {
          codigo: 1,
          descricao: 'Test',
          situacao: 'ATIVO',
        },
        '2025-07-29T20:00:00',
        'test@test.com',
        {}
      );

      render(<HistoryRecordCard record={record} isLatest={false} />);

      expect(screen.getByText('Nenhuma alteração detectada')).toBeInTheDocument();
    });

    it('should render nested object changes', () => {
      const record = createMockHistoryRecord(
        2,
        {
          codigo: 1,
          descricao: 'Test',
          situacao: 'ATIVO',
          cor: {
            codigo: 2,
            descricao: 'Verde',
          },
        },
        '2025-07-29T20:00:00',
        'test@test.com',
        {
          cor: {
            codigo: 1,
            descricao: 'Azul',
          },
        }
      );

      render(<HistoryRecordCard record={record} isLatest={false} />);

      // Should show nested object field change
      expect(screen.getByText(/Cor/)).toBeInTheDocument();
      expect(screen.getByText(/Azul/)).toBeInTheDocument();
      expect(screen.getByText(/Verde/)).toBeInTheDocument();
    });
  });
});
