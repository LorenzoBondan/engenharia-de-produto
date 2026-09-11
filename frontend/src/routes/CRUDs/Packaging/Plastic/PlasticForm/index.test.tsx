import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import PlasticForm from './index';
import * as usePlasticFormHook from '../../../../../hooks/crud/usePlasticForm';

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

vi.mock('../../../../../hooks/crud/usePlasticForm');

describe('PlasticForm', () => {
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
    gramatura: {
      name: 'gramatura',
      value: null,
      dirty: 'false',
      message: 'Gramatura não pode ser negativa',
      id: 'gramatura',
      type: 'number',
      placeholder: 'Gramatura',
      validation: (value: unknown) => value === '' || value === null || Number(value) >= 0,
      invalid: 'false'
    },
  };

  const mockTipoMaterialOptions: Array<{
    value: 'BAGUETE' | 'PLASTICO' | 'CHAPA_MDP' | 'CHAPA_MDF' | 'FITA_BORDA' | 'COLA' | 'CANTONEIRA' | 'TNT' | 'POLIETILENO' | 'PINTURA' | 'PINTURA_DE_BORDA_DE_FUNDO' | 'POLIESTER';
    label: 'Chapa MDP' | 'Chapa MDF' | 'Fita Borda' | 'Cola' | 'Cantoneira' | 'Tnt' | 'Polietileno' | 'Plástico' | 'Pintura' | 'Pintura de borda de fundo' | 'Poliéster' | 'Baguete';
  }> = [
    { label: 'Plástico', value: 'PLASTICO' },
    { label: 'Polietileno', value: 'POLIETILENO' },
  ];

  const mockUsePlasticForm = {
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
    vi.mocked(usePlasticFormHook.usePlasticForm).mockReturnValue(mockUsePlasticForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<PlasticForm />);

    expect(screen.getByRole('heading', { name: 'Plástico' })).toBeInTheDocument();
    expect(screen.getAllByText('Descrição').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tipo de Material').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Valor (R$)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Porcentagem de Perda (%)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Implantação').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gramatura').length).toBeGreaterThan(0);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PlasticForm />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Test');

    expect(mockUsePlasticForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PlasticForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUsePlasticForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(usePlasticFormHook.usePlasticForm).mockReturnValue({
      ...mockUsePlasticForm,
      loading: true,
    });

    renderWithRouter(<PlasticForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation messages', () => {
    const formDataWithErrors = {
      ...mockFormData,
      descricao: { ...mockFormData.descricao, invalid: 'true' },
    };

    vi.mocked(usePlasticFormHook.usePlasticForm).mockReturnValue({
      ...mockUsePlasticForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<PlasticForm />);

    expect(screen.getByText('Descrição deve ter entre 3 e 50 caracteres')).toBeInTheDocument();
  });

  it('should have cancel link pointing to /plastics', () => {
    renderWithRouter(<PlasticForm />);

    const cancelButton = screen.getByText('Cancelar');
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/plastics');
  });
});
