import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoadingButton from './index';

describe('LoadingButton', () => {
  it('should render with text when not loading', () => {
    render(<LoadingButton loading={false} text="Submit" />);

    expect(screen.getByRole('button')).toHaveTextContent('Submit');
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
  });

  it('should render with loading text and spinner when loading', () => {
    render(<LoadingButton loading={true} text="Submit" loadingText="Submitting..." />);

    expect(screen.getByRole('button')).toHaveTextContent('Submitting...');
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('should use default loading text when not provided', () => {
    render(<LoadingButton loading={true} text="Submit" />);

    expect(screen.getByRole('button')).toHaveTextContent('Loading...');
  });

  it('should be disabled when loading', () => {
    render(<LoadingButton loading={true} text="Submit" />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<LoadingButton loading={false} text="Submit" disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should not fire onClick when loading', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<LoadingButton loading={true} text="Submit" onClick={handleClick} />);

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should fire onClick when not loading', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<LoadingButton loading={false} text="Submit" onClick={handleClick} />);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply primary variant class by default', () => {
    render(<LoadingButton loading={false} text="Submit" />);

    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('should apply inverse variant class when specified', () => {
    render(<LoadingButton loading={false} text="Submit" variant="inverse" />);

    expect(screen.getByRole('button')).toHaveClass('btn-inverse');
  });

  it('should apply custom className', () => {
    render(<LoadingButton loading={false} text="Submit" className="custom-class" />);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should use submit type by default', () => {
    render(<LoadingButton loading={false} text="Submit" />);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should allow custom button type', () => {
    render(<LoadingButton loading={false} text="Click" type="button" />);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadingButton loading={true} text="Submit" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});
