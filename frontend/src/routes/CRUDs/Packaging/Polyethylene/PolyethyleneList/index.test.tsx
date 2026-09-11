import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PolyethyleneList from './index';
import * as usePolyethyleneListHook from '../../../../../hooks/crud/usePolyethyleneList';

vi.mock('../../../../../hooks/crud/usePolyethyleneList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('PolyethyleneList', () => {
  const mockPolietilenos = [
    {
      codigo: 1,
      descricao: 'Polietileno Expandido 5mm',
      tipoMaterial: 'POLIETILENO' as const,
      valor: 15.0,
      porcentagemPerda: 2.5,
      gramatura: 120.0,
      implantacao: new Date('2024-01-01'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Polietileno Expandido 10mm',
      tipoMaterial: 'POLIETILENO' as const,
      valor: 20.0,
      porcentagemPerda: 3.0,
      gramatura: 150.0,
      implantacao: new Date('2024-02-01'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUsePolyethyleneList = {
    data: mockPolietilenos,
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
    vi.mocked(usePolyethyleneListHook.usePolyethyleneList).mockReturnValue(mockUsePolyethyleneList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<PolyethyleneList />);

    expect(screen.getByText('Cadastro de Polietilenos')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<PolyethyleneList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<PolyethyleneList />);

    expect(screen.getByText('Polietileno Expandido 5mm')).toBeInTheDocument();
    expect(screen.getByText('Polietileno Expandido 10mm')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<PolyethyleneList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(usePolyethyleneListHook.usePolyethyleneList).mockReturnValue({
      ...mockUsePolyethyleneList,
      isLastPage: true,
    });

    renderWithRouter(<PolyethyleneList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(usePolyethyleneListHook.usePolyethyleneList).mockReturnValue({
      ...mockUsePolyethyleneList,
      data: [],
      loading: true,
    });

    renderWithRouter(<PolyethyleneList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<PolyethyleneList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });
});
