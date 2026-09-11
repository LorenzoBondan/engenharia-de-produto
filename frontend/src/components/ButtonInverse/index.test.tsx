import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ButtonInverse from './index';

describe('ButtonInverse', () => {
  it('should render button with provided text', () => {
    render(<ButtonInverse text="Cancel" />);

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should have btn and btn-white classes', () => {
    render(<ButtonInverse text="Test" />);

    const button = screen.getByText('Test');
    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('btn-white');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ButtonInverse text="Click Me" onClick={handleClick} />);

    const button = screen.getByText('Click Me');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not throw error when onClick is not provided', () => {
    render(<ButtonInverse text="No Handler" />);

    const button = screen.getByText('No Handler');
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('should call onClick multiple times when clicked multiple times', () => {
    const handleClick = vi.fn();
    render(<ButtonInverse text="Multi Click" onClick={handleClick} />);

    const button = screen.getByText('Multi Click');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('should render with empty text', () => {
    const { container } = render(<ButtonInverse text="" />);

    const button = container.querySelector('.btn');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('should render with special characters in text', () => {
    render(<ButtonInverse text="← Back" />);

    expect(screen.getByText('← Back')).toBeInTheDocument();
  });

  it('should be a div element not a button', () => {
    render(<ButtonInverse text="Test" />);

    const element = screen.getByText('Test');
    expect(element.tagName).toBe('DIV');
  });
});
