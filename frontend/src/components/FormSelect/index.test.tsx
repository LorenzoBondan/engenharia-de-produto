import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormSelect from './index';

describe('FormSelect', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  it('should render FormSelect component', () => {
    const { container } = render(
      <FormSelect name="testSelect" options={mockOptions} onTurnDirty={vi.fn()} />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with default placeholder', () => {
    render(<FormSelect name="select" options={mockOptions} onTurnDirty={vi.fn()} />);

    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(
      <FormSelect
        name="select"
        options={mockOptions}
        placeholder="Choose an option"
        onTurnDirty={vi.fn()}
      />
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('should have default invalid="false" data attribute', () => {
    const { container } = render(
      <FormSelect name="select" options={mockOptions} onTurnDirty={vi.fn()} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-invalid', 'false');
  });

  it('should have default dirty="false" data attribute', () => {
    const { container } = render(
      <FormSelect name="select" options={mockOptions} onTurnDirty={vi.fn()} />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-dirty', 'false');
  });

  it('should set invalid data attribute when provided', () => {
    const { container } = render(
      <FormSelect
        name="select"
        options={mockOptions}
        invalid="true"
        onTurnDirty={vi.fn()}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-invalid', 'true');
  });

  it('should set dirty data attribute when provided', () => {
    const { container } = render(
      <FormSelect
        name="select"
        options={mockOptions}
        dirty="true"
        onTurnDirty={vi.fn()}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-dirty', 'true');
  });

  it('should apply custom className to wrapper', () => {
    const { container } = render(
      <FormSelect
        name="select"
        options={mockOptions}
        className="custom-select"
        onTurnDirty={vi.fn()}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-select');
  });

  it('should call onTurnDirty with field name on blur', () => {
    const handleTurnDirty = vi.fn();
    const { container } = render(
      <FormSelect name="category" options={mockOptions} onTurnDirty={handleTurnDirty} />
    );

    const input = container.querySelector('input');
    if (input) {
      fireEvent.blur(input);
      expect(handleTurnDirty).toHaveBeenCalledWith('category');
    }
  });

  it('should not pass validation prop to Select', () => {
    const validation = vi.fn();
    const { container } = render(
      <FormSelect
        name="select"
        options={mockOptions}
        validation={validation}
        onTurnDirty={vi.fn()}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveAttribute('validation');
  });

  it('should pass through select props', () => {
    const { container } = render(
      <FormSelect
        name="select"
        options={mockOptions}
        isDisabled={true}
        onTurnDirty={vi.fn()}
      />
    );

    // When disabled, the input has disabled attribute
    const input = container.querySelector('input[disabled]');
    expect(input).toBeInTheDocument();
  });

  it('should render options', () => {
    render(<FormSelect name="select" options={mockOptions} onTurnDirty={vi.fn()} />);

    // Click to open the dropdown
    const input = screen.getByRole('combobox');
    fireEvent.mouseDown(input);

    // Check if options are rendered
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should combine invalid and dirty states', () => {
    const { container } = render(
      <FormSelect
        name="select"
        options={mockOptions}
        invalid="true"
        dirty="true"
        onTurnDirty={vi.fn()}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-invalid', 'true');
    expect(wrapper).toHaveAttribute('data-dirty', 'true');
  });

  it('should handle empty options array', () => {
    render(<FormSelect name="select" options={[]} onTurnDirty={vi.fn()} />);

    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('should support isClearable prop', () => {
    render(
      <FormSelect
        name="select"
        options={mockOptions}
        isClearable={true}
        onTurnDirty={vi.fn()}
      />
    );

    // React Select should render with clearable option
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should support isSearchable prop', () => {
    render(
      <FormSelect
        name="select"
        options={mockOptions}
        isSearchable={false}
        onTurnDirty={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should be wrapped in a div element', () => {
    const { container } = render(
      <FormSelect name="select" options={mockOptions} onTurnDirty={vi.fn()} />
    );

    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});
