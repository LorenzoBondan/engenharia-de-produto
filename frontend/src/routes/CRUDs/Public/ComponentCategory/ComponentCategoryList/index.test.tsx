import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComponentCategoryList from './index';
import * as useComponentCategoryListHook from '../../../../../hooks/crud/useComponentCategoryList';

vi.mock('../../../../../hooks/crud/useComponentCategoryList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('ComponentCategoryList', () => {
  const mockCategorias = [
    {
      codigo: 1,
      descricao: 'Portas',
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Gavetas',
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseComponentCategoryList = {
    data: mockCategorias,
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
    vi.mocked(useComponentCategoryListHook.useComponentCategoryList).mockReturnValue(mockUseComponentCategoryList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<ComponentCategoryList />);

    expect(screen.getByText('Cadastro de Categorias de Componentes')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<ComponentCategoryList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<ComponentCategoryList />);

    expect(screen.getByText('Portas')).toBeInTheDocument();
    expect(screen.getByText('Gavetas')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<ComponentCategoryList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(useComponentCategoryListHook.useComponentCategoryList).mockReturnValue({
      ...mockUseComponentCategoryList,
      isLastPage: true,
    });

    renderWithRouter(<ComponentCategoryList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(useComponentCategoryListHook.useComponentCategoryList).mockReturnValue({
      ...mockUseComponentCategoryList,
      data: [],
      loading: true,
    });

    renderWithRouter(<ComponentCategoryList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<ComponentCategoryList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });
});
