import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SonForm from './index';
import * as useSonFormHook from '../../../../../hooks/crud/useSonForm';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ sonId: 'create' }),
  };
});

// Mock the useSonForm hook
vi.mock('../../../../../hooks/crud/useSonForm');

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

describe('SonForm', () => {
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
    valor: {
      name: 'valor',
      value: null,
      dirty: 'false',
      message: 'Valor não pode ser negativo',
      id: 'valor',
      type: 'number',
      placeholder: 'Valor',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
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
    cor: {
      name: 'cor',
      value: null,
      dirty: 'false',
      message: 'Cor é obrigatória',
      id: 'cor',
      type: 'select',
      placeholder: 'Cor',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
    pai: {
      name: 'pai',
      value: null,
      dirty: 'false',
      message: '',
      id: 'pai',
      type: 'select',
      placeholder: 'Pai',
      invalid: 'false'
    },
    roteiro: {
      name: 'roteiro',
      value: null,
      dirty: 'false',
      message: '',
      id: 'roteiro',
      type: 'select',
      placeholder: 'Roteiro',
      invalid: 'false'
    },
    tipo: {
      name: 'tipo',
      value: null,
      dirty: 'false',
      message: 'Tipo de Filho é obrigatório',
      id: 'tipo',
      type: 'select',
      placeholder: 'Tipo',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
  };

  const mockCores = [
    { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
    { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
  ];

  const mockPais = [
    {
      codigo: 1,
      descricao: 'Pai A',
      modelo: { codigo: 1, descricao: 'Modelo A', situacao: 'ATIVO' as const },
      categoriaComponente: { codigo: 1, descricao: 'Categoria A', situacao: 'ATIVO' as const },
      bordasComprimento: 2,
      bordasLargura: 2,
      numeroCantoneiras: 4,
      tntUmaFace: false,
      plasticoAcima: false,
      plasticoAdicional: 0,
      larguraPlastico: 0,
      faces: 2,
      especial: false,
      tipoPintura: 'ACETINADA' as const,
      situacao: 'ATIVO' as const,
      filhos: [],
    },
    {
      codigo: 2,
      descricao: 'Pai B',
      modelo: { codigo: 2, descricao: 'Modelo B', situacao: 'ATIVO' as const },
      categoriaComponente: { codigo: 2, descricao: 'Categoria B', situacao: 'ATIVO' as const },
      bordasComprimento: 2,
      bordasLargura: 2,
      numeroCantoneiras: 4,
      tntUmaFace: false,
      plasticoAcima: true,
      plasticoAdicional: 10,
      larguraPlastico: 50,
      faces: 2,
      especial: false,
      tipoPintura: 'ALTO_BRILHO' as const,
      situacao: 'ATIVO' as const,
      filhos: [],
    },
  ];

  const mockRoteiros = [
    {
      codigo: 1,
      descricao: 'Roteiro 1',
      implantacao: new Date('2024-01-01'),
      dataFinal: new Date('2024-12-31'),
      valor: 100.0,
      situacao: 'ATIVO' as const,
      roteiroMaquinas: [],
    },
    {
      codigo: 2,
      descricao: 'Roteiro 2',
      implantacao: new Date('2024-02-01'),
      dataFinal: new Date('2024-11-30'),
      valor: 150.0,
      situacao: 'ATIVO' as const,
      roteiroMaquinas: [],
    },
  ];

  const mockTipoFilhoOptions: Array<{
    value: 'MDP' | 'MDF' | 'ALUMINIO' | 'FUNDO';
    label: 'MDP' | 'MDF' | 'Alumínio' | 'Fundo';
  }> = [
    { label: 'MDP', value: 'MDP' },
    { label: 'MDF', value: 'MDF' },
  ];

  const mockUseSonForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    cores: mockCores,
    pais: mockPais,
    roteiros: mockRoteiros,
    tipoFilhoOptions: mockTipoFilhoOptions,
    dateTimeStart: '2024-01-01',
    handleDateTimeStartChange: vi.fn(),
    isEditing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSonFormHook.useSonForm).mockReturnValue(mockUseSonForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<SonForm />);

    expect(screen.getByText('Filho')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Pai')).toBeInTheDocument();
    expect(screen.getByText('Altura (mm)')).toBeInTheDocument();
    expect(screen.getByText('Largura (mm)')).toBeInTheDocument();
    expect(screen.getByText('Espessura (mm)')).toBeInTheDocument();
    expect(screen.getByText('Cor')).toBeInTheDocument();
    expect(screen.getByText('Roteiro')).toBeInTheDocument();
    expect(screen.getByText('Valor (R$)')).toBeInTheDocument();
    expect(screen.getByText('Implantação')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Filho')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonForm />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Test Description');

    expect(mockUseSonForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseSonForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useSonFormHook.useSonForm).mockReturnValue({
      ...mockUseSonForm,
      loading: true,
    });

    renderWithRouter(<SonForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation errors', () => {
    const formDataWithErrors = {
      ...mockFormData,
      descricao: { ...mockFormData.descricao, message: 'Descrição é obrigatória' },
      altura: { ...mockFormData.altura, message: 'Altura inválida' },
    };

    vi.mocked(useSonFormHook.useSonForm).mockReturnValue({
      ...mockUseSonForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<SonForm />);

    expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('Altura inválida')).toBeInTheDocument();
  });

  it('should have cancel button that links to son list', () => {
    renderWithRouter(<SonForm />);

    const cancelLink = screen.getByText('Cancelar').closest('a');
    expect(cancelLink).toHaveAttribute('href', '/sons');
  });

  it('should call handleTurnDirty when field is focused', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonForm />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);

    expect(mockUseSonForm.handleTurnDirty).toHaveBeenCalled();
    });
  });

  it('should render date picker for implantacao field', () => {
    renderWithRouter(<SonForm />);

    const dateInput = screen.getByDisplayValue('2024-01-01');
    expect(dateInput).toBeInTheDocument();
  });

  it('should call handleDateTimeStartChange when date changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonForm />);

    const dateInput = screen.getByDisplayValue('2024-01-01');
    await user.clear(dateInput);
    await user.type(dateInput, '2024-12-31');

    expect(mockUseSonForm.handleDateTimeStartChange).toHaveBeenCalled();
  });

  it('should render dimension fields for altura, largura, and espessura', () => {
    renderWithRouter(<SonForm />);

    expect(screen.getByText('Altura (mm)')).toBeInTheDocument();
    expect(screen.getByText('Largura (mm)')).toBeInTheDocument();
    expect(screen.getByText('Espessura (mm)')).toBeInTheDocument();
  });
});
