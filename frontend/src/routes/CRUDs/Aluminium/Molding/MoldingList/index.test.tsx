import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MoldingList from './index';
import * as useMoldingListHook from '../../../../../hooks/crud/useMoldingList';
import { DBaguete } from '../../../../../models/baguete';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useMoldingList hook
vi.mock('../../../../../hooks/crud/useMoldingList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('MoldingList', () => {
  const mockBaguetes: DBaguete[] = [
    {
      codigo: 1,
      descricao: 'Baguete 1',
      tipoMaterial: 'BAGUETE',
      valor: 10.5,
      porcentagemPerda: 5,
      implantacao: new Date('2024-01-02'),
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      descricao: 'Baguete 2',
      tipoMaterial: 'BAGUETE',
      valor: 8.5,
      porcentagemPerda: 3,
      implantacao: new Date('2024-01-02'),
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseMoldingList = {
    data: mockBaguetes,
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
    vi.mocked(useMoldingListHook.useMoldingList).mockReturnValue(mockUseMoldingList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render molding list with title', () => {
    renderWithRouter(<MoldingList />);

    expect(screen.getByText('Cadastro de Baguete')).toBeInTheDocument();
  });

  it('should render molding data when loaded', () => {
    renderWithRouter(<MoldingList />);

    expect(screen.getByText('Baguete 1')).toBeInTheDocument();
    expect(screen.getByText('Baguete 2')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    vi.mocked(useMoldingListHook.useMoldingList).mockReturnValue({
      ...mockUseMoldingList,
      loading: true,
      data: [],
    });

    renderWithRouter(<MoldingList />);

    expect(screen.queryByText('Baguete 1')).not.toBeInTheDocument();
  });

  it('should show error dialog when error occurs', () => {
    vi.mocked(useMoldingListHook.useMoldingList).mockReturnValue({
      ...mockUseMoldingList,
      error: 'Failed to load moldings',
      data: [],
    });

    renderWithRouter(<MoldingList />);

    expect(screen.getByText('Failed to load moldings')).toBeInTheDocument();
  });

  it('should navigate to create page when new button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MoldingList />);

    const newButton = screen.getByText('Novo');
    await user.click(newButton);

    expect(mockNavigate).toHaveBeenCalledWith('/moldings/create');
  });

  it('should call handleSearch when search is performed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MoldingList />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: '🔎︎' });

    await user.type(searchInput, 'test query');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockUseMoldingList.handleSearch).toHaveBeenCalled();
    });
  });

  it('should call handleNextPage when next page button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MoldingList />);

    const nextPageButton = screen.getByText('Carregar mais');
    await user.click(nextPageButton);

    expect(mockUseMoldingList.handleNextPage).toHaveBeenCalled();
  });

  it('should not show next page button when on last page', () => {
    vi.mocked(useMoldingListHook.useMoldingList).mockReturnValue({
      ...mockUseMoldingList,
      isLastPage: true,
    });

    renderWithRouter(<MoldingList />);

    expect(screen.queryByText('Carregar mais')).not.toBeInTheDocument();
  });

  it('should show confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MoldingList />);

    // Get all edit/delete/inactivate buttons (dropdown toggles)
    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    expect(screen.getByText(/você tem certeza/i)).toBeInTheDocument();
  });

  it('should call handleDelete when deletion is confirmed', async () => {
    const user = userEvent.setup();
    mockUseMoldingList.handleDelete.mockResolvedValue(undefined);

    renderWithRouter(<MoldingList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    const confirmButton = screen.getByText('Sim');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockUseMoldingList.handleDelete).toHaveBeenCalledWith([1]);
    });
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MoldingList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const editButton = screen.getByRole('button', { name: 'Editar' });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/moldings/1');
  });

  it('should call handleInactivate when inactivate button is clicked', async () => {
    const user = userEvent.setup();
    mockUseMoldingList.handleInactivate.mockResolvedValue(undefined);

    renderWithRouter(<MoldingList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const inactivateButton = screen.getByRole('button', { name: 'Inativar' });
    await user.click(inactivateButton);

    await waitFor(() => {
      expect(mockUseMoldingList.handleInactivate).toHaveBeenCalledWith([1]);
    });
  });

  it('should filter out items in trash', () => {
    const baguetesWithTrash = [
      ...mockBaguetes,
      {
        codigo: 3,
        descricao: 'Baguete Lixeira',
        tipoMaterial: 'BAGUETE' as const,
        valor: 10.5,
        porcentagemPerda: 5,
        implantacao: new Date('2024-01-03'),
        situacao: 'LIXEIRA' as const,
      },
    ];

    vi.mocked(useMoldingListHook.useMoldingList).mockReturnValue({
      ...mockUseMoldingList,
      data: baguetesWithTrash,
    });

    renderWithRouter(<MoldingList />);

    expect(screen.getByText('Baguete 1')).toBeInTheDocument();
    expect(screen.getByText('Baguete 2')).toBeInTheDocument();
    expect(screen.queryByText('Baguete Lixeira')).not.toBeInTheDocument();
  });
});
