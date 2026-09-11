/**
 * History Components - Public API
 *
 * Export all history-related components and utilities for easy importing.
 *
 * @example
 * ```typescript
 * import { HistoryButton, HistoryModal } from '@/components/history';
 * ```
 */

// Main components for integration
export { HistoryButton } from './HistoryButton';
export { HistoryModal } from './HistoryModal';

// Sub-components (exported for advanced usage)
export { HistoryTimeline } from './HistoryTimeline';
export { HistoryRecordCard } from './HistoryRecordCard';

// TypeScript types
export type { HistoryButtonProps } from './HistoryButton';
export type { HistoryModalProps } from './HistoryModal';
export type { HistoryTimelineProps } from './HistoryTimeline';
export type { HistoryRecordCardProps } from './HistoryRecordCard';
