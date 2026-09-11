import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NonwovenFabricList from './index';
import * as useNonwovenFabricListHook from '../../../../../hooks/crud/useNonwovenFabricList';

vi.mock('../../../../../hooks/crud/useNonwovenFabricList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('NonwovenFabricList', () => {
  const mockTnts = [
    {
      codigo: 1,
      descricao: 'TNT Branco 40g',
      tipoMaterial: 'TNT' as const,
      valor: 5.0,
      porcentagemPerda: 1.0,
      gramatura: 40.0,
      implantacao: new Date('2024-01-01'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'TNT Preto 60g',
      tipoMaterial: 'TNT' as const,
      valor: 7.0,
      porcentagemPerda: 1.5,
      gramatura: 60.0,
      implantacao: new Date('2024-02-01'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseNonwovenFabricList = {
    data: mockTnts,
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
    vi.mocked(useNonwovenFabricListHook.useNonwovenFabricList).mockReturnValue(mockUseNonwovenFabricList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<NonwovenFabricList />);

    expect(screen.getByText('Cadastro de TNTs')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<NonwovenFabricList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<NonwovenFabricList />);

    expect(screen.getByText('TNT Branco 40g')).toBeInTheDocument();
    expect(screen.getByText('TNT Preto 60g')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<NonwovenFabricList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(useNonwovenFabricListHook.useNonwovenFabricList).mockReturnValue({
      ...mockUseNonwovenFabricList,
      isLastPage: true,
    });

    renderWithRouter(<NonwovenFabricList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(useNonwovenFabricListHook.useNonwovenFabricList).mockReturnValue({
      ...mockUseNonwovenFabricList,
      data: [],
      loading: true,
    });

    renderWithRouter(<NonwovenFabricList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<NonwovenFabricList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });
});
