import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HistoryModal } from './HistoryModal';
import { clearHistoryCache } from '../../hooks/common/useEntityHistory';
import type { HistoryRecord } from '../../hooks/types';
import type { AxiosResponse } from 'axios';

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

// Helper to create mock axios response
function createMockAxiosResponse<T>(
  data: T,
  status: number = 200
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

describe('HistoryModal', () => {
  // Mock fetch function
  const mockHistory = [
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

  const mockFetchFn = vi
    .fn()
    .mockResolvedValue(createMockAxiosResponse(mockHistory));
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    clearHistoryCache();
  });

  describe('modal visibility', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <HistoryModal
          isOpen={false}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      // Modal should not be in DOM
      expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      // Modal should be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display entity name in title when provided', () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
          entityName="Cor - Azul"
        />
      );

      expect(screen.getByText(/Cor - Azul/)).toBeInTheDocument();
    });

    it('should display default title when entityName not provided', () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      expect(screen.getByText('Histórico de Alterações')).toBeInTheDocument();
    });
  });

  describe('close functionality', () => {
    it('should call onClose when close button clicked', async () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      const closeButton = screen.getByLabelText(/fechar/i);
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when ESC key pressed', () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      fireEvent.keyDown(screen.getByRole('dialog'), {
        key: 'Escape',
        code: 'Escape',
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop clicked', () => {
      const { container } = render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      // Click on backdrop (modal overlay)
      const backdrop = container.querySelector('[data-testid="modal-backdrop"]');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close when modal content clicked', () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      // Click on modal content
      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should display loading indicator while fetching', () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      // Should show loading state
      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it('should hide loading indicator after data loads', async () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should display error message when fetch fails', async () => {
      const errorFetchFn = vi.fn().mockRejectedValue({
        response: { status: 500 },
      });

      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={errorFetchFn}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/erro/i)).toBeInTheDocument();
      });
    });

    it('should display retry button on error', async () => {
      const errorFetchFn = vi.fn().mockRejectedValue({
        response: { status: 500 },
      });

      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={errorFetchFn}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/tentar novamente/i)).toBeInTheDocument();
      });
    });

    it('should retry fetch when retry button clicked', async () => {
      const retryFetchFn = vi
        .fn()
        .mockRejectedValueOnce({ response: { status: 500 } })
        .mockRejectedValueOnce({ response: { status: 500 } })
        .mockResolvedValueOnce(createMockAxiosResponse(mockHistory));

      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={retryFetchFn}
        />
      );

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/erro/i)).toBeInTheDocument();
      });

      // Click retry button
      const retryButton = screen.getByText(/tentar novamente/i);
      fireEvent.click(retryButton);

      // Should show history after retry
      await waitFor(() => {
        expect(screen.getByText(/Version 2/)).toBeInTheDocument();
      });

      expect(retryFetchFn).toHaveBeenCalledTimes(3);
    });
  });

  describe('history display', () => {
    it('should display history timeline when data loads', async () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Version 2/)).toBeInTheDocument();
        expect(screen.getByText(/Version 1/)).toBeInTheDocument();
      });
    });

    it('should call fetchHistoryFn with entityId', async () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={123}
          fetchHistoryFn={mockFetchFn}
        />
      );

      await waitFor(() => {
        expect(mockFetchFn).toHaveBeenCalledWith(123);
      });
    });
  });

  describe('accessibility', () => {
    it('should have dialog role', () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      render(
        <HistoryModal
          isOpen={true}
          onClose={mockOnClose}
          entityId={1}
          fetchHistoryFn={mockFetchFn}
        />
      );

      const dialog = screen.getByRole('dialog');
      const labelId = dialog.getAttribute('aria-labelledby');

      expect(labelId).toBeTruthy();
      expect(document.getElementById(labelId!)).toBeInTheDocument();
    });
  });
});
