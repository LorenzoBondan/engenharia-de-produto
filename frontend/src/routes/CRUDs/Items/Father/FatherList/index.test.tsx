import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import FatherList from './index';
import * as useFatherListHook from '../../../../../hooks/crud/useFatherList';
import { DPai } from '../../../../../models/pai';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useFatherList hook
vi.mock('../../../../../hooks/crud/useFatherList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('FatherList', () => {
  const mockPais: DPai[] = [
    {
      codigo: 1,
      descricao: 'Pai 1',
      categoriaComponente: { codigo: 1, descricao: 'Categoria A', situacao: 'ATIVO' },
      modelo: { codigo: 1, descricao: 'Modelo A', situacao: 'ATIVO' },
      bordasComprimento: 100,
      bordasLargura: 50,
      numeroCantoneiras: 4,
      plasticoAdicional: 10,
      larguraPlastico: 20,
      faces: 2,
      tipoPintura: 'ACETINADA',
      plasticoAcima: false,
      especial: false,
      situacao: 'ATIVO' as const,
      tntUmaFace: false,
      filhos: [],
    },
    {
      codigo: 2,
      descricao: 'Pai 2',
      categoriaComponente: { codigo: 2, descricao: 'Categoria B', situacao: 'ATIVO' },
      modelo: { codigo: 2, descricao: 'Modelo B', situacao: 'ATIVO' },
      bordasComprimento: 120,
      bordasLargura: 60,
      numeroCantoneiras: 2,
      plasticoAdicional: 15,
      larguraPlastico: 25,
      faces: 1,
      tipoPintura: 'ACETINADA',
      plasticoAcima: true,
      especial: true,
      situacao: 'ATIVO' as const,
      tntUmaFace: false,
      filhos: [],
    },
  ];

  const mockUseFatherList = {
    data: mockPais,
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
    vi.mocked(useFatherListHook.useFatherList).mockReturnValue(mockUseFatherList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render father list with title', () => {
    renderWithRouter(<FatherList />);

    expect(screen.getByText('Cadastro de Pais')).toBeInTheDocument();
  });

  it('should render father data when loaded', () => {
    renderWithRouter(<FatherList />);

    expect(screen.getByText('Pai 1')).toBeInTheDocument();
    expect(screen.getByText('Pai 2')).toBeInTheDocument();
    expect(screen.getByText('Categoria A')).toBeInTheDocument();
    expect(screen.getByText('Modelo B')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    vi.mocked(useFatherListHook.useFatherList).mockReturnValue({
      ...mockUseFatherList,
      loading: true,
      data: [],
    });

    renderWithRouter(<FatherList />);

    expect(screen.queryByText('Pai 1')).not.toBeInTheDocument();
  });

  it('should show error dialog when error occurs', () => {
    vi.mocked(useFatherListHook.useFatherList).mockReturnValue({
      ...mockUseFatherList,
      error: 'Failed to load fathers',
      data: [],
    });

    renderWithRouter(<FatherList />);

    expect(screen.getByText('Failed to load fathers')).toBeInTheDocument();
  });

  it('should navigate to create page when new button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FatherList />);

    const newButton = screen.getByText('Novo');
    await user.click(newButton);

    expect(mockNavigate).toHaveBeenCalledWith('/fathers/create');
  });

  it('should call handleSearch when search is performed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FatherList />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: '🔎︎' });

    await user.type(searchInput, 'test query');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockUseFatherList.handleSearch).toHaveBeenCalled();
    });
  });

  it('should call handleNextPage when next page button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FatherList />);

    const nextPageButton = screen.getByText('Carregar mais');
    await user.click(nextPageButton);

    expect(mockUseFatherList.handleNextPage).toHaveBeenCalled();
  });

  it('should not show next page button when on last page', () => {
    vi.mocked(useFatherListHook.useFatherList).mockReturnValue({
      ...mockUseFatherList,
      isLastPage: true,
    });

    renderWithRouter(<FatherList />);

    expect(screen.queryByText('Carregar mais')).not.toBeInTheDocument();
  });

  it('should show confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FatherList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    expect(screen.getByText(/você tem certeza/i)).toBeInTheDocument();
  });

  it('should call handleDelete when deletion is confirmed', async () => {
    const user = userEvent.setup();
    mockUseFatherList.handleDelete.mockResolvedValue(undefined);

    renderWithRouter(<FatherList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    const confirmButton = screen.getByText('Sim');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockUseFatherList.handleDelete).toHaveBeenCalledWith([1]);
    });
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FatherList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const editButton = screen.getByRole('button', { name: 'Editar' });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/fathers/1');
  });

  it('should call handleInactivate when inactivate button is clicked', async () => {
    const user = userEvent.setup();
    mockUseFatherList.handleInactivate.mockResolvedValue(undefined);

    renderWithRouter(<FatherList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const inactivateButton = screen.getByRole('button', { name: 'Inativar' });
    await user.click(inactivateButton);

    await waitFor(() => {
      expect(mockUseFatherList.handleInactivate).toHaveBeenCalledWith([1]);
    });
  });

  it('should navigate to details page when eye icon is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<FatherList />);

    const viewLinks = screen.getAllByRole('link', { name: '' });
    await user.click(viewLinks[0]);

    expect(viewLinks[0]).toHaveAttribute('href', '/fathers/details/1');
  });

  it('should filter out items in trash', () => {
    const paisWithTrash = [
      ...mockPais,
      {
        ...mockPais[0],
        codigo: 3,
        descricao: 'Pai Lixeira',
        situacao: 'LIXEIRA' as const,
      },
    ];

    vi.mocked(useFatherListHook.useFatherList).mockReturnValue({
      ...mockUseFatherList,
      data: paisWithTrash,
    });

    renderWithRouter(<FatherList />);

    expect(screen.getByText('Pai 1')).toBeInTheDocument();
    expect(screen.getByText('Pai 2')).toBeInTheDocument();
    expect(screen.queryByText('Pai Lixeira')).not.toBeInTheDocument();
  });
});
