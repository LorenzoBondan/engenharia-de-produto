import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FormLabel from './index';

describe('FormLabel', () => {
  it('should render label with text', () => {
    render(<FormLabel text="Username" />);

    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should have form-label class', () => {
    render(<FormLabel text="Email" />);

    const label = screen.getByText('Email');
    expect(label).toHaveClass('form-label');
  });

  it('should not show asterisk when isRequired is false', () => {
    render(<FormLabel text="Optional Field" isRequired={false} />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should not show asterisk by default', () => {
    render(<FormLabel text="Default Field" />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('should show asterisk when isRequired is true', () => {
    render(<FormLabel text="Required Field" isRequired={true} />);

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
  });

  it('should have asterisk class on required indicator', () => {
    render(<FormLabel text="Name" isRequired={true} />);

    const asterisk = screen.getByText('*');
    expect(asterisk).toHaveClass('asterisk');
  });

  it('should render text and asterisk together when required', () => {
    render(<FormLabel text="Password" isRequired={true} />);

    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should be a label element', () => {
    render(<FormLabel text="Test" />);

    const label = screen.getByText('Test');
    expect(label.tagName).toBe('LABEL');
  });

  it('should handle empty text', () => {
    render(<FormLabel text="" />);

    const label = document.querySelector('.form-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('');
  });

  it('should handle special characters in text', () => {
    render(<FormLabel text="Email Address (optional)" />);

    expect(screen.getByText('Email Address (optional)')).toBeInTheDocument();
  });

  it('should handle long text', () => {
    const longText = 'This is a very long label text that should still render correctly';
    render(<FormLabel text={longText} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('should handle numbers in text', () => {
    render(<FormLabel text="Field 123" />);

    expect(screen.getByText('Field 123')).toBeInTheDocument();
  });

  it('should asterisk be a span element when required', () => {
    render(<FormLabel text="Test" isRequired={true} />);

    const asterisk = screen.getByText('*');
    expect(asterisk.tagName).toBe('SPAN');
  });
});
