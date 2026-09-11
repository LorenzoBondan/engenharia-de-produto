import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './index';

describe('SearchBar', () => {
  it('should render search form', () => {
    const { container } = render(<SearchBar onSearch={vi.fn()} />);

    const form = container.querySelector('.search-bar');
    expect(form).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    const submitButton = buttons.find((btn) => btn.textContent === '🔎︎');
    expect(submitButton).toBeInTheDocument();
  });

  it('should render reset button', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    const resetButton = buttons.find((btn) => btn.textContent === '🗙');
    expect(resetButton).toBeInTheDocument();
  });

  it('should have search-bar class', () => {
    const { container } = render(<SearchBar onSearch={vi.fn()} />);

    const form = container.querySelector('.search-bar');
    expect(form).toBeInTheDocument();
  });

  it('should start with empty input value', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('should update input value on change', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test query' } });

    expect(input.value).toBe('test query');
  });

  it('should call onSearch when form is submitted', () => {
    const handleSearch = vi.fn();
    const { container } = render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'search term' } });

    const form = container.querySelector('.search-bar');
    fireEvent.submit(form!);

    expect(handleSearch).toHaveBeenCalledWith('search term');
  });

  it('should prevent default form submission', () => {
    const handleSearch = vi.fn();
    const { container } = render(<SearchBar onSearch={handleSearch} />);

    const form = container.querySelector('.search-bar');
    const submitEvent = fireEvent.submit(form!);

    expect(handleSearch).toHaveBeenCalled();
  });

  it('should call onSearch with current input value on submit', () => {
    const handleSearch = vi.fn();
    const { container } = render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    const form = container.querySelector('.search-bar');
    fireEvent.submit(form!);

    expect(handleSearch).toHaveBeenCalledWith('test');
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it('should clear input when reset button is clicked', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });

    const buttons = screen.getAllByRole('button');
    const resetButton = buttons.find((btn) => btn.textContent === '🗙');
    fireEvent.click(resetButton!);

    expect(input.value).toBe('');
  });

  it('should call onSearch with empty string when reset button is clicked', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    const buttons = screen.getAllByRole('button');
    const resetButton = buttons.find((btn) => btn.textContent === '🗙');
    fireEvent.click(resetButton!);

    expect(handleSearch).toHaveBeenCalledWith('');
  });

  it('should have submit button with type submit', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    const submitButton = buttons.find((btn) => btn.textContent === '🔎︎');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should handle multiple searches', () => {
    const handleSearch = vi.fn();
    const { container } = render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole('textbox');
    const form = container.querySelector('.search-bar');

    fireEvent.change(input, { target: { value: 'first' } });
    fireEvent.submit(form!);

    fireEvent.change(input, { target: { value: 'second' } });
    fireEvent.submit(form!);

    expect(handleSearch).toHaveBeenCalledTimes(2);
    expect(handleSearch).toHaveBeenNthCalledWith(1, 'first');
    expect(handleSearch).toHaveBeenNthCalledWith(2, 'second');
  });

  it('should handle empty string submission', () => {
    const handleSearch = vi.fn();
    const { container } = render(<SearchBar onSearch={handleSearch} />);

    const form = container.querySelector('.search-bar');
    fireEvent.submit(form!);

    expect(handleSearch).toHaveBeenCalledWith('');
  });

  it('should handle search with whitespace', () => {
    const handleSearch = vi.fn();
    const { container } = render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  spaces  ' } });

    const form = container.querySelector('.search-bar');
    fireEvent.submit(form!);

    expect(handleSearch).toHaveBeenCalledWith('  spaces  ');
  });

  it('should handle special characters in search', () => {
    const handleSearch = vi.fn();
    const { container } = render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '@#$%^&*()' } });

    const form = container.querySelector('.search-bar');
    fireEvent.submit(form!);

    expect(handleSearch).toHaveBeenCalledWith('@#$%^&*()');
  });

  it('should update value after reset and new input', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'first' } });

    const buttons = screen.getAllByRole('button');
    const resetButton = buttons.find((btn) => btn.textContent === '🗙');
    fireEvent.click(resetButton!);

    expect(input.value).toBe('');

    fireEvent.change(input, { target: { value: 'second' } });
    expect(input.value).toBe('second');
  });

  it('should submit via submit button click', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'click search' } });

    const buttons = screen.getAllByRole('button');
    const submitButton = buttons.find((btn) => btn.textContent === '🔎︎');
    fireEvent.click(submitButton!);

    expect(handleSearch).toHaveBeenCalledWith('click search');
  });

  it('should handle long search queries', () => {
    const handleSearch = vi.fn();
    const longQuery = 'a'.repeat(200);

    const { container } = render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: longQuery } });

    const form = container.querySelector('.search-bar');
    fireEvent.submit(form!);

    expect(handleSearch).toHaveBeenCalledWith(longQuery);
  });
});
