/**
 * Integration Test - Full History Feature Workflow
 *
 * This test validates that all components work together correctly
 * in a real-world usage scenario.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { HistoryButton, HistoryModal } from './index';
import { clearHistoryCache } from '../../hooks/common/useEntityHistory';
import type { HistoryRecord } from '../../hooks/types';
import type { AxiosResponse } from 'axios';

// Mock entity type
type TestEntity = {
  codigo: number;
  descricao: string;
  valor: number;
};

// Helper to create mock history records
function createMockHistory(): HistoryRecord<TestEntity>[] {
  return [
    {
      id: 3,
      date: '2025-07-30T10:00:00',
      author: 'admin@test.com',
      entity: {
        codigo: 1,
        descricao: 'Version 3',
        valor: 300,
      },
      diff: {
        descricao: 'Version 2',
        valor: 200,
      },
    },
    {
      id: 2,
      date: '2025-07-29T10:00:00',
      author: 'user@test.com',
      entity: {
        codigo: 1,
        descricao: 'Version 2',
        valor: 200,
      },
      diff: {
        descricao: 'Version 1',
        valor: 100,
      },
    },
    {
      id: 1,
      date: '2025-07-28T10:00:00',
      author: 'user@test.com',
      entity: {
        codigo: 1,
        descricao: 'Version 1',
        valor: 100,
      },
      diff: null,
    },
  ];
}

// Mock service
function createMockAxiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

// Simulated CRUD Detail Page Component
function TestDetailPage() {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const mockFetchHistory = vi
    .fn()
    .mockResolvedValue(createMockAxiosResponse(createMockHistory()));

  return (
    <div>
      <h1>Test Entity Detail</h1>

      <div className="actions">
        <button>Edit</button>
        <button>Delete</button>

        {/* History Integration */}
        <HistoryButton onClick={() => setIsHistoryModalOpen(true)} />
      </div>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        entityId={1}
        fetchHistoryFn={mockFetchHistory}
        entityName="Test Entity - Version 3"
      />
    </div>
  );
}

describe('History Feature - Full Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearHistoryCache();
  });

  it('should complete full user workflow: open modal, view history, close', async () => {
    render(<TestDetailPage />);

    // 1. Page loads with history button visible
    const historyButton = screen.getByText('Visualizar Histórico');
    expect(historyButton).toBeInTheDocument();

    // 2. Click button to open modal
    fireEvent.click(historyButton);

    // 3. Modal opens with loading state
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // 4. History loads and displays
    await waitFor(() => {
      const version3Elements = screen.getAllByText(/Version 3/);
      expect(version3Elements.length).toBeGreaterThan(0);
    });

    // 5. Timeline shows all records
    expect(screen.getAllByText(/Version 3/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Version 2/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Version 1/).length).toBeGreaterThan(0);

    // 6. Latest record has badge
    expect(screen.getByText('Versão Atual')).toBeInTheDocument();

    // 7. Dates are formatted
    expect(screen.getByText(/30\/07\/2025/)).toBeInTheDocument();

    // 8. Field changes are displayed
    expect(screen.getAllByText(/Descrição/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Valor/).length).toBeGreaterThan(0);

    // 9. Close with ESC key
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape',
    });

    // 10. Modal closes
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should handle button click and modal open/close cycle', async () => {
    render(<TestDetailPage />);

    const historyButton = screen.getByText('Visualizar Histórico');

    // First open
    fireEvent.click(historyButton);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close with X button
    const closeButton = screen.getByLabelText(/fechar/i);
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Second open (tests cache)
    fireEvent.click(historyButton);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should display proper diff between consecutive versions', async () => {
    render(<TestDetailPage />);

    fireEvent.click(screen.getByText('Visualizar Histórico'));

    await waitFor(() => {
      const version3Elements = screen.getAllByText(/Version 3/);
      expect(version3Elements.length).toBeGreaterThan(0);
    });

    // Check that differences are shown
    // Version 3 vs Version 2: descricao changed
    expect(screen.getAllByText(/Version 2/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Version 3/).length).toBeGreaterThan(0);

    // Arrow indicating change
    const arrows = screen.getAllByText('→');
    expect(arrows.length).toBeGreaterThan(0);
  });

  it('should be keyboard accessible throughout', async () => {
    render(<TestDetailPage />);

    const historyButton = screen.getByText('Visualizar Histórico');

    // Focus button
    historyButton.focus();
    expect(document.activeElement).toBe(historyButton);

    // Activate with Enter
    fireEvent.keyDown(historyButton, { key: 'Enter', code: 'Enter' });

    // Modal opens
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // ESC closes modal
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape',
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should handle error and retry flow', async () => {
    // Custom component for error testing
    function TestDetailPageWithError() {
      const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

      const mockFetchHistory = vi
        .fn()
        .mockRejectedValueOnce({ response: { status: 500 } })
        .mockRejectedValueOnce({ response: { status: 500 } })
        .mockResolvedValueOnce(createMockAxiosResponse(createMockHistory()));

      return (
        <div>
          <HistoryButton onClick={() => setIsHistoryModalOpen(true)} />
          <HistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            entityId={1}
            fetchHistoryFn={mockFetchHistory}
          />
        </div>
      );
    }

    render(<TestDetailPageWithError />);

    fireEvent.click(screen.getByText('Visualizar Histórico'));

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/erro/i)).toBeInTheDocument();
    });

    // Click retry
    const retryButton = screen.getByText(/tentar novamente/i);
    fireEvent.click(retryButton);

    // Wait for success
    await waitFor(() => {
      const version3Elements = screen.getAllByText(/Version 3/);
      expect(version3Elements.length).toBeGreaterThan(0);
    });
  });

  it('should validate all public exports work correctly', () => {
    // Verify all exports are available
    expect(HistoryButton).toBeDefined();
    expect(HistoryModal).toBeDefined();

    // Verify they are React components
    expect(typeof HistoryButton).toBe('function');
    expect(typeof HistoryModal).toBe('function');
  });

  it('should show empty state when no history', async () => {
    function TestDetailPageEmpty() {
      const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

      const mockFetchHistory = vi
        .fn()
        .mockResolvedValue(createMockAxiosResponse([]));

      return (
        <div>
          <HistoryButton onClick={() => setIsHistoryModalOpen(true)} />
          <HistoryModal
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
            entityId={1}
            fetchHistoryFn={mockFetchHistory}
          />
        </div>
      );
    }

    render(<TestDetailPageEmpty />);

    fireEvent.click(screen.getByText('Visualizar Histórico'));

    await waitFor(() => {
      expect(
        screen.getByText('Nenhum histórico disponível')
      ).toBeInTheDocument();
    });
  });
});
