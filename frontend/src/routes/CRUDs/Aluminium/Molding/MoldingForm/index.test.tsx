import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MoldingForm from './index';
import * as useMoldingFormHook from '../../../../../hooks/crud/useMoldingForm';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ moldingId: 'create' }),
  };
});

// Mock the useMoldingForm hook
vi.mock('../../../../../hooks/crud/useMoldingForm');

// Mock Flatpickr
vi.mock('react-flatpickr', () => ({
  default: ({ value, onChange, id, name, className }: any) => (
    <input
      id={id}
      name={name}
      className={className}
      value={value}
      onChange={(e) => onChange([new Date(e.target.value)])}
      type="date"
    />
  ),
}));

describe('MoldingForm', () => {
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
    tipoMaterial: {
      name: 'tipoMaterial',
      value: null,
      dirty: 'false',
      message: 'Tipo de Material é obrigatório',
      id: 'tipoMaterial',
      type: 'select',
      placeholder: 'Tipo de Material',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
    valor: {
      name: 'valor',
      value: null,
      dirty: 'false',
      message: 'Valor não pode ser negativo',
      id: 'valor',
      type: 'number',
      placeholder: 'Valor',
      validation: (value: unknown) => value === '' || value === null || Number(value) >= 0,
      invalid: 'false'
    },
    porcentagemPerda: {
      name: 'porcentagemPerda',
      value: null,
      dirty: 'false',
      message: 'Porcentagem de perda não pode ser negativa',
      id: 'porcentagemPerda',
      type: 'number',
      placeholder: 'Porcentagem de perda',
      validation: (value: unknown) => value === '' || value === null || Number(value) >= 0,
      invalid: 'false'
    },
    implantacao: {
      name: 'implantacao',
      value: '',
      dirty: 'false',
      message: '',
      id: 'implantacao',
      type: 'date',
      placeholder: 'Implantação',
      invalid: 'false'
    },
  };

  const mockTipoMaterialOptions: Array<{
    value: 'BAGUETE' | 'PLASTICO' | 'CHAPA_MDP' | 'CHAPA_MDF' | 'FITA_BORDA' | 'COLA' | 'CANTONEIRA' | 'TNT' | 'POLIETILENO' | 'PINTURA' | 'PINTURA_DE_BORDA_DE_FUNDO' | 'POLIESTER';
    label: 'Chapa MDP' | 'Chapa MDF' | 'Fita Borda' | 'Cola' | 'Cantoneira' | 'Tnt' | 'Polietileno' | 'Plástico' | 'Pintura' | 'Pintura de borda de fundo' | 'Poliéster' | 'Baguete';
  }> = [
    { label: 'Baguete', value: 'BAGUETE' },
    { label: 'Plástico', value: 'PLASTICO' },
  ];

  const mockUseMoldingForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    tipoMaterialOptions: mockTipoMaterialOptions,
    dateTimeStart: '2024-01-01',
    handleDateTimeStartChange: vi.fn(),
    isEditing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMoldingFormHook.useMoldingForm).mockReturnValue(mockUseMoldingForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<MoldingForm />);

    expect(screen.getByText('Baguete')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Valor (R$)')).toBeInTheDocument();
    expect(screen.getByText('Porcentagem de Perda (%)')).toBeInTheDocument();
    expect(screen.getByText('Implantação')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MoldingForm />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Test Description');

    expect(mockUseMoldingForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MoldingForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseMoldingForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useMoldingFormHook.useMoldingForm).mockReturnValue({
      ...mockUseMoldingForm,
      loading: true,
    });

    renderWithRouter(<MoldingForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation errors', () => {
    const formDataWithErrors = {
      ...mockFormData,
      descricao: { ...mockFormData.descricao, message: 'Descrição é obrigatória' },
      valor: { ...mockFormData.valor, message: 'Valor inválido' },
    };

    vi.mocked(useMoldingFormHook.useMoldingForm).mockReturnValue({
      ...mockUseMoldingForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<MoldingForm />);

    expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('Valor inválido')).toBeInTheDocument();
  });

  it('should have cancel button that links to molding list', () => {
    renderWithRouter(<MoldingForm />);

    const cancelLink = screen.getByText('Cancelar').closest('a');
    expect(cancelLink).toHaveAttribute('href', '/moldings');
  });

  it('should call handleTurnDirty when field is focused', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MoldingForm />);

    const descricaoInput = screen.getByPlaceholderText('Descrição');
    await user.click(descricaoInput);
    await user.tab();

    await waitFor(() => {
      expect(mockUseMoldingForm.handleTurnDirty).toHaveBeenCalledWith('descricao');
    });
  });

  it('should render date picker for implantacao field', () => {
    renderWithRouter(<MoldingForm />);

    const dateInput = screen.getByDisplayValue('2024-01-01');
    expect(dateInput).toBeInTheDocument();
  });

  it('should call handleDateTimeStartChange when date changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MoldingForm />);

    const dateInput = screen.getByDisplayValue('2024-01-01');
    await user.clear(dateInput);
    await user.type(dateInput, '2024-12-31');

    expect(mockUseMoldingForm.handleDateTimeStartChange).toHaveBeenCalled();
  });
});
