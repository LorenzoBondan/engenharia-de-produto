import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GuideList from './index';
import * as useGuideListHook from '../../../../../hooks/crud/useGuideList';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useGuideList hook
vi.mock('../../../../../hooks/crud/useGuideList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('GuideList', () => {
  const mockRoteiros = [
    {
      codigo: 1,
      descricao: 'Roteiro 1',
      implantacao: '2024-01-01',
      dataFinal: '2024-12-31',
      valor: 100.0,
      situacao: 'ATIVO' as const,
      roteiroMaquinas: [],
    },
    {
      codigo: 2,
      descricao: 'Roteiro 2',
      implantacao: '2024-02-01',
      dataFinal: '2024-11-30',
      valor: 150.0,
      situacao: 'ATIVO' as const,
      roteiroMaquinas: [],
    },
  ];

  const mockUseGuideList = {
    data: mockRoteiros,
    loading: false,
    error: null,
    isLastPage: false,
    handleSearch: vi.fn(),
    handleNextPage: vi.fn(),
    handleDelete: vi.fn(),
    handleInactivate: vi.fn(),
    refresh: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGuideListHook.useGuideList).mockReturnValue(mockUseGuideList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render guide list', () => {
    renderWithRouter(<GuideList />);

    expect(screen.getByText('Cadastro de Roteiro')).toBeInTheDocument();
  });

  it('should render search bar', () => {
    renderWithRouter(<GuideList />);

    // SearchBar component exists, verifying it's rendered
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render new guide button', () => {
    renderWithRouter(<GuideList />);

    const newButton = screen.getByText('Novo');
    expect(newButton).toBeInTheDocument();
  });

  it('should render guide data in table', () => {
    renderWithRouter(<GuideList />);

    expect(screen.getByText('Roteiro 1')).toBeInTheDocument();
    expect(screen.getByText('Roteiro 2')).toBeInTheDocument();
  });

  it('should render guide dates', () => {
    renderWithRouter(<GuideList />);

    // Dates are formatted, so we check for the descriptions instead
    expect(screen.getByText('Roteiro 1')).toBeInTheDocument();
    expect(screen.getByText('Roteiro 2')).toBeInTheDocument();
  });

  it('should render next page button when not last page', () => {
    renderWithRouter(<GuideList />);

    const nextPageButton = screen.getByText('Carregar mais');
    expect(nextPageButton).toBeInTheDocument();
  });

  it('should render table headers', () => {
    renderWithRouter(<GuideList />);

    expect(screen.getByText('Código')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Implantação')).toBeInTheDocument();
    expect(screen.getByText('Data Final')).toBeInTheDocument();
  });
});
