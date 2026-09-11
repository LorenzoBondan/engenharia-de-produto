import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HistoryTimeline } from './HistoryTimeline';
import type { HistoryRecord } from '../../hooks/types';

// Mock entity type for testing
type TestEntity = {
  codigo: number;
  descricao: string;
  situacao: string;
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

describe('HistoryTimeline', () => {
  describe('timeline rendering', () => {
    it('should render history records as cards', () => {
      const history = [
        createMockHistoryRecord(
          2,
          {
            codigo: 1,
            descricao: 'Version 2',
            situacao: 'ATIVO',
          },
          '2025-07-29T20:00:00',
          'test@test.com',
          {
            descricao: 'Version 1',
          }
        ),
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Version 1',
          situacao: 'ATIVO',
        }),
      ];

      render(<HistoryTimeline history={history} />);

      // Should render both records
      expect(screen.getByText(/Version 2/)).toBeInTheDocument();
      expect(screen.getByText(/Version 1/)).toBeInTheDocument();
    });

    it('should mark first record as latest version', () => {
      const history = [
        createMockHistoryRecord(3, {
          codigo: 1,
          descricao: 'Latest',
          situacao: 'ATIVO',
        }),
        createMockHistoryRecord(2, {
          codigo: 1,
          descricao: 'Middle',
          situacao: 'ATIVO',
        }),
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Oldest',
          situacao: 'ATIVO',
        }),
      ];

      render(<HistoryTimeline history={history} />);

      // First record should have "Versão Atual" badge
      expect(screen.getByText('Versão Atual')).toBeInTheDocument();
    });

    it('should display field changes using backend diff', () => {
      const history = [
        createMockHistoryRecord(
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
          }
        ),
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Old Description',
          situacao: 'ATIVO',
        }),
      ];

      render(<HistoryTimeline history={history} />);

      // Should show field change from backend diff
      expect(screen.getByText(/Old Description/)).toBeInTheDocument();
      expect(screen.getByText(/New Description/)).toBeInTheDocument();
      const arrows = screen.getAllByText('→');
      expect(arrows.length).toBeGreaterThan(0);
    });

    it('should display "Nenhum histórico disponível" when history is empty', () => {
      render(<HistoryTimeline history={[]} />);

      expect(
        screen.getByText('Nenhum histórico disponível')
      ).toBeInTheDocument();
    });

    it('should render multiple history records in order', () => {
      const history = [
        createMockHistoryRecord(
          3,
          { codigo: 1, descricao: 'V3', situacao: 'ATIVO' },
          '2025-07-30T10:00:00'
        ),
        createMockHistoryRecord(
          2,
          { codigo: 1, descricao: 'V2', situacao: 'ATIVO' },
          '2025-07-29T10:00:00'
        ),
        createMockHistoryRecord(
          1,
          { codigo: 1, descricao: 'V1', situacao: 'ATIVO' },
          '2025-07-28T10:00:00'
        ),
      ];

      render(<HistoryTimeline history={history} />);

      const dates = screen.getAllByText(/30\/07\/2025|29\/07\/2025|28\/07\/2025/);
      expect(dates).toHaveLength(3);
    });
  });

  describe('accessibility', () => {
    it('should have appropriate ARIA role for timeline', () => {
      const history = [
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Test',
          situacao: 'ATIVO',
        }),
      ];

      const { container } = render(<HistoryTimeline history={history} />);

      // Timeline should be a list with role
      const timeline = container.querySelector('[role="list"]');
      expect(timeline).toBeInTheDocument();
    });

    it('should have ARIA label for timeline', () => {
      const history = [
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Test',
          situacao: 'ATIVO',
        }),
      ];

      const { container } = render(<HistoryTimeline history={history} />);

      const timeline = container.querySelector('[aria-label]');
      expect(timeline).toBeInTheDocument();
      expect(timeline?.getAttribute('aria-label')).toContain('Histórico');
    });

    it('should wrap each record in list item', () => {
      const history = [
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'Test',
          situacao: 'ATIVO',
        }),
      ];

      const { container } = render(<HistoryTimeline history={history} />);

      const listItems = container.querySelectorAll('[role="listitem"]');
      expect(listItems).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should handle single history record', () => {
      const history = [
        createMockHistoryRecord(1, {
          codigo: 1,
          descricao: 'First Version',
          situacao: 'ATIVO',
        }),
      ];

      render(<HistoryTimeline history={history} />);

      // Should show "Versão inicial criada" since no previous record
      expect(screen.getByText('Versão inicial criada')).toBeInTheDocument();
      expect(screen.getByText('Versão Atual')).toBeInTheDocument();
    });

    it('should handle large history array', () => {
      const history = Array.from({ length: 50 }, (_, i) =>
        createMockHistoryRecord(i + 1, {
          codigo: 1,
          descricao: `Version ${i + 1}`,
          situacao: 'ATIVO',
        })
      );

      const { container } = render(<HistoryTimeline history={history} />);

      const listItems = container.querySelectorAll('[role="listitem"]');
      expect(listItems).toHaveLength(50);
    });
  });
});
