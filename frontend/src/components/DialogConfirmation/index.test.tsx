import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DialogConfirmation from './index';

describe('DialogConfirmation', () => {
  it('should render dialog with message', () => {
    render(<DialogConfirmation id={1} message="Are you sure?" onDialogAnswer={vi.fn()} />);

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should render Yes and No buttons', () => {
    render(<DialogConfirmation id={1} message="Confirm action?" onDialogAnswer={vi.fn()} />);

    expect(screen.getByRole('button', { name: /sim/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /não/i })).toBeInTheDocument();
  });

  it('should have dialog-confirmation-overlay class', () => {
    const { container } = render(<DialogConfirmation id={1} message="Test" onDialogAnswer={vi.fn()} />);

    expect(container.querySelector('.dialog-confirmation-overlay')).toBeInTheDocument();
  });

  it('should have dialog-confirmation-modal class', () => {
    const { container } = render(<DialogConfirmation id={1} message="Test" onDialogAnswer={vi.fn()} />);

    expect(container.querySelector('.dialog-confirmation-modal')).toBeInTheDocument();
  });

  it('should render Confirmação title', () => {
    render(<DialogConfirmation id={1} message="Test" onDialogAnswer={vi.fn()} />);

    expect(screen.getByText('Confirmação')).toBeInTheDocument();
  });

  it('should call onDialogAnswer with false when overlay is clicked', () => {
    const handleAnswer = vi.fn();
    const { container } = render(<DialogConfirmation id={1} message="Test" onDialogAnswer={handleAnswer} />);

    const overlay = container.querySelector('.dialog-confirmation-overlay');
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(handleAnswer).toHaveBeenCalledWith(false, 1);
    expect(handleAnswer).toHaveBeenCalledTimes(1);
  });

  it('should call onDialogAnswer with false and id when No button is clicked', () => {
    const handleAnswer = vi.fn();
    render(<DialogConfirmation id={1} message="Test" onDialogAnswer={handleAnswer} />);

    const noButton = screen.getByRole('button', { name: /não/i });
    fireEvent.click(noButton);

    expect(handleAnswer).toHaveBeenCalledWith(false, 1);
    expect(handleAnswer).toHaveBeenCalledTimes(1);
  });

  it('should call onDialogAnswer with true and id when Yes button is clicked', () => {
    const handleAnswer = vi.fn();
    render(<DialogConfirmation id={1} message="Test" onDialogAnswer={handleAnswer} />);

    const yesButton = screen.getByRole('button', { name: /sim/i });
    fireEvent.click(yesButton);

    expect(handleAnswer).toHaveBeenCalledWith(true, 1);
    expect(handleAnswer).toHaveBeenCalledTimes(1);
  });

  it('should not call onDialogAnswer when dialog modal is clicked', () => {
    const handleAnswer = vi.fn();
    const { container } = render(<DialogConfirmation id={1} message="Test" onDialogAnswer={handleAnswer} />);

    const dialogModal = container.querySelector('.dialog-confirmation-modal');
    if (dialogModal) {
      fireEvent.click(dialogModal);
    }

    expect(handleAnswer).not.toHaveBeenCalled();
  });

  it('should stop propagation when clicking dialog modal', () => {
    const handleAnswer = vi.fn();
    const { container } = render(<DialogConfirmation id={1} message="Test" onDialogAnswer={handleAnswer} />);

    const dialogModal = container.querySelector('.dialog-confirmation-modal');
    if (dialogModal) {
      fireEvent.click(dialogModal);
    }

    expect(handleAnswer).not.toHaveBeenCalled();
  });

  it('should render message in paragraph element', () => {
    render(<DialogConfirmation id={1} message="Important message" onDialogAnswer={vi.fn()} />);

    expect(screen.getByText('Important message')).toBeInTheDocument();
  });

  it('should render with long message', () => {
    const longMessage = 'This is a very long confirmation message that should still render correctly in the dialog box';
    render(<DialogConfirmation id={1} message={longMessage} onDialogAnswer={vi.fn()} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('should render with empty message', () => {
    render(<DialogConfirmation id={1} message="" onDialogAnswer={vi.fn()} />);

    const messageElement = screen.getByText('Confirmação').parentElement?.parentElement?.querySelector('.dialog-confirmation-message');
    expect(messageElement).toHaveTextContent('');
  });

  it('should handle single number id', () => {
    const handleAnswer = vi.fn();
    render(<DialogConfirmation id={42} message="Test" onDialogAnswer={handleAnswer} />);

    const yesButton = screen.getByRole('button', { name: /sim/i });
    fireEvent.click(yesButton);

    expect(handleAnswer).toHaveBeenCalledWith(true, 42);
  });

  it('should handle array of ids', () => {
    const handleAnswer = vi.fn();
    render(<DialogConfirmation id={[1, 2, 3]} message="Test" onDialogAnswer={handleAnswer} />);

    const yesButton = screen.getByRole('button', { name: /sim/i });
    fireEvent.click(yesButton);

    expect(handleAnswer).toHaveBeenCalledWith(true, [1, 2, 3]);
  });

  it('should handle empty array of ids', () => {
    const handleAnswer = vi.fn();
    render(<DialogConfirmation id={[]} message="Test" onDialogAnswer={handleAnswer} />);

    const noButton = screen.getByRole('button', { name: /não/i });
    fireEvent.click(noButton);

    expect(handleAnswer).toHaveBeenCalledWith(false, []);
  });

  it('should have dialog-confirmation-actions class', () => {
    const { container } = render(<DialogConfirmation id={1} message="Test" onDialogAnswer={vi.fn()} />);

    expect(container.querySelector('.dialog-confirmation-actions')).toBeInTheDocument();
  });

  it('should render both Yes and No buttons', () => {
    render(<DialogConfirmation id={1} message="Test" onDialogAnswer={vi.fn()} />);

    expect(screen.getByRole('button', { name: /sim/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /não/i })).toBeInTheDocument();
  });

  it('should render with special characters in message', () => {
    render(<DialogConfirmation id={1} message="Delete item #123?" onDialogAnswer={vi.fn()} />);

    expect(screen.getByText('Delete item #123?')).toBeInTheDocument();
  });

  it('should render No button with correct text', () => {
    render(<DialogConfirmation id={1} message="Test" onDialogAnswer={vi.fn()} />);

    expect(screen.getByRole('button', { name: /não/i })).toBeInTheDocument();
  });

  it('should render Yes button with correct text', () => {
    render(<DialogConfirmation id={1} message="Test" onDialogAnswer={vi.fn()} />);

    expect(screen.getByRole('button', { name: /sim/i })).toBeInTheDocument();
  });

  it('should render header with icon', () => {
    const { container } = render(<DialogConfirmation id={1} message="Test" onDialogAnswer={vi.fn()} />);

    expect(container.querySelector('.dialog-confirmation-header')).toBeInTheDocument();
    expect(container.querySelector('.dialog-confirmation-icon')).toBeInTheDocument();
  });

  it('should render content section', () => {
    const { container } = render(<DialogConfirmation id={1} message="Test" onDialogAnswer={vi.fn()} />);

    expect(container.querySelector('.dialog-confirmation-content')).toBeInTheDocument();
  });
});
