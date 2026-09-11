import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from './index';

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('includes default aria-label', () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toBeInTheDocument();
  });

  it('accepts custom aria-label prop', () => {
    render(<Spinner aria-label="Loading table data" />);
    const spinner = screen.getByLabelText('Loading table data');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with small size variant', () => {
    render(<Spinner size="small" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner-small');
  });

  it('renders with medium size variant', () => {
    render(<Spinner size="medium" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner-medium');
  });

  it('renders with large size variant', () => {
    render(<Spinner size="large" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner-large');
  });

  it('applies custom color via inline style', () => {
    render(<Spinner color="#FF0000" />);
    const spinner = screen.getByRole('status').firstChild as HTMLElement;
    expect(spinner).toHaveStyle({ borderTopColor: '#FF0000' });
  });

  it('applies additional className prop', () => {
    render(<Spinner className="custom-class" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-class');
  });

  it('respects prefers-reduced-motion through CSS', () => {
    // This test verifies the class is applied; CSS media query is tested manually
    render(<Spinner />);
    const spinner = screen.getByRole('status').firstChild as HTMLElement;
    expect(spinner).toHaveClass('spinner-icon');
  });
});
