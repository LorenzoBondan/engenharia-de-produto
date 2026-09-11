import type { HistoryRecord } from '../../hooks/types';
import { HistoryRecordCard } from './HistoryRecordCard';
import styles from './HistoryTimeline.module.css';

/**
 * Props for HistoryTimeline component
 * @template T - The entity type being tracked
 */
export interface HistoryTimelineProps<T> {
  /** Array of history records to display */
  history: HistoryRecord<T>[];
}

/**
 * HistoryTimeline Component
 *
 * Displays a reverse chronological timeline of history records (newest first).
 * Each record shows changes from the previous version.
 * The most recent record is marked as "Versão Atual" and appears at the top.
 *
 * @template T - The entity type
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <HistoryTimeline history={historyRecords} />
 * ```
 */
export function HistoryTimeline<T extends Record<string, unknown>>({
  history,
}: HistoryTimelineProps<T>) {
  // Empty state
  if (history.length === 0) {
    return (
      <div className={styles.emptyState}>
        Nenhum histórico disponível
      </div>
    );
  }

  return (
    <div
      className={styles.timeline}
      role="list"
      aria-label="Histórico de alterações"
    >
      {history.map((record, index) => {
        // First record (index 0) is the latest version
        const isLatest = index === 0;

        return (
          <div key={record.id} role="listitem" className={styles.timelineItem}>
            <HistoryRecordCard
              record={record}
              isLatest={isLatest}
            />
          </div>
        );
      })}
    </div>
  );
}
