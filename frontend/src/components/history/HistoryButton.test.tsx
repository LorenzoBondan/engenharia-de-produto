import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryButton } from './HistoryButton';

describe('HistoryButton', () => {
  describe('button rendering', () => {
    it('should render button with default label', () => {
      const mockOnClick = vi.fn();
      render(<HistoryButton onClick={mockOnClick} />);

      expect(screen.getByText('Visualizar Histórico')).toBeInTheDocument();
    });

    it('should render button with custom label', () => {
      const mockOnClick = vi.fn();
      render(<HistoryButton onClick={mockOnClick} label="Ver Histórico" />);

      expect(screen.getByText('Ver Histórico')).toBeInTheDocument();
    });

    it('should render as a button element', () => {
      const mockOnClick = vi.fn();
      render(<HistoryButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('click handling', () => {
    it('should call onClick when clicked', () => {
      const mockOnClick = vi.fn();
      render(<HistoryButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick multiple times', () => {
      const mockOnClick = vi.fn();
      render(<HistoryButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('keyboard accessibility', () => {
    it('should be focusable', () => {
      const mockOnClick = vi.fn();
      render(<HistoryButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      button.focus();

      expect(document.activeElement).toBe(button);
    });

    it('should activate with Enter key', () => {
      const mockOnClick = vi.fn();
      render(<HistoryButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should activate with Space key', () => {
      const mockOnClick = vi.fn();
      render(<HistoryButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not activate with other keys', () => {
      const mockOnClick = vi.fn();
      render(<HistoryButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'a', code: 'KeyA' });
      fireEvent.keyDown(button, { key: 'Tab', code: 'Tab' });

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('styling', () => {
    it('should have appropriate CSS class', () => {
      const mockOnClick = vi.fn();
      const { container } = render(<HistoryButton onClick={mockOnClick} />);

      const button = container.querySelector('button');
      expect(button?.className).toBeTruthy();
    });
  });
});
