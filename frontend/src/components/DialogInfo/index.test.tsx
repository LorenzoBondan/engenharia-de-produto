import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DialogInfo from './index';

describe('DialogInfo', () => {
  it('should render dialog with message', () => {
    render(<DialogInfo message="Test message" onDialogClose={vi.fn()} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render Fechar button', () => {
    render(<DialogInfo message="Info" onDialogClose={vi.fn()} />);

    expect(screen.getByRole('button', { name: /fechar/i })).toBeInTheDocument();
  });

  it('should have dialog-info-overlay class', () => {
    const { container } = render(<DialogInfo message="Test" onDialogClose={vi.fn()} />);

    expect(container.querySelector('.dialog-info-overlay')).toBeInTheDocument();
  });

  it('should have dialog-info-modal class', () => {
    const { container } = render(<DialogInfo message="Test" onDialogClose={vi.fn()} />);

    expect(container.querySelector('.dialog-info-modal')).toBeInTheDocument();
  });

  it('should render default type as info', () => {
    render(<DialogInfo message="Test" onDialogClose={vi.fn()} />);

    expect(screen.getByText('Informação')).toBeInTheDocument();
  });

  it('should render success type', () => {
    render(<DialogInfo message="Test" onDialogClose={vi.fn()} type="success" />);

    expect(screen.getByText('Sucesso')).toBeInTheDocument();
  });

  it('should render error type', () => {
    render(<DialogInfo message="Test" onDialogClose={vi.fn()} type="error" />);

    expect(screen.getByText('Erro')).toBeInTheDocument();
  });

  it('should call onDialogClose when overlay is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(<DialogInfo message="Test" onDialogClose={handleClose} />);

    const overlay = container.querySelector('.dialog-info-overlay');
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onDialogClose when Fechar button is clicked', () => {
    const handleClose = vi.fn();
    render(<DialogInfo message="Test" onDialogClose={handleClose} />);

    const button = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(button);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onDialogClose when dialog modal is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(<DialogInfo message="Test" onDialogClose={handleClose} />);

    const dialogModal = container.querySelector('.dialog-info-modal');
    if (dialogModal) {
      fireEvent.click(dialogModal);
    }

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should stop propagation when clicking dialog modal', () => {
    const handleClose = vi.fn();
    const { container } = render(<DialogInfo message="Test" onDialogClose={handleClose} />);

    const dialogModal = container.querySelector('.dialog-info-modal');

    if (dialogModal) {
      fireEvent.click(dialogModal);
    }

    // Should not close because stopPropagation prevents bubbling to overlay
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should render message in paragraph element', () => {
    render(<DialogInfo message="Important message" onDialogClose={vi.fn()} />);

    expect(screen.getByText('Important message')).toBeInTheDocument();
  });

  it('should render with long message', () => {
    const longMessage = 'This is a very long message that should still render correctly in the dialog box without any issues';
    render(<DialogInfo message={longMessage} onDialogClose={vi.fn()} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('should render with empty message', () => {
    render(<DialogInfo message="" onDialogClose={vi.fn()} />);

    const messageElement = screen.getByText('Informação').parentElement?.parentElement?.querySelector('.dialog-info-message');
    expect(messageElement).toHaveTextContent('');
  });

  it('should render with special characters in message', () => {
    render(<DialogInfo message="Error: 404 - Not Found!" onDialogClose={vi.fn()} />);

    expect(screen.getByText('Error: 404 - Not Found!')).toBeInTheDocument();
  });

  it('should have dialog-info-actions class on button container', () => {
    const { container } = render(<DialogInfo message="Test" onDialogClose={vi.fn()} />);

    expect(container.querySelector('.dialog-info-actions')).toBeInTheDocument();
  });

  it('should render header with icon', () => {
    const { container } = render(<DialogInfo message="Test" onDialogClose={vi.fn()} />);

    expect(container.querySelector('.dialog-info-header')).toBeInTheDocument();
    expect(container.querySelector('.dialog-info-icon')).toBeInTheDocument();
  });

  it('should render content section', () => {
    const { container } = render(<DialogInfo message="Test" onDialogClose={vi.fn()} />);

    expect(container.querySelector('.dialog-info-content')).toBeInTheDocument();
  });

  it('should apply correct class for success type', () => {
    const { container } = render(<DialogInfo message="Test" onDialogClose={vi.fn()} type="success" />);

    expect(container.querySelector('.dialog-info-header-success')).toBeInTheDocument();
    expect(container.querySelector('.dialog-info-icon-success')).toBeInTheDocument();
  });

  it('should apply correct class for error type', () => {
    const { container } = render(<DialogInfo message="Test" onDialogClose={vi.fn()} type="error" />);

    expect(container.querySelector('.dialog-info-header-error')).toBeInTheDocument();
    expect(container.querySelector('.dialog-info-icon-error')).toBeInTheDocument();
  });

  it('should apply correct class for info type', () => {
    const { container } = render(<DialogInfo message="Test" onDialogClose={vi.fn()} type="info" />);

    expect(container.querySelector('.dialog-info-header-info')).toBeInTheDocument();
    expect(container.querySelector('.dialog-info-icon-info')).toBeInTheDocument();
  });

  it('should render title in h2 element', () => {
    render(<DialogInfo message="Test" onDialogClose={vi.fn()} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Informação');
  });
});
