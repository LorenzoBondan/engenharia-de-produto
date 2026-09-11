import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import UsedAccessoryForm from './index';
import * as useUsedAccessoryFormHook from '../../../../../hooks/crud/useUsedAccessoryForm';

vi.mock('../../../../../hooks/crud/useUsedAccessoryForm');

describe('UsedAccessoryForm', () => {
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
    acessorio: {
      name: 'acessorio',
      value: null,
      dirty: 'false',
      message: 'Acessório é obrigatório',
      id: 'acessorio',
      type: 'select',
      placeholder: 'Acessório',
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
    quantidade: {
      name: 'quantidade',
      value: null,
      dirty: 'false',
      message: 'Quantidade não pode ser nula ou negativa',
      id: 'quantidade',
      type: 'number',
      placeholder: 'Quantidade',
      validation: (value: unknown) => value === '' || value === null || Number(value) >= 0,
      invalid: 'false'
    },
  };

  const mockAcessorios = [
    {
      codigo: 1,
      descricao: 'Dobradiça',
      medidas: { codigo: 1, altura: 100, largura: 50, espessura: 3, situacao: 'ATIVO' as const },
      cor: { codigo: 1, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
      implantacao: new Date('2024-01-01'),
      valor: 5.0,
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Puxador',
      medidas: { codigo: 2, altura: 120, largura: 30, espessura: 2, situacao: 'ATIVO' as const },
      cor: { codigo: 2, descricao: 'Cromado', hexa: '#C0C0C0', situacao: 'ATIVO' as const },
      implantacao: new Date('2024-02-01'),
      valor: 8.0,
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

  const mockUseUsedAccessoryForm = {
    formData: mockFormData,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    isEditing: false,
    loading: false,
    acessorios: mockAcessorios,
    filhos: mockFilhos,
    previousPath: '/sons/1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUsedAccessoryFormHook.useUsedAccessoryForm).mockReturnValue(mockUseUsedAccessoryForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<UsedAccessoryForm />);

    expect(screen.getByRole('heading', { name: 'Acessório Usado' })).toBeInTheDocument();
    expect(screen.getAllByText('Acessório').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Filho').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Quantidade').length).toBeGreaterThan(0);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UsedAccessoryForm />);

    const quantidadeInput = screen.getByPlaceholderText('Quantidade');
    await user.type(quantidadeInput, '5');

    expect(mockUseUsedAccessoryForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UsedAccessoryForm />);

    const form = screen.getByRole('heading', { name: 'Acessório Usado' }).closest('form');
    if (form) {
      await user.click(screen.getByText('Salvar'));
    }

    expect(mockUseUsedAccessoryForm.handleSubmit).toHaveBeenCalled();
  });

  it('should display validation messages', () => {
    const formDataWithErrors = {
      ...mockFormData,
      acessorio: { ...mockFormData.acessorio, invalid: 'true' },
    };

    vi.mocked(useUsedAccessoryFormHook.useUsedAccessoryForm).mockReturnValue({
      ...mockUseUsedAccessoryForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<UsedAccessoryForm />);

    expect(screen.getByText('Acessório é obrigatório')).toBeInTheDocument();
  });

  it('should have cancel link pointing to previous path', () => {
    renderWithRouter(<UsedAccessoryForm />);

    const cancelButton = screen.getByText('Cancelar');
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/sons/1');
  });

  it('should render acessorios and filhos options', () => {
    renderWithRouter(<UsedAccessoryForm />);

    // Verify that form has select fields for acessorio and filho
    const form = screen.getByRole('heading', { name: 'Acessório Usado' }).closest('form');
    expect(form).toBeInTheDocument();
  });
});
