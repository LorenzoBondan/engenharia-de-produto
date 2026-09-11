import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EdgeBandingList from './index';
import * as useEdgeBandingListHook from '../../../../../hooks/crud/useEdgeBandingList';

// Mock the useEdgeBandingList hook
vi.mock('../../../../../hooks/crud/useEdgeBandingList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('EdgeBandingList', () => {
  const mockFitasBorda = [
    {
      codigo: 1,
      descricao: 'Fita Branca 22mm',
      cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
      tipoMaterial: 'FITA_BORDA' as const,
      valor: 15.0,
      porcentagemPerda: 2.0,
      altura: 20.0,
      espessura: 0.5,
      implantacao: new Date('2024-01-01'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Fita Preta 22mm',
      cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
      tipoMaterial: 'FITA_BORDA' as const,
      valor: 18.0,
      porcentagemPerda: 2.5,
      altura: 20.0,
      espessura: 0.5,
      implantacao: new Date('2024-02-01'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseEdgeBandingList = {
    data: mockFitasBorda,
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
    vi.mocked(useEdgeBandingListHook.useEdgeBandingList).mockReturnValue(mockUseEdgeBandingList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<EdgeBandingList />);

    expect(screen.getByText('Cadastro de Fita Borda')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<EdgeBandingList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<EdgeBandingList />);

    expect(screen.getByText('Fita Branca 22mm')).toBeInTheDocument();
    expect(screen.getByText('Fita Preta 22mm')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<EdgeBandingList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(useEdgeBandingListHook.useEdgeBandingList).mockReturnValue({
      ...mockUseEdgeBandingList,
      isLastPage: true,
    });

    renderWithRouter(<EdgeBandingList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(useEdgeBandingListHook.useEdgeBandingList).mockReturnValue({
      ...mockUseEdgeBandingList,
      data: [],
      loading: true,
    });

    renderWithRouter(<EdgeBandingList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<EdgeBandingList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Cor')).toBeInTheDocument();
  });
});
