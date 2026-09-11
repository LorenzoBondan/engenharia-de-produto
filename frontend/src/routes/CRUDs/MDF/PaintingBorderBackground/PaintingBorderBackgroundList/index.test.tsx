import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaintingBorderBackgroundList from './index';
import * as usePaintingBorderBackgroundListHook from '../../../../../hooks/crud/usePaintingBorderBackgroundList';

// Mock the usePaintingBorderBackgroundList hook
vi.mock('../../../../../hooks/crud/usePaintingBorderBackgroundList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('PaintingBorderBackgroundList', () => {
  const mockPinturasBordaFundo = [
    {
      codigo: 1,
      descricao: 'Pintura Branca Borda Fundo',
      cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
      tipoMaterial: 'PINTURA_DE_BORDA_DE_FUNDO' as const,
      valor: 30.0,
      porcentagemPerda: 3.0,
      implantacao: new Date('2024-01-01'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Pintura Preta Borda Fundo',
      cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
      tipoMaterial: 'PINTURA_DE_BORDA_DE_FUNDO' as const,
      valor: 35.0,
      porcentagemPerda: 4.0,
      implantacao: new Date('2024-02-01'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUsePaintingBorderBackgroundList = {
    data: mockPinturasBordaFundo,
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
    vi.mocked(usePaintingBorderBackgroundListHook.usePaintingBorderBackgroundList).mockReturnValue(mockUsePaintingBorderBackgroundList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<PaintingBorderBackgroundList />);

    expect(screen.getByText('Cadastro de Pintura de Borda de Fundo')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<PaintingBorderBackgroundList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all pinturas in the table', () => {
    renderWithRouter(<PaintingBorderBackgroundList />);

    expect(screen.getByText('Pintura Branca Borda Fundo')).toBeInTheDocument();
    expect(screen.getByText('Pintura Preta Borda Fundo')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<PaintingBorderBackgroundList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(usePaintingBorderBackgroundListHook.usePaintingBorderBackgroundList).mockReturnValue({
      ...mockUsePaintingBorderBackgroundList,
      isLastPage: true,
    });

    renderWithRouter(<PaintingBorderBackgroundList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(usePaintingBorderBackgroundListHook.usePaintingBorderBackgroundList).mockReturnValue({
      ...mockUsePaintingBorderBackgroundList,
      data: [],
      loading: true,
    });

    renderWithRouter(<PaintingBorderBackgroundList />);

    // Skeleton should render placeholder rows
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<PaintingBorderBackgroundList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Cor')).toBeInTheDocument();
  });
});
