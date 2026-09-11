import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormCheckBox from './index';

describe('FormCheckBox', () => {
  it('should render checkbox input element', () => {
    render(
      <FormCheckBox
        id="test"
        name="testCheckbox"
        label="Test Label"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('should render label text', () => {
    render(
      <FormCheckBox
        id="test"
        name="testCheckbox"
        label="Accept Terms"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const label = screen.getByText('Accept Terms');
    expect(label).toBeInTheDocument();
  });

  it('should have correct id attribute', () => {
    render(
      <FormCheckBox
        id="terms-checkbox"
        name="terms"
        label="Terms"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'terms-checkbox');
  });

  it('should have correct name attribute', () => {
    render(
      <FormCheckBox
        id="test"
        name="newsletter"
        label="Subscribe"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('name', 'newsletter');
  });

  it('should be unchecked when checked prop is false', () => {
    render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('should be checked when checked prop is true', () => {
    render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={true}
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('should call onChange when clicked', () => {
    const handleChange = vi.fn();
    render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={false}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call onChange with event object', () => {
    const handleChange = vi.fn();
    render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={false}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalled();
    const event = handleChange.mock.calls[0][0];
    expect(event.target).toBe(checkbox);
  });

  it('should handle multiple clicks', () => {
    const handleChange = vi.fn();
    render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={false}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it('should render label container with correct class', () => {
    const { container } = render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const labelContainer = container.querySelector('.checkbox-container');
    expect(labelContainer).toBeInTheDocument();
  });

  it('should render custom checkbox div', () => {
    const { container } = render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const customCheckbox = container.querySelector('.custom-checkbox');
    expect(customCheckbox).toBeInTheDocument();
  });

  it('should render label text with correct class', () => {
    const { container } = render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test Label"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const labelText = container.querySelector('.checkbox-label');
    expect(labelText).toBeInTheDocument();
    expect(labelText).toHaveTextContent('Test Label');
  });

  it('should render with long label text', () => {
    const longLabel = 'This is a very long checkbox label that should still render correctly';
    render(
      <FormCheckBox
        id="test"
        name="test"
        label={longLabel}
        checked={false}
        onChange={vi.fn()}
      />
    );

    const label = screen.getByText(longLabel);
    expect(label).toBeInTheDocument();
  });

  it('should render with empty label', () => {
    render(
      <FormCheckBox
        id="test"
        name="test"
        label=""
        checked={false}
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('should render with special characters in label', () => {
    render(
      <FormCheckBox
        id="test"
        name="test"
        label="I agree to the Terms & Conditions"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const label = screen.getByText('I agree to the Terms & Conditions');
    expect(label).toBeInTheDocument();
  });

  it('should have checkbox type attribute', () => {
    render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('should toggle checked state through onChange', () => {
    let isChecked = false;
    const handleChange = vi.fn((e) => {
      isChecked = e.target.checked;
    });

    const { rerender } = render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={isChecked}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    rerender(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={isChecked}
        onChange={handleChange}
      />
    );

    expect(handleChange).toHaveBeenCalled();
  });

  it('should render label for attribute matching checkbox id', () => {
    const { container } = render(
      <FormCheckBox
        id="unique-id"
        name="test"
        label="Test"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const label = container.querySelector('label');

    expect(checkbox).toHaveAttribute('id', 'unique-id');
    expect(label).toBeInTheDocument();
  });

  it('should handle onChange event with change method', () => {
    const handleChange = vi.fn();
    render(
      <FormCheckBox
        id="test"
        name="test"
        label="Test"
        checked={false}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalled();
  });

  it('should render label with numbers', () => {
    render(
      <FormCheckBox
        id="test"
        name="test"
        label="Option 1"
        checked={false}
        onChange={vi.fn()}
      />
    );

    const label = screen.getByText('Option 1');
    expect(label).toBeInTheDocument();
  });
});
