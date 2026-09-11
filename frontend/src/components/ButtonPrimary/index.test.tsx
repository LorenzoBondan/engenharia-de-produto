import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ButtonPrimary from './index';

describe('ButtonPrimary', () => {
  it('should render button with provided text', () => {
    render(<ButtonPrimary text="Click Me" />);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should have btn and btn-primary classes', () => {
    render(<ButtonPrimary text="Test" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('btn-primary');
  });

  it('should have type submit', () => {
    render(<ButtonPrimary text="Submit" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render with empty text', () => {
    render(<ButtonPrimary text="" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('should render with long text', () => {
    const longText = 'This is a very long button text that should still render correctly';
    render(<ButtonPrimary text={longText} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(longText);
  });

  it('should render with special characters', () => {
    render(<ButtonPrimary text="Save & Continue →" />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Save & Continue →');
  });

  it('should render with numbers in text', () => {
    render(<ButtonPrimary text="Submit 123" />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Submit 123');
  });
});
