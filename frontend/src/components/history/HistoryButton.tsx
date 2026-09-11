import styles from './HistoryButton.module.css';

/**
 * Props for HistoryButton component
 */
export interface HistoryButtonProps {
  /** Callback function when button is clicked */
  onClick: () => void;
  /** Optional custom label for the button */
  label?: string;
}

/**
 * HistoryButton Component
 *
 * Trigger button for opening the history modal.
 * Accessible button with keyboard support (Enter/Space keys).
 *
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <HistoryButton
 *   onClick={() => setModalOpen(true)}
 *   label="Ver Histórico"
 * />
 * ```
 */
export function HistoryButton({
  onClick,
  label = 'Visualizar Histórico',
}: HistoryButtonProps) {
  /**
   * Handle keyboard events for accessibility
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {label}
    </button>
  );
}
