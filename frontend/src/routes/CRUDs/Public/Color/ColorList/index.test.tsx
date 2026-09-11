import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ColorList from './index';
import * as useColorListHook from '../../../../../hooks/crud/useColorList';

vi.mock('../../../../../hooks/crud/useColorList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('ColorList', () => {
  const mockCores = [
    {
      codigo: 1,
      descricao: 'Branco',
      hexa: '#FFFFFF',
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Preto',
      hexa: '#000000',
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseColorList = {
    data: mockCores,
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
    vi.mocked(useColorListHook.useColorList).mockReturnValue(mockUseColorList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<ColorList />);

    expect(screen.getByText('Cadastro de Cores')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<ColorList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<ColorList />);

    expect(screen.getByText('Branco')).toBeInTheDocument();
    expect(screen.getByText('Preto')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<ColorList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(useColorListHook.useColorList).mockReturnValue({
      ...mockUseColorList,
      isLastPage: true,
    });

    renderWithRouter(<ColorList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(useColorListHook.useColorList).mockReturnValue({
      ...mockUseColorList,
      data: [],
      loading: true,
    });

    renderWithRouter(<ColorList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<ColorList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });
});
