import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormTextArea from './index';

describe('FormTextArea', () => {
  it('should render textarea element', () => {
    render(<FormTextArea name="testField" onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('should pass through textarea props', () => {
    render(
      <FormTextArea
        name="description"
        placeholder="Enter description"
        rows={5}
        onTurnDirty={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText('Enter description');
    expect(textarea).toHaveAttribute('name', 'description');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('should have default invalid="false" data attribute', () => {
    render(<FormTextArea name="field" onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('data-invalid', 'false');
  });

  it('should have default dirty="false" data attribute', () => {
    render(<FormTextArea name="field" onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('data-dirty', 'false');
  });

  it('should set invalid data attribute when provided', () => {
    render(<FormTextArea name="field" invalid="true" onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('data-invalid', 'true');
  });

  it('should set dirty data attribute when provided', () => {
    render(<FormTextArea name="field" dirty="true" onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('data-dirty', 'true');
  });

  it('should call onTurnDirty with field name on blur', () => {
    const handleTurnDirty = vi.fn();
    render(<FormTextArea name="comments" onTurnDirty={handleTurnDirty} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.blur(textarea);

    expect(handleTurnDirty).toHaveBeenCalledWith('comments');
    expect(handleTurnDirty).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple blur events', () => {
    const handleTurnDirty = vi.fn();
    render(<FormTextArea name="field" onTurnDirty={handleTurnDirty} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.blur(textarea);
    fireEvent.blur(textarea);
    fireEvent.blur(textarea);

    expect(handleTurnDirty).toHaveBeenCalledTimes(3);
  });

  it('should not pass validation prop to DOM', () => {
    const validation = vi.fn();
    render(<FormTextArea name="field" validation={validation} onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).not.toHaveAttribute('validation');
  });

  it('should handle value changes', () => {
    render(<FormTextArea name="field" onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'test content' } });

    expect(textarea.value).toBe('test content');
  });

  it('should support disabled attribute', () => {
    render(<FormTextArea name="field" disabled onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('should support required attribute', () => {
    render(<FormTextArea name="field" required onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeRequired();
  });

  it('should support maxLength attribute', () => {
    render(<FormTextArea name="field" maxLength={200} onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxLength', '200');
  });

  it('should support className prop', () => {
    render(<FormTextArea name="field" className="custom-textarea" onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-textarea');
  });

  it('should combine invalid and dirty states', () => {
    render(<FormTextArea name="field" invalid="true" dirty="true" onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('data-invalid', 'true');
    expect(textarea).toHaveAttribute('data-dirty', 'true');
  });

  it('should support defaultValue', () => {
    render(<FormTextArea name="field" defaultValue="initial content" onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('initial content');
  });

  it('should handle multiline text', () => {
    const multilineText = 'Line 1\nLine 2\nLine 3';
    render(<FormTextArea name="field" defaultValue={multilineText} onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe(multilineText);
  });

  it('should support cols attribute', () => {
    render(<FormTextArea name="field" cols={50} onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('cols', '50');
  });

  it('should support readOnly attribute', () => {
    render(<FormTextArea name="field" readOnly onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('readOnly');
  });

  it('should support autoFocus attribute', () => {
    render(<FormTextArea name="field" autoFocus onTurnDirty={vi.fn()} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveFocus();
  });
});
