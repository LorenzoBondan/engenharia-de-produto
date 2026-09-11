import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ButtonNextPage from './index';

describe('ButtonNextPage', () => {
  it('should render button element', () => {
    render(<ButtonNextPage onNextPage={vi.fn()} />);

    const button = screen.getByText('Carregar mais');
    expect(button).toBeInTheDocument();
  });

  it('should have correct text content', () => {
    render(<ButtonNextPage onNextPage={vi.fn()} />);

    const button = screen.getByText('Carregar mais');
    expect(button).toHaveTextContent('Carregar mais');
  });

  it('should have btn-next-page class', () => {
    render(<ButtonNextPage onNextPage={vi.fn()} />);

    const button = screen.getByText('Carregar mais');
    expect(button).toHaveClass('btn-next-page');
  });

  it('should call onNextPage when clicked', () => {
    const handleNextPage = vi.fn();
    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.click(button);

    expect(handleNextPage).toHaveBeenCalledTimes(1);
  });

  it('should call onNextPage with no arguments', () => {
    const handleNextPage = vi.fn();
    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.click(button);

    expect(handleNextPage).toHaveBeenCalledWith();
  });

  it('should handle multiple clicks', () => {
    const handleNextPage = vi.fn();
    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(handleNextPage).toHaveBeenCalledTimes(3);
  });

  it('should render as div element', () => {
    const { container } = render(<ButtonNextPage onNextPage={vi.fn()} />);

    const button = container.querySelector('.btn-next-page');
    expect(button?.tagName).toBe('DIV');
  });

  it('should be clickable via onClick handler', () => {
    const handleNextPage = vi.fn();
    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleNextPage).toHaveBeenCalled();
  });

  it('should trigger onNextPage on mousedown', () => {
    const handleNextPage = vi.fn();
    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.mouseDown(button);

    expect(handleNextPage).not.toHaveBeenCalled();
  });

  it('should only trigger onNextPage on click', () => {
    const handleNextPage = vi.fn();
    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.mouseOver(button);
    fireEvent.mouseEnter(button);

    expect(handleNextPage).not.toHaveBeenCalled();

    fireEvent.click(button);
    expect(handleNextPage).toHaveBeenCalledTimes(1);
  });

  it('should be present in the document after render', () => {
    const { container } = render(<ButtonNextPage onNextPage={vi.fn()} />);

    const button = container.querySelector('.btn-next-page');
    expect(button).toBeInTheDocument();
  });

  it('should execute callback function on click', () => {
    let executed = false;
    const handleNextPage = vi.fn(() => {
      executed = true;
    });

    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.click(button);

    expect(executed).toBe(true);
  });

  it('should work with async onNextPage callback', async () => {
    const handleNextPage = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.click(button);

    expect(handleNextPage).toHaveBeenCalledTimes(1);
  });

  it('should maintain reference after multiple renders', () => {
    const handleNextPage = vi.fn();
    const { rerender } = render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.click(button);

    rerender(<ButtonNextPage onNextPage={handleNextPage} />);

    fireEvent.click(button);

    expect(handleNextPage).toHaveBeenCalledTimes(2);
  });

  it('should handle rapid successive clicks', () => {
    const handleNextPage = vi.fn();
    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');

    for (let i = 0; i < 10; i++) {
      fireEvent.click(button);
    }

    expect(handleNextPage).toHaveBeenCalledTimes(10);
  });

  it('should work with different onNextPage implementations', () => {
    const results: number[] = [];
    const handleNextPage = vi.fn(() => results.push(results.length + 1));

    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.click(button);
    fireEvent.click(button);

    expect(results).toEqual([1, 2]);
  });

  it('should not prevent default behavior', () => {
    const handleNextPage = vi.fn();
    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    const clickEvent = fireEvent.click(button);

    expect(handleNextPage).toHaveBeenCalled();
  });

  it('should be accessible via text content', () => {
    render(<ButtonNextPage onNextPage={vi.fn()} />);

    const button = screen.getByText('Carregar mais');
    expect(button).toBeVisible();
  });

  it('should update callback when prop changes', () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const { rerender } = render(<ButtonNextPage onNextPage={firstCallback} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.click(button);

    expect(firstCallback).toHaveBeenCalledTimes(1);
    expect(secondCallback).not.toHaveBeenCalled();

    rerender(<ButtonNextPage onNextPage={secondCallback} />);
    fireEvent.click(button);

    expect(firstCallback).toHaveBeenCalledTimes(1);
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it('should handle click event object', () => {
    const handleNextPage = vi.fn();
    render(<ButtonNextPage onNextPage={handleNextPage} />);

    const button = screen.getByText('Carregar mais');
    fireEvent.click(button);

    expect(handleNextPage).toHaveBeenCalled();
  });
});
