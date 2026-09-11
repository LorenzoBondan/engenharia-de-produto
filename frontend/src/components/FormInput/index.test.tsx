import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormInput from './index';

describe('FormInput', () => {
  it('should render input element', () => {
    render(<FormInput name="testField" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should pass through input props', () => {
    render(
      <FormInput
        name="email"
        type="email"
        placeholder="Enter email"
        onTurnDirty={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
  });

  it('should have default invalid="false" data attribute', () => {
    render(<FormInput name="field" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-invalid', 'false');
  });

  it('should have default dirty="false" data attribute', () => {
    render(<FormInput name="field" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-dirty', 'false');
  });

  it('should set invalid data attribute when provided', () => {
    render(<FormInput name="field" invalid="true" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-invalid', 'true');
  });

  it('should set dirty data attribute when provided', () => {
    render(<FormInput name="field" dirty="true" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-dirty', 'true');
  });

  it('should call onTurnDirty with field name on blur', () => {
    const handleTurnDirty = vi.fn();
    render(<FormInput name="username" onTurnDirty={handleTurnDirty} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(handleTurnDirty).toHaveBeenCalledWith('username');
    expect(handleTurnDirty).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple blur events', () => {
    const handleTurnDirty = vi.fn();
    render(<FormInput name="field" onTurnDirty={handleTurnDirty} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);
    fireEvent.blur(input);
    fireEvent.blur(input);

    expect(handleTurnDirty).toHaveBeenCalledTimes(3);
  });

  it('should not pass validation prop to DOM', () => {
    const validation = vi.fn();
    render(<FormInput name="field" validation={validation} onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('validation');
  });

  it('should handle value changes', () => {
    render(<FormInput name="field" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(input.value).toBe('test value');
  });

  it('should support disabled attribute', () => {
    render(<FormInput name="field" disabled onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should support required attribute', () => {
    render(<FormInput name="field" required onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('should support maxLength attribute', () => {
    render(<FormInput name="field" maxLength={50} onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('should support className prop', () => {
    render(<FormInput name="field" className="custom-input" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('should handle number input type', () => {
    render(<FormInput name="age" type="number" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should handle password input type', () => {
    render(<FormInput name="password" type="password" onTurnDirty={vi.fn()} />);

    const input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it('should combine invalid and dirty states', () => {
    render(<FormInput name="field" invalid="true" dirty="true" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-invalid', 'true');
    expect(input).toHaveAttribute('data-dirty', 'true');
  });

  it('should support defaultValue', () => {
    render(<FormInput name="field" defaultValue="initial" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial');
  });

  it('should support autoComplete attribute', () => {
    render(<FormInput name="email" autoComplete="email" onTurnDirty={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });
});
