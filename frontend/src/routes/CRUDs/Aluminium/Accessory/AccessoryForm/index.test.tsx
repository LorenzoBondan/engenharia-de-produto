import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AccessoryForm from './index';
import * as useAccessoryFormHook from '../../../../../hooks/crud/useAccessoryForm';

// Mock the useAccessoryForm hook
vi.mock('../../../../../hooks/crud/useAccessoryForm');

describe('AccessoryForm', () => {
  const mockFormData = {
    descricao: {
      id: 'descricao',
      name: 'descricao',
      type: 'text',
      placeholder: 'Descrição',
      value: '',
      message: '',
      dirty: 'false',
      invalid: 'false',
    },
    cor: {
      id: 'cor',
      name: 'cor',
      type: 'select',
      value: null,
      message: '',
      dirty: 'false',
      invalid: 'false',
    },
    valor: {
      id: 'valor',
      name: 'valor',
      type: 'number',
      placeholder: 'Valor',
      value: '',
      message: '',
      dirty: 'false',
      invalid: 'false',
    },
    altura: {
      id: 'altura',
      name: 'altura',
      type: 'number',
      placeholder: 'Altura',
      value: '',
      message: '',
      dirty: 'false',
      invalid: 'false',
    },
    largura: {
      id: 'largura',
      name: 'largura',
      type: 'number',
      placeholder: 'Largura',
      value: '',
      message: '',
      dirty: 'false',
      invalid: 'false',
    },
    espessura: {
      id: 'espessura',
      name: 'espessura',
      type: 'number',
      placeholder: 'Espessura',
      value: '',
      message: '',
      dirty: 'false',
      invalid: 'false',
    },
  };

  const mockCores = [
    { codigo: 1, descricao: 'Red', hexa: '#FF0000', situacao: 'ATIVO' as const },
    { codigo: 2, descricao: 'Blue', hexa: '#0000FF', situacao: 'ATIVO' as const },
  ];

  const mockUseAccessoryForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    cores: mockCores,
    dateTimeStart: '2024-01-01',
    handleDateTimeStartChange: vi.fn(),
    isEditing: false,
    error: null,
    submitSuccess: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAccessoryFormHook.useAccessoryForm).mockReturnValue(mockUseAccessoryForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render accessory form', () => {
    renderWithRouter(<AccessoryForm />);

    expect(screen.getByRole('heading', { name: /acessório/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descrição')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Valor')).toBeInTheDocument();
  });

  it('should render all required form fields', () => {
    renderWithRouter(<AccessoryForm />);

    expect(screen.getByPlaceholderText('Descrição')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Valor')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Altura')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Largura')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Espessura')).toBeInTheDocument();
  });

  it('should render submit and cancel buttons', () => {
    renderWithRouter(<AccessoryForm />);

    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AccessoryForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseAccessoryForm.handleSubmit).toHaveBeenCalled();
  });

  it('should call handleInputChange when description is typed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AccessoryForm />);

    const descricaoInput = screen.getByPlaceholderText('Descrição');
    await user.type(descricaoInput, 'Test Description');

    expect(mockUseAccessoryForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleInputChange when valor is typed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AccessoryForm />);

    const valorInput = screen.getByPlaceholderText('Valor');
    await user.type(valorInput, '100');

    expect(mockUseAccessoryForm.handleInputChange).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useAccessoryFormHook.useAccessoryForm).mockReturnValue({
      ...mockUseAccessoryForm,
      loading: true,
    });

    renderWithRouter(<AccessoryForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('should display validation error for description field', () => {
    vi.mocked(useAccessoryFormHook.useAccessoryForm).mockReturnValue({
      ...mockUseAccessoryForm,
      formData: {
        ...mockFormData,
        descricao: {
          ...mockFormData.descricao,
          message: 'Campo obrigatório',
          invalid: 'true',
        },
      },
    });

    renderWithRouter(<AccessoryForm />);

    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('should have cancel link to accessories list', () => {
    renderWithRouter(<AccessoryForm />);

    const cancelLink = screen.getByText('Cancelar').closest('a');
    expect(cancelLink).toHaveAttribute('href', '/accessories');
  });

  it('should render required field labels', () => {
    renderWithRouter(<AccessoryForm />);

    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Cor')).toBeInTheDocument();
    expect(screen.getByText('Valor (R$)')).toBeInTheDocument();
  });

  it('should call handleTurnDirty when description field loses focus', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AccessoryForm />);

    const descricaoInput = screen.getByPlaceholderText('Descrição');
    await user.click(descricaoInput);
    await user.tab();

    await waitFor(() => {
      expect(mockUseAccessoryForm.handleTurnDirty).toHaveBeenCalled();
    });
  });

  it('should render date picker for implantacao field', () => {
    const { container } = renderWithRouter(<AccessoryForm />);

    const datePicker = container.querySelector('#implantacao');
    expect(datePicker).toBeInTheDocument();
  });

  it('should render main element', () => {
    renderWithRouter(<AccessoryForm />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should have proper form structure', () => {
    const { container } = renderWithRouter(<AccessoryForm />);

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('card', 'form');
  });
});
