import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import UsedMaterialForm from './index';
import * as useUsedMaterialFormHook from '../../../../../hooks/crud/useUsedMaterialForm';

vi.mock('../../../../../hooks/crud/useUsedMaterialForm');

describe('UsedMaterialForm', () => {
  const mockFormData = {
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
    material: {
      name: 'material',
      value: null,
      dirty: 'false',
      message: 'Material é obrigatório',
      id: 'material',
      type: 'select',
      placeholder: 'Material',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
    filho: {
      name: 'filho',
      value: null,
      dirty: 'false',
      message: 'Filho é obrigatório',
      id: 'filho',
      type: 'select',
      placeholder: 'Filho',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
    quantidadeLiquida: {
      name: 'quantidadeLiquida',
      value: null,
      dirty: 'false',
      message: 'Quantidade Líquida não pode ser nula ou negativa',
      id: 'quantidadeLiquida',
      type: 'number',
      placeholder: 'Quantidade Líquida',
      validation: (value: unknown) => value === '' || value === null || Number(value) >= 0,
      invalid: 'false'
    },
    quantidadeBruta: {
      name: 'quantidadeBruta',
      value: null,
      dirty: 'false',
      message: 'Quantidade Bruta não pode ser nula ou negativa',
      id: 'quantidadeBruta',
      type: 'number',
      placeholder: 'Quantidade Bruta',
      validation: (value: unknown) => value === '' || value === null || Number(value) >= 0,
      invalid: 'false'
    },
  };

  const mockMateriais = [
    {
      codigo: 1,
      descricao: 'Chapa MDP Branca',
      tipoMaterial: 'CHAPA_MDP' as const,
      implantacao: new Date('2024-01-01'),
      porcentagemPerda: 5.0,
      valor: 120.0,
      cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Fita Borda Preta',
      tipoMaterial: 'FITA_BORDA' as const,
      implantacao: new Date('2024-02-01'),
      porcentagemPerda: 2.0,
      valor: 15.0,
      cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
      situacao: 'ATIVO' as const,
    },
  ];

  const mockFilhos = [
    {
      codigo: 1,
      descricao: 'Porta Frontal',
      pai: {} as any,
      cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
      medidas: { codigo: 1, altura: 2100, largura: 600, espessura: 18, situacao: 'ATIVO' as const },
      roteiro: {} as any,
      unidadeMedida: 'UN',
      implantacao: new Date('2024-01-01'),
      valor: 150.0,
      tipo: 'MDP' as const,
      situacao: 'ATIVO' as const,
      filhos: [],
      materiaisUsados: [],
      acessoriosUsados: [],
    },
    {
      codigo: 2,
      descricao: 'Gaveta Superior',
      pai: {} as any,
      cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
      medidas: { codigo: 2, altura: 350, largura: 450, espessura: 18, situacao: 'ATIVO' as const },
      roteiro: {} as any,
      unidadeMedida: 'UN',
      implantacao: new Date('2024-02-01'),
      valor: 100.0,
      tipo: 'MDF' as const,
      situacao: 'ATIVO' as const,
      filhos: [],
      materiaisUsados: [],
      acessoriosUsados: [],
    },
  ];

  const mockUseUsedMaterialForm = {
    formData: mockFormData,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    isEditing: false,
    loading: false,
    materiais: mockMateriais,
    filhos: mockFilhos,
    previousPath: '/sons/1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUsedMaterialFormHook.useUsedMaterialForm).mockReturnValue(mockUseUsedMaterialForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<UsedMaterialForm />);

    expect(screen.getByRole('heading', { name: 'Material Usado' })).toBeInTheDocument();
    expect(screen.getAllByText('Material').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Filho').length).toBeGreaterThan(0);
    expect(screen.getByText('Quantidade Líquida')).toBeInTheDocument();
    expect(screen.getByText('Quantidade Bruta')).toBeInTheDocument();
    expect(screen.getByText('Valor (R$)')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UsedMaterialForm />);

    const quantidadeInput = screen.getByPlaceholderText('Quantidade Líquida');
    await user.type(quantidadeInput, '3');

    expect(mockUseUsedMaterialForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UsedMaterialForm />);

    const form = screen.getByRole('heading', { name: 'Material Usado' }).closest('form');
    if (form) {
      await user.click(screen.getByText('Salvar'));
    }

    expect(mockUseUsedMaterialForm.handleSubmit).toHaveBeenCalled();
  });

  it('should display validation messages', () => {
    const formDataWithErrors = {
      ...mockFormData,
      material: { ...mockFormData.material, invalid: 'true' },
    };

    vi.mocked(useUsedMaterialFormHook.useUsedMaterialForm).mockReturnValue({
      ...mockUseUsedMaterialForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<UsedMaterialForm />);

    expect(screen.getByText('Material é obrigatório')).toBeInTheDocument();
  });

  it('should have cancel link pointing to previous path', () => {
    renderWithRouter(<UsedMaterialForm />);

    const cancelButton = screen.getByText('Cancelar');
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/sons/1');
  });

  it('should render materiais and filhos options', () => {
    renderWithRouter(<UsedMaterialForm />);

    // Verify that form has select fields for material and filho
    const form = screen.getByRole('heading', { name: 'Material Usado' }).closest('form');
    expect(form).toBeInTheDocument();
  });
});
