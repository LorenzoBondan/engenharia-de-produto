import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AriaLiveRegion from './index';

describe('AriaLiveRegion', () => {
  it('should render with message', () => {
    render(<AriaLiveRegion message="Loading data..." mode="polite" />);

    const region = screen.getByRole('status');
    expect(region).toHaveTextContent('Loading data...');
  });

  it('should have polite aria-live attribute', () => {
    render(<AriaLiveRegion message="Processing..." mode="polite" />);

    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });

  it('should have assertive aria-live attribute', () => {
    render(<AriaLiveRegion message="Error occurred!" mode="assertive" />);

    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'assertive');
  });

  it('should have aria-atomic attribute', () => {
    render(<AriaLiveRegion message="Update complete" mode="polite" />);

    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-atomic', 'true');
  });

  it('should have sr-only class for screen readers', () => {
    const { container } = render(<AriaLiveRegion message="Hidden message" mode="polite" />);

    const region = container.querySelector('.sr-only');
    expect(region).toBeInTheDocument();
  });

  it('should have status role', () => {
    render(<AriaLiveRegion message="Status message" mode="polite" />);

    const region = screen.getByRole('status');
    expect(region).toBeInTheDocument();
  });

  it('should update message when prop changes', () => {
    const { rerender } = render(<AriaLiveRegion message="First message" mode="polite" />);

    expect(screen.getByRole('status')).toHaveTextContent('First message');

    rerender(<AriaLiveRegion message="Second message" mode="polite" />);

    expect(screen.getByRole('status')).toHaveTextContent('Second message');
  });

  it('should render empty string message', () => {
    render(<AriaLiveRegion message="" mode="polite" />);

    const region = screen.getByRole('status');
    expect(region).toHaveTextContent('');
  });

  it('should handle mode change from polite to assertive', () => {
    const { rerender } = render(<AriaLiveRegion message="Alert" mode="polite" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    rerender(<AriaLiveRegion message="Alert" mode="assertive" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
  });
});
