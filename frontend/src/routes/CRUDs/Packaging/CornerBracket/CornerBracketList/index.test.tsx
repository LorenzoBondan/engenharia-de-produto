import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CornerBracketList from './index';
import * as useCornerBracketListHook from '../../../../../hooks/crud/useCornerBracketList';

vi.mock('../../../../../hooks/crud/useCornerBracketList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('CornerBracketList', () => {
  const mockCantoneiras = [
    {
      codigo: 1,
      descricao: 'Cantoneira 50x50mm',
      tipoMaterial: 'CANTONEIRA' as const,
      valor: 8.0,
      porcentagemPerda: 1.5,
      altura: 50.0,
      espessura: 3.0,
      implantacao: new Date('2024-01-01'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Cantoneira 60x60mm',
      tipoMaterial: 'CANTONEIRA' as const,
      valor: 10.0,
      porcentagemPerda: 2.0,
      altura: 60.0,
      espessura: 3.5,
      implantacao: new Date('2024-02-01'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseCornerBracketList = {
    data: mockCantoneiras,
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
    vi.mocked(useCornerBracketListHook.useCornerBracketList).mockReturnValue(mockUseCornerBracketList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<CornerBracketList />);

    expect(screen.getByText('Cadastro de Cantoneiras')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<CornerBracketList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display all items in the table', () => {
    renderWithRouter(<CornerBracketList />);

    expect(screen.getByText('Cantoneira 50x50mm')).toBeInTheDocument();
    expect(screen.getByText('Cantoneira 60x60mm')).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<CornerBracketList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(useCornerBracketListHook.useCornerBracketList).mockReturnValue({
      ...mockUseCornerBracketList,
      isLastPage: true,
    });

    renderWithRouter(<CornerBracketList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(useCornerBracketListHook.useCornerBracketList).mockReturnValue({
      ...mockUseCornerBracketList,
      data: [],
      loading: true,
    });

    renderWithRouter(<CornerBracketList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<CornerBracketList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });
});
