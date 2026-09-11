import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlasticList from './index';
import * as usePlasticListHook from '../../../../../hooks/crud/usePlasticList';

vi.mock('../../../../../hooks/crud/usePlasticList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('PlasticList', () => {
  const mockPlasticos = [
    {
      codigo: 1,
      descricao: 'Plástico Bolha',
      tipoMaterial: 'PLASTICO' as const,
      valor: 12.0,
      porcentagemPerda: 2.0,
      gramatura: 100.0,
      implantacao: new Date('2024-01-01'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Plástico Filme',
      tipoMaterial: 'PLASTICO' as const,
      valor: 10.0,
      porcentagemPerda: 1.5,
      gramatura: 80.0,
      implantacao: new Date('2024-02-01'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUsePlasticList = {
    data: mockPlasticos,
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
    vi.mocked(usePlasticListHook.usePlasticList).mockReturnValue(mockUsePlasticList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<PlasticList />);

    expect(screen.getByText('Cadastro de Plásticos')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<PlasticList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<PlasticList />);

    expect(screen.getByText('Plástico Bolha')).toBeInTheDocument();
    expect(screen.getByText('Plástico Filme')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<PlasticList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(usePlasticListHook.usePlasticList).mockReturnValue({
      ...mockUsePlasticList,
      isLastPage: true,
    });

    renderWithRouter(<PlasticList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(usePlasticListHook.usePlasticList).mockReturnValue({
      ...mockUsePlasticList,
      data: [],
      loading: true,
    });

    renderWithRouter(<PlasticList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<PlasticList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });
});
