import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MeasureList from './index';
import * as useMeasureListHook from '../../../../../hooks/crud/useMeasureList';

vi.mock('../../../../../hooks/crud/useMeasureList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('MeasureList', () => {
  const mockMedidas = [
    {
      codigo: 1,
      altura: 100,
      largura: 600,
      espessura: 2100,
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      altura: 100,
      largura: 450,
      espessura: 350,
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseMeasureList = {
    data: mockMedidas,
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
    vi.mocked(useMeasureListHook.useMeasureList).mockReturnValue(mockUseMeasureList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render list with title and new button', () => {
    renderWithRouter(<MeasureList />);

    expect(screen.getByText('Cadastro de Medidas')).toBeInTheDocument();
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<MeasureList />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should show next page button when not last page', () => {
    renderWithRouter(<MeasureList />);

    expect(screen.getByText(/Carregar mais/i)).toBeInTheDocument();
  });

  it('should not show next page button when is last page', () => {
    vi.mocked(useMeasureListHook.useMeasureList).mockReturnValue({
      ...mockUseMeasureList,
      isLastPage: true,
    });

    renderWithRouter(<MeasureList />);

    expect(screen.queryByText(/próxima/i)).not.toBeInTheDocument();
  });

  it('should show loading skeleton when loading and no data', () => {
    vi.mocked(useMeasureListHook.useMeasureList).mockReturnValue({
      ...mockUseMeasureList,
      data: [],
      loading: true,
    });

    renderWithRouter(<MeasureList />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    renderWithRouter(<MeasureList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Altura')).toBeInTheDocument();
  });
});
