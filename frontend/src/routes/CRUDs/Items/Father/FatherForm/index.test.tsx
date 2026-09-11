import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import FatherForm from './index';
import * as useFatherFormHook from '../../../../../hooks/crud/useFatherForm';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ fatherId: 'create' }),
  };
});

// Mock the useFatherForm hook
vi.mock('../../../../../hooks/crud/useFatherForm');

describe('FatherForm', () => {
  const mockFormData = {
    modelo: {
      name: 'modelo',
      value: null,
      dirty: 'false',
      message: 'modelo é obrigatório',
      id: 'modelo',
      type: 'select',
      placeholder: 'Modelo',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
    categoriaComponente: {
      name: 'categoriaComponente',
      value: null,
      dirty: 'false',
      message: 'Categoria Componente é obrigatória',
      id: 'categoriaComponente',
      type: 'select',
      placeholder: 'Categoria Componente',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
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
    bordasComprimento: {
      name: 'bordasComprimento',
      value: null,
      dirty: 'false',
      message: 'Bordas no Comprimento não pode ser negativo',
      id: 'bordasComprimento',
      type: 'number',
      placeholder: 'Bordas no Comprimento',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
    bordasLargura: {
      name: 'bordasLargura',
      value: null,
      dirty: 'false',
      message: 'Bordas na Largura não pode ser negativo',
      id: 'bordasLargura',
      type: 'number',
      placeholder: 'Bordas na Largura',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
    numeroCantoneiras: {
      name: 'numeroCantoneiras',
      value: null,
      dirty: 'false',
      message: 'Número de Cantoneiras não pode ser negativo',
      id: 'numeroCantoneiras',
      type: 'number',
      placeholder: 'Número de Cantoneiras',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
    tntUmaFace: {
      name: 'tntUmaFace',
      value: null,
      dirty: 'false',
      message: '',
      id: 'tntUmaFace',
      type: 'boolean',
      placeholder: 'Tnt uma Face',
      invalid: 'false'
    },
    plasticoAcima: {
      id: 'plasticoAcima',
      name: 'plasticoAcima',
      value: null,
      dirty: 'false',
      message: '',
      type: 'boolean',
      placeholder: 'Plástico Acima',
      invalid: 'false'
    },
    plasticoAdicional: {
      name: 'plasticoAdicional',
      value: null,
      dirty: 'false',
      message: 'Plástico Adicional não pode ser negativo',
      id: 'plasticoAdicional',
      type: 'number',
      placeholder: 'Plástico Adicional',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
    larguraPlastico: {
      name: 'larguraPlastico',
      value: null,
      dirty: 'false',
      message: 'Largura Plástico não pode ser negativo',
      id: 'larguraPlastico',
      type: 'number',
      placeholder: 'Largura Plástico',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
    faces: {
      name: 'faces',
      value: null,
      dirty: 'false',
      message: 'Faces não pode ser negativo',
      id: 'faces',
      type: 'number',
      placeholder: 'Faces',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
    especial: {
      id: 'especial',
      name: 'especial',
      value: null,
      dirty: 'false',
      message: '',
      type: 'boolean',
      placeholder: 'Especial',
      invalid: 'false'
    },
    tipoPintura: {
      name: 'tipoPintura',
      value: null,
      dirty: 'false',
      message: 'Tipo de Pintura é obrigatório',
      id: 'tipoPintura',
      type: 'select',
      placeholder: 'Tipo de Pintura',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
  };

  const mockModelos = [
    { codigo: 1, descricao: 'Modelo A', situacao: 'ATIVO' as const },
    { codigo: 2, descricao: 'Modelo B', situacao: 'ATIVO' as const },
  ];

  const mockCategoriaComponentes = [
    { codigo: 1, descricao: 'Categoria A', situacao: 'ATIVO' as const },
    { codigo: 2, descricao: 'Categoria B', situacao: 'ATIVO' as const },
  ];

  const mockTipoPinturaOptions: Array<{
    value: 'ACETINADA' | 'ALTO_BRILHO' | 'ACETINADA_VIDRO';
    label: 'Acetinada' | 'Alto Brilho' | 'Acetinada Vidro';
  }> = [
    { label: 'Acetinada', value: 'ACETINADA' },
    { label: 'Alto Brilho', value: 'ALTO_BRILHO' },
  ];

  const mockUseFatherForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    modelos: mockModelos,
    categoriaComponentes: mockCategoriaComponentes,
    tipoPinturaOptions: mockTipoPinturaOptions,
    isEditing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFatherFormHook.useFatherForm).mockReturnValue(mockUseFatherForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<FatherForm />);

    expect(screen.getByText('Pai')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Bordas Comprimento')).toBeInTheDocument();
    expect(screen.getByText('Bordas Largura')).toBeInTheDocument();
    expect(screen.getByText('Número Cantoneiras')).toBeInTheDocument();
    expect(screen.getByText('Plástico Adicional')).toBeInTheDocument();
    expect(screen.getByText('Largura Plastico')).toBeInTheDocument();
    expect(screen.getByText('Faces')).toBeInTheDocument();
    expect(screen.getByText('Plástico Acima')).toBeInTheDocument();
    expect(screen.getByText('Especial')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FatherForm />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Test Description');

    expect(mockUseFatherForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FatherForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseFatherForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useFatherFormHook.useFatherForm).mockReturnValue({
      ...mockUseFatherForm,
      loading: true,
    });

    renderWithRouter(<FatherForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation errors', () => {
    const formDataWithErrors = {
      ...mockFormData,
      descricao: { ...mockFormData.descricao, message: 'Descrição é obrigatória' },
      modelo: { ...mockFormData.modelo, message: 'Modelo é obrigatório' },
    };

    vi.mocked(useFatherFormHook.useFatherForm).mockReturnValue({
      ...mockUseFatherForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<FatherForm />);

    expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('Modelo é obrigatório')).toBeInTheDocument();
  });

  it('should have cancel button that links to father list', () => {
    renderWithRouter(<FatherForm />);

    const cancelLink = screen.getByText('Cancelar').closest('a');
    expect(cancelLink).toHaveAttribute('href', '/fathers');
  });

  it('should handle checkbox changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FatherForm />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(mockUseFatherForm.setFormData).toHaveBeenCalled();
  });

  it('should render checkboxes with correct initial values', () => {
    renderWithRouter(<FatherForm />);

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];

    expect(checkboxes[0].checked).toBe(false);
    expect(checkboxes[1].checked).toBe(false);
  });

  it('should display checked checkboxes when values are true', () => {
    const formDataWithCheckedBoxes = {
      ...mockFormData,
      plasticoAcima: { ...mockFormData.plasticoAcima, value: true },
      especial: { ...mockFormData.especial, value: true },
    };

    vi.mocked(useFatherFormHook.useFatherForm).mockReturnValue({
      ...mockUseFatherForm,
      formData: formDataWithCheckedBoxes,
    });

    renderWithRouter(<FatherForm />);

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];

    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(true);
  });
});
