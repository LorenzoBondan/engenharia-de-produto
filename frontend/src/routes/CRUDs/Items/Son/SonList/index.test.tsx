import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SonList from './index';
import * as useSonListHook from '../../../../../hooks/crud/useSonList';
import { DFilho } from '../../../../../models/filho';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useSonList hook
vi.mock('../../../../../hooks/crud/useSonList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('SonList', () => {
  const mockFilhos: DFilho[] = [
    {
      codigo: 1,
      descricao: 'Filho 1',
      pai: {
        codigo: 1,
        descricao: 'Pai A',
        modelo: { codigo: 1, descricao: 'Modelo A', situacao: 'ATIVO' as const },
        categoriaComponente: { codigo: 1, descricao: 'Cat A', situacao: 'ATIVO' as const },
        bordasComprimento: 2,
        bordasLargura: 2,
        numeroCantoneiras: 4,
        tntUmaFace: false,
        plasticoAcima: false,
        plasticoAdicional: 0,
        larguraPlastico: 0,
        faces: 2,
        especial: false,
        tipoPintura: 'ACETINADA',
        situacao: 'ATIVO' as const,
        filhos: [],
      },
      cor: { codigo: 1, descricao: 'Branco', hexa: '#FFFFFF', situacao: 'ATIVO' as const },
      medidas: { codigo: 1, altura: 100, largura: 50, espessura: 10, situacao: 'ATIVO' as const },
      roteiro: {
        codigo: 1,
        descricao: 'Roteiro 1',
        implantacao: new Date('2024-01-01'),
        dataFinal: new Date('2024-12-31'),
        valor: 50.0,
        situacao: 'ATIVO' as const,
        roteiroMaquinas: [],
      },
      valor: 150.0,
      implantacao: new Date('2024-01-01'),
      tipo: 'MDP',
      situacao: 'ATIVO' as const,
      unidadeMedida: 'UN',
      filhos: [],
      materiaisUsados: [],
      acessoriosUsados: [],
    },
    {
      codigo: 2,
      descricao: 'Filho 2',
      pai: {
        codigo: 2,
        descricao: 'Pai B',
        modelo: { codigo: 2, descricao: 'Modelo B', situacao: 'ATIVO' as const },
        categoriaComponente: { codigo: 2, descricao: 'Cat B', situacao: 'ATIVO' as const },
        bordasComprimento: 2,
        bordasLargura: 2,
        numeroCantoneiras: 4,
        tntUmaFace: true,
        plasticoAcima: true,
        plasticoAdicional: 10,
        larguraPlastico: 100,
        faces: 2,
        especial: false,
        tipoPintura: 'ACETINADA',
        situacao: 'ATIVO' as const,
        filhos: [],
      },
      cor: { codigo: 2, descricao: 'Preto', hexa: '#000000', situacao: 'ATIVO' as const },
      medidas: { codigo: 2, altura: 120, largura: 60, espessura: 15, situacao: 'ATIVO' as const },
      roteiro: {
        codigo: 2,
        descricao: 'Roteiro 2',
        implantacao: new Date('2024-01-01'),
        dataFinal: new Date('2024-12-31'),
        valor: 75.0,
        situacao: 'ATIVO' as const,
        roteiroMaquinas: [],
      },
      valor: 200.0,
      implantacao: new Date('2024-01-02'),
      tipo: 'MDP',
      situacao: 'ATIVO' as const,
      unidadeMedida: 'UN',
      filhos: [],
      materiaisUsados: [],
      acessoriosUsados: [],
    },
  ];

  const mockUseSonList = {
    data: mockFilhos,
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
    vi.mocked(useSonListHook.useSonList).mockReturnValue(mockUseSonList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render son list with title', () => {
    renderWithRouter(<SonList />);

    expect(screen.getByText('Cadastro de Filhos')).toBeInTheDocument();
  });

  it('should render son data when loaded', () => {
    renderWithRouter(<SonList />);

    expect(screen.getByText('Filho 1')).toBeInTheDocument();
    expect(screen.getByText('Filho 2')).toBeInTheDocument();
    expect(screen.getByText('Pai A')).toBeInTheDocument();
    expect(screen.getByText('Pai B')).toBeInTheDocument();
    expect(screen.getByText('Branco')).toBeInTheDocument();
    expect(screen.getByText('Preto')).toBeInTheDocument();
    expect(screen.getByText('100X50X10')).toBeInTheDocument();
    expect(screen.getByText('120X60X15')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    vi.mocked(useSonListHook.useSonList).mockReturnValue({
      ...mockUseSonList,
      loading: true,
      data: [],
    });

    renderWithRouter(<SonList />);

    expect(screen.queryByText('Filho 1')).not.toBeInTheDocument();
  });

  it('should show error dialog when error occurs', () => {
    vi.mocked(useSonListHook.useSonList).mockReturnValue({
      ...mockUseSonList,
      error: 'Failed to load sons',
      data: [],
    });

    renderWithRouter(<SonList />);

    expect(screen.getByText('Failed to load sons')).toBeInTheDocument();
  });

  it('should navigate to create page when new button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonList />);

    const newButton = screen.getByText('Novo');
    await user.click(newButton);

    expect(mockNavigate).toHaveBeenCalledWith('/sons/create');
  });

  it('should call handleSearch when search is performed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonList />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: '🔎︎' });

    await user.type(searchInput, 'test query');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockUseSonList.handleSearch).toHaveBeenCalled();
    });
  });

  it('should call handleNextPage when next page button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonList />);

    const nextPageButton = screen.getByText('Carregar mais');
    await user.click(nextPageButton);

    expect(mockUseSonList.handleNextPage).toHaveBeenCalled();
  });

  it('should not show next page button when on last page', () => {
    vi.mocked(useSonListHook.useSonList).mockReturnValue({
      ...mockUseSonList,
      isLastPage: true,
    });

    renderWithRouter(<SonList />);

    expect(screen.queryByText('Carregar mais')).not.toBeInTheDocument();
  });

  it('should show confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    expect(screen.getByText(/você tem certeza/i)).toBeInTheDocument();
  });

  it('should call handleDelete when deletion is confirmed', async () => {
    const user = userEvent.setup();
    mockUseSonList.handleDelete.mockResolvedValue(undefined);

    renderWithRouter(<SonList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    const confirmButton = screen.getByText('Sim');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockUseSonList.handleDelete).toHaveBeenCalledWith([1]);
    });
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const editButton = screen.getByRole('button', { name: 'Editar' });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/sons/1');
  });

  it('should call handleInactivate when inactivate button is clicked', async () => {
    const user = userEvent.setup();
    mockUseSonList.handleInactivate.mockResolvedValue(undefined);

    renderWithRouter(<SonList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const inactivateButton = screen.getByRole('button', { name: 'Inativar' });
    await user.click(inactivateButton);

    await waitFor(() => {
      expect(mockUseSonList.handleInactivate).toHaveBeenCalledWith([1]);
    });
  });

  it('should navigate to details page when eye icon is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SonList />);

    const viewLinks = screen.getAllByRole('link', { name: '' });
    await user.click(viewLinks[0]);

    expect(viewLinks[0]).toHaveAttribute('href', '/sons/details/1');
  });

  it('should filter out items in trash', () => {
    const filhosWithTrash = [
      ...mockFilhos,
      {
        ...mockFilhos[0],
        codigo: 3,
        descricao: 'Filho Lixeira',
        situacao: 'LIXEIRA' as const,
      },
    ];

    vi.mocked(useSonListHook.useSonList).mockReturnValue({
      ...mockUseSonList,
      data: filhosWithTrash,
    });

    renderWithRouter(<SonList />);

    expect(screen.getByText('Filho 1')).toBeInTheDocument();
    expect(screen.getByText('Filho 2')).toBeInTheDocument();
    expect(screen.queryByText('Filho Lixeira')).not.toBeInTheDocument();
  });
});
