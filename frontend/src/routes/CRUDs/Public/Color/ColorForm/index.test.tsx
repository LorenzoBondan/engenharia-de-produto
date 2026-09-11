import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ColorForm from './index';
import * as useColorFormHook from '../../../../../hooks/crud/useColorForm';

vi.mock('../../../../../hooks/crud/useColorForm');

describe('ColorForm', () => {
  const mockFormData = {
    descricao: {
      name: 'descricao',
      value: '',
      dirty: 'false',
      message: 'Descrição deve ter entre 3 e 50 caracteres',
      id: 'descricao',
      type: 'text',
      placeholder: 'Descrição',
      validation: (value: unknown) => /^.{3,50}$/.test(value as string),
      invalid: 'false'
    },
    hexa: {
      name: 'hexa',
      value: '',
      dirty: 'false',
      message: 'Código hexadecimal é obrigatório',
      id: 'hexa',
      type: 'text',
      placeholder: 'Hexa',
      validation: (value: unknown) => value !== null && value !== '',
      invalid: 'false'
    },
  };

  const mockUseColorForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    isEditing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useColorFormHook.useColorForm).mockReturnValue(mockUseColorForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<ColorForm />);

    expect(screen.getByRole('heading', { name: 'Cor' })).toBeInTheDocument();
    expect(screen.getAllByText('Descrição').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hexa').length).toBeGreaterThan(0);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ColorForm />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Test');

    expect(mockUseColorForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ColorForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseColorForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useColorFormHook.useColorForm).mockReturnValue({
      ...mockUseColorForm,
      loading: true,
    });

    renderWithRouter(<ColorForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation messages', () => {
    const formDataWithErrors = {
      ...mockFormData,
      descricao: { ...mockFormData.descricao, invalid: 'true' },
    };

    vi.mocked(useColorFormHook.useColorForm).mockReturnValue({
      ...mockUseColorForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<ColorForm />);

    expect(screen.getByText('Descrição deve ter entre 3 e 50 caracteres')).toBeInTheDocument();
  });

  it('should have cancel link pointing to /colors', () => {
    renderWithRouter(<ColorForm />);

    const cancelButton = screen.getByText('Cancelar');
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/colors');
  });
});
