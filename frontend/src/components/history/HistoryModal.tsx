import { useEffect, useRef } from 'react';
import type { HistoryRecord } from '../../hooks/types';
import { useEntityHistory } from '../../hooks/common/useEntityHistory';
import { HistoryTimeline } from './HistoryTimeline';
import type { AxiosResponse } from 'axios';
import styles from './HistoryModal.module.css';

/**
 * Props for HistoryModal component
 * @template T - The entity type being tracked
 */
export interface HistoryModalProps<T> {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Entity ID to fetch history for */
  entityId: number;
  /** Function to fetch history from service */
  fetchHistoryFn: (entityId: number) => Promise<AxiosResponse<HistoryRecord<T>[]>>;
  /** Optional entity name to display in title */
  entityName?: string;
}

/**
 * HistoryModal Component
 *
 * Modal dialog for displaying entity history.
 * Integrates with useEntityHistory hook to fetch and display history records.
 * Handles loading states, errors, and provides retry functionality.
 *
 * @template T - The entity type
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <HistoryModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   entityId={corId}
 *   fetchHistoryFn={corService.pesquisarHistorico}
 *   entityName="Cor - Azul"
 * />
 * ```
 */
export function HistoryModal<T extends Record<string, unknown>>({
  isOpen,
  onClose,
  entityId,
  fetchHistoryFn,
  entityName,
}: HistoryModalProps<T>) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Fetch history using custom hook
  const { history, loading, error, refresh } = useEntityHistory({
    fetchHistoryFn,
    entityId,
  });

  // Refresh history when modal opens
  useEffect(() => {
    if (isOpen) {
      refresh();
    }
  }, [isOpen, refresh]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus dialog
      dialogRef.current?.focus();

      // Scroll to top when modal opens
      if (bodyRef.current) {
        bodyRef.current.scrollTop = 0;
      }
    } else {
      // Restore focus when closing
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Scroll to top when history loads
  useEffect(() => {
    if (!loading && history.length > 0 && bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [loading, history.length]);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  const modalTitle = entityName
    ? `Histórico - ${entityName}`
    : 'Histórico de Alterações';

  return (
    <div
      className={styles.backdrop}
      data-testid="modal-backdrop"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="history-modal-title" className={styles.title}>
            {modalTitle}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div ref={bodyRef} className={styles.body}>
          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Carregando histórico...</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.errorState}>
              <p className={styles.errorMessage}>{error}</p>
              <button className={styles.retryButton} onClick={refresh}>
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className={styles.timelineContainer}>
              <HistoryTimeline history={history} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
