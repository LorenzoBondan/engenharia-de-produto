import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from './index';

describe('ProgressBar', () => {
  it('should render when isAnimating is true', () => {
    render(<ProgressBar isAnimating={true} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('should not render when isAnimating is false', () => {
    render(<ProgressBar isAnimating={false} />);

    const progressBar = screen.queryByRole('progressbar');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(<ProgressBar isAnimating={true} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', 'Loading page');
  });

  it('should apply progress-bar class', () => {
    const { container } = render(<ProgressBar isAnimating={true} />);

    const progressBar = container.querySelector('.progress-bar');
    expect(progressBar).toBeInTheDocument();
  });

  it('should render progress-bar-fill element', () => {
    const { container } = render(<ProgressBar isAnimating={true} />);

    const progressBarFill = container.querySelector('.progress-bar-fill');
    expect(progressBarFill).toBeInTheDocument();
  });

  it('should toggle visibility based on isAnimating prop', () => {
    const { rerender } = render(<ProgressBar isAnimating={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    rerender(<ProgressBar isAnimating={false} />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    rerender(<ProgressBar isAnimating={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
