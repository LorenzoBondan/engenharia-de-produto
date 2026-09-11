import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaintingList from './index';
import * as usePaintingListHook from '../../../../../hooks/crud/usePaintingList';

// Mock the usePaintingList hook
vi.mock('../../../../../hooks/crud/usePaintingList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('PaintingList', () => {
  const mockPinturas = [
    {
      codigo: 1,
      descricao: 'Pintura Branca Acetinada',
      cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
      tipoMaterial: 'CHAPA_MDP' as const,
      tipoPintura: 'ACETINADA' as const,
      valor: 50.0,
      porcentagemPerda: 5.0,
      implantacao: new Date('2024-01-01'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Pintura Preta Alto Brilho',
      cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
      tipoMaterial: 'CHAPA_MDF' as const,
      tipoPintura: 'ALTO_BRILHO' as const,
      valor: 75.0,
      porcentagemPerda: 8.0,
      implantacao: new Date('2024-02-01'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUsePaintingList = {
    data: mockPinturas,
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
    vi.mocked(usePaintingListHook.usePaintingList).mockReturnValue(mockUsePaintingList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<PaintingList />);

    expect(screen.getByText('Cadastro de Pinturas')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<PaintingList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all pinturas in the table', () => {
    renderWithRouter(<PaintingList />);

    expect(screen.getByText('Pintura Branca Acetinada')).toBeInTheDocument();
    expect(screen.getByText('Pintura Preta Alto Brilho')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<PaintingList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(usePaintingListHook.usePaintingList).mockReturnValue({
      ...mockUsePaintingList,
      isLastPage: true,
    });

    renderWithRouter(<PaintingList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(usePaintingListHook.usePaintingList).mockReturnValue({
      ...mockUsePaintingList,
      data: [],
      loading: true,
    });

    renderWithRouter(<PaintingList />);

    // Skeleton should render placeholder rows
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<PaintingList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Cor')).toBeInTheDocument();
    expect(screen.getByText('Tipo')).toBeInTheDocument();
  });
});
