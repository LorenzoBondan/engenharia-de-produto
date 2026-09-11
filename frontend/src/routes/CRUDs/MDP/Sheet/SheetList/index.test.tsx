import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SheetList from './index';
import * as useSheetListHook from '../../../../../hooks/crud/useSheetList';

// Mock the useSheetList hook
vi.mock('../../../../../hooks/crud/useSheetList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('SheetList', () => {
  const mockChapas = [
    {
      codigo: 1,
      descricao: 'Chapa MDP Branca 15mm',
      cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
      tipoMaterial: 'CHAPA_MDP' as const,
      valor: 120.0,
      porcentagemPerda: 5.0,
      implantacao: new Date('2024-01-01'),
      espessura: 15.0,
      faces: 2,
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Chapa MDF Preta 18mm',
      cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
      tipoMaterial: 'CHAPA_MDF' as const,
      valor: 150.0,
      porcentagemPerda: 6.0,
      implantacao: new Date('2024-02-01'),
      espessura: 15.0,
      faces: 2,
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseSheetList = {
    data: mockChapas,
    loading: false,
    isLastPage: false,
    handleSearch: vi.fn(),
    handleNextPage: vi.fn(),
    handleDelete: vi.fn(),
    handleInactivate: vi.fn(),
    error: null,
    refresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSheetListHook.useSheetList).mockReturnValue(mockUseSheetList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<SheetList />);

    expect(screen.getByText('Cadastro de Chapas')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<SheetList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<SheetList />);

    expect(screen.getByText('Chapa MDP Branca 15mm')).toBeInTheDocument();
    expect(screen.getByText('Chapa MDF Preta 18mm')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<SheetList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(useSheetListHook.useSheetList).mockReturnValue({
      ...mockUseSheetList,
      isLastPage: true,
    });

    renderWithRouter(<SheetList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(useSheetListHook.useSheetList).mockReturnValue({
      ...mockUseSheetList,
      data: [],
      loading: true,
    });

    renderWithRouter(<SheetList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<SheetList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Cor')).toBeInTheDocument();
  });
});
