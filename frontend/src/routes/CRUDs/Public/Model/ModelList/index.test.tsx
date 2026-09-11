import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ModelList from './index';
import * as useModelListHook from '../../../../../hooks/crud/useModelList';

vi.mock('../../../../../hooks/crud/useModelList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('ModelList', () => {
  const mockModelos = [
    {
      codigo: 1,
      descricao: 'Móvel Classic',
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Móvel Modern',
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseModelList = {
    data: mockModelos,
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
    vi.mocked(useModelListHook.useModelList).mockReturnValue(mockUseModelList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<ModelList />);

    expect(screen.getByText('Cadastro de Modelos')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<ModelList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<ModelList />);

    expect(screen.getByText('Móvel Classic')).toBeInTheDocument();
    expect(screen.getByText('Móvel Modern')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<ModelList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(useModelListHook.useModelList).mockReturnValue({
      ...mockUseModelList,
      isLastPage: true,
    });

    renderWithRouter(<ModelList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(useModelListHook.useModelList).mockReturnValue({
      ...mockUseModelList,
      data: [],
      loading: true,
    });

    renderWithRouter(<ModelList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<ModelList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });
});
