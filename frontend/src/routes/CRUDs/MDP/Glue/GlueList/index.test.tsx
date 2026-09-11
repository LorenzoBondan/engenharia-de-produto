import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GlueList from './index';
import * as useGlueListHook from '../../../../../hooks/crud/useGlueList';

// Mock the useGlueList hook
vi.mock('../../../../../hooks/crud/useGlueList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('GlueList', () => {
  const mockColas = [
    {
      codigo: 1,
      descricao: 'Cola Branca PVA',
      tipoMaterial: 'COLA' as const,
      valor: 25.0,
      porcentagemPerda: 3.0,
      gramatura: 180.0,
      implantacao: new Date('2024-01-01'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Cola Hot Melt',
      tipoMaterial: 'COLA' as const,
      valor: 35.0,
      porcentagemPerda: 4.0,
      gramatura: 200.0,
      implantacao: new Date('2024-02-01'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseGlueList = {
    data: mockColas,
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
    vi.mocked(useGlueListHook.useGlueList).mockReturnValue(mockUseGlueList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<GlueList />);

    expect(screen.getByText('Cadastro de Colas')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<GlueList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<GlueList />);

    expect(screen.getByText('Cola Branca PVA')).toBeInTheDocument();
    expect(screen.getByText('Cola Hot Melt')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<GlueList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(useGlueListHook.useGlueList).mockReturnValue({
      ...mockUseGlueList,
      isLastPage: true,
    });

    renderWithRouter(<GlueList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(useGlueListHook.useGlueList).mockReturnValue({
      ...mockUseGlueList,
      data: [],
      loading: true,
    });

    renderWithRouter(<GlueList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<GlueList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });
});
