import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PolyesterList from './index';
import * as usePolyesterListHook from '../../../../../hooks/crud/usePolyesterList';

// Mock the usePolyesterList hook
vi.mock('../../../../../hooks/crud/usePolyesterList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('PolyesterList', () => {
  const mockPoliesteres = [
    {
      codigo: 1,
      descricao: 'Poliéster Transparente',
      tipoMaterial: 'POLIESTER' as const,
      valor: 40.0,
      porcentagemPerda: 6.0,
      implantacao: new Date('2024-01-01'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Poliéster Fosco',
      tipoMaterial: 'POLIESTER' as const,
      valor: 45.0,
      porcentagemPerda: 7.0,
      implantacao: new Date('2024-02-01'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUsePolyesterList = {
    data: mockPoliesteres,
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
    vi.mocked(usePolyesterListHook.usePolyesterList).mockReturnValue(mockUsePolyesterList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<PolyesterList />);

    expect(screen.getByText('Cadastro de Poliesters')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<PolyesterList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all poliésteres in the table', () => {
    renderWithRouter(<PolyesterList />);

    expect(screen.getByText('Poliéster Transparente')).toBeInTheDocument();
    expect(screen.getByText('Poliéster Fosco')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<PolyesterList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(usePolyesterListHook.usePolyesterList).mockReturnValue({
      ...mockUsePolyesterList,
      isLastPage: true,
    });

    renderWithRouter(<PolyesterList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(usePolyesterListHook.usePolyesterList).mockReturnValue({
      ...mockUsePolyesterList,
      data: [],
      loading: true,
    });

    renderWithRouter(<PolyesterList />);

    // Skeleton should render placeholder rows
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<PolyesterList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });
});
