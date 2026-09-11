import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import MeasureForm from './index';
import * as useMeasureFormHook from '../../../../../hooks/crud/useMeasureForm';

vi.mock('../../../../../hooks/crud/useMeasureForm');

describe('MeasureForm', () => {
  const mockFormData = {
    altura: {
      name: 'altura',
      value: null,
      dirty: 'false',
      message: 'Altura não pode ser negativa',
      id: 'altura',
      type: 'number',
      placeholder: 'Altura',
      validation: (value: unknown) => value !== null && Number(value) >= 0,
      invalid: 'false'
    },
    largura: {
      name: 'largura',
      value: null,
      dirty: 'false',
      message: 'Largura não pode ser negativa',
      id: 'largura',
      type: 'number',
      placeholder: 'Largura',
      validation: (value: unknown) => value !== null && Number(value) >= 0,
      invalid: 'false'
    },
    espessura: {
      name: 'espessura',
      value: null,
      dirty: 'false',
      message: 'Espessura não pode ser negativa',
      id: 'espessura',
      type: 'number',
      placeholder: 'Espessura',
      validation: (value: unknown) => value !== null && Number(value) >= 0,
      invalid: 'false'
    },
  };

  const mockUseMeasureForm = {
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
    vi.mocked(useMeasureFormHook.useMeasureForm).mockReturnValue(mockUseMeasureForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<MeasureForm />);

    expect(screen.getByRole('heading', { name: 'Medidas' })).toBeInTheDocument();
    expect(screen.getByText('Altura (mm)')).toBeInTheDocument();
    expect(screen.getByText('Largura (mm)')).toBeInTheDocument();
    expect(screen.getByText('Espessura (mm)')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MeasureForm />);

    const inputs = screen.getAllByRole('spinbutton');
    await user.type(inputs[0], '100');

    expect(mockUseMeasureForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MeasureForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseMeasureForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useMeasureFormHook.useMeasureForm).mockReturnValue({
      ...mockUseMeasureForm,
      loading: true,
    });

    renderWithRouter(<MeasureForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation messages', () => {
    const formDataWithErrors = {
      ...mockFormData,
      altura: { ...mockFormData.altura, invalid: 'true' },
    };

    vi.mocked(useMeasureFormHook.useMeasureForm).mockReturnValue({
      ...mockUseMeasureForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<MeasureForm />);

    expect(screen.getByText('Altura não pode ser negativa')).toBeInTheDocument();
  });

  it('should have cancel link pointing to /measures', () => {
    renderWithRouter(<MeasureForm />);

    const cancelButton = screen.getByText('Cancelar');
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/measures');
  });
});
