import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import SheetForm from './index';
import * as useSheetFormHook from '../../../../../hooks/crud/useSheetForm';

// Mock react-flatpickr
vi.mock('react-flatpickr', () => ({
  default: (props: any) => (
    <input
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={(e) => props.onChange([new Date(e.target.value)])}
      className={props.className}
      type="date"
    />
  ),
}));

// Mock the useSheetForm hook
vi.mock('../../../../../hooks/crud/useSheetForm');

describe('SheetForm', () => {
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
    espessura: {
      name: 'espessura',
      value: null,
      dirty: 'false',
      message: 'Espessura não pode ser negativa',
      id: 'espessura',
      type: 'number',
      placeholder: 'Espessura',
      validation: (value: unknown) => value === '' || value === null || Number(value) >= 0,
      invalid: 'false'
    },
    faces: {
      name: 'faces',
      value: null,
      dirty: 'false',
      message: 'Faces não pode ser negativa',
      id: 'faces',
      type: 'number',
      placeholder: 'Faces',
      validation: (value: unknown) => value === '' || value === null || Number(value) >= 0,
      invalid: 'false'
    },
  };

  const mockCores = [
    { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
    { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
  ];

  const mockTipoMaterialOptions: Array<{
    value: 'BAGUETE' | 'PLASTICO' | 'CHAPA_MDP' | 'CHAPA_MDF' | 'FITA_BORDA' | 'COLA' | 'CANTONEIRA' | 'TNT' | 'POLIETILENO' | 'PINTURA' | 'PINTURA_DE_BORDA_DE_FUNDO' | 'POLIESTER';
    label: 'Chapa MDP' | 'Chapa MDF' | 'Fita Borda' | 'Cola' | 'Cantoneira' | 'Tnt' | 'Polietileno' | 'Plástico' | 'Pintura' | 'Pintura de borda de fundo' | 'Poliéster' | 'Baguete';
  }> = [
    { label: 'Chapa MDP', value: 'CHAPA_MDP' },
    { label: 'Chapa MDF', value: 'CHAPA_MDF' },
  ];

  const mockUseSheetForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    cores: mockCores,
    tipoMaterialOptions: mockTipoMaterialOptions,
    dateTimeStart: '2024-01-01',
    handleDateTimeStartChange: vi.fn(),
    isEditing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSheetFormHook.useSheetForm).mockReturnValue(mockUseSheetForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<SheetForm />);

    expect(screen.getByRole('heading', { name: 'Chapa' })).toBeInTheDocument();
    expect(screen.getAllByText('Descrição').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tipo de Material').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cor').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Valor (R$)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Porcentagem de Perda (%)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Implantação').length).toBeGreaterThan(0);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SheetForm />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Test');

    expect(mockUseSheetForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SheetForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseSheetForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useSheetFormHook.useSheetForm).mockReturnValue({
      ...mockUseSheetForm,
      loading: true,
    });

    renderWithRouter(<SheetForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation messages', () => {
    const formDataWithErrors = {
      ...mockFormData,
      descricao: { ...mockFormData.descricao, invalid: 'true' },
    };

    vi.mocked(useSheetFormHook.useSheetForm).mockReturnValue({
      ...mockUseSheetForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<SheetForm />);

    expect(screen.getByText('Descrição deve ter entre 3 e 50 caracteres')).toBeInTheDocument();
  });

  it('should have cancel link pointing to /sheets', () => {
    renderWithRouter(<SheetForm />);

    const cancelButton = screen.getByText('Cancelar');
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/sheets');
  });
});
