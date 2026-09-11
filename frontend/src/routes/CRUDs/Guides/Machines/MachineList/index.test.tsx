import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MachineList from './index';
import * as useMachineListHook from '../../../../../hooks/crud/useMachineList';
import { DMaquina } from '../../../../../models/maquina';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useMachineList hook
vi.mock('../../../../../hooks/crud/useMachineList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('MachineList', () => {
  const mockMaquinas: DMaquina[] = [
    {
      codigo: 1,
      nome: 'Máquina 1',
      formula: ['x * y'],
      valor: 100.0,
      grupoMaquina: { codigo: 1, nome: 'Grupo A', situacao: 'ATIVO' },
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      nome: 'Máquina 2',
      formula: ['a + b'],
      valor: 150.0,
      grupoMaquina: { codigo: 2, nome: 'Grupo B', situacao: 'ATIVO' },
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseMachineList = {
    data: mockMaquinas,
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
    vi.mocked(useMachineListHook.useMachineList).mockReturnValue(mockUseMachineList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render machine list with title', () => {
    renderWithRouter(<MachineList />);

    expect(screen.getByText('Cadastro de Máquina')).toBeInTheDocument();
  });

  it('should render machine data when loaded', () => {
    renderWithRouter(<MachineList />);

    expect(screen.getByText('Máquina 1')).toBeInTheDocument();
    expect(screen.getByText('Máquina 2')).toBeInTheDocument();
    expect(screen.getByText('Grupo A')).toBeInTheDocument();
    expect(screen.getByText('Grupo B')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    vi.mocked(useMachineListHook.useMachineList).mockReturnValue({
      ...mockUseMachineList,
      loading: true,
      data: [],
    });

    renderWithRouter(<MachineList />);

    expect(screen.queryByText('Máquina 1')).not.toBeInTheDocument();
  });

  it('should show error dialog when error occurs', () => {
    vi.mocked(useMachineListHook.useMachineList).mockReturnValue({
      ...mockUseMachineList,
      error: 'Failed to load machines',
      data: [],
    });

    renderWithRouter(<MachineList />);

    expect(screen.getByText('Failed to load machines')).toBeInTheDocument();
  });

  it('should navigate to create page when new button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineList />);

    const newButton = screen.getByText('Novo');
    await user.click(newButton);

    expect(mockNavigate).toHaveBeenCalledWith('/machines/create');
  });

  it('should call handleSearch when search is performed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineList />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: '🔎︎' });

    await user.type(searchInput, 'test query');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockUseMachineList.handleSearch).toHaveBeenCalled();
    });
  });

  it('should call handleNextPage when next page button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineList />);

    const nextPageButton = screen.getByText('Carregar mais');
    await user.click(nextPageButton);

    expect(mockUseMachineList.handleNextPage).toHaveBeenCalled();
  });

  it('should not show next page button when on last page', () => {
    vi.mocked(useMachineListHook.useMachineList).mockReturnValue({
      ...mockUseMachineList,
      isLastPage: true,
    });

    renderWithRouter(<MachineList />);

    expect(screen.queryByText('Carregar mais')).not.toBeInTheDocument();
  });

  it('should show confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    expect(screen.getByText(/você tem certeza/i)).toBeInTheDocument();
  });

  it('should call handleDelete when deletion is confirmed', async () => {
    const user = userEvent.setup();
    mockUseMachineList.handleDelete.mockResolvedValue(undefined);

    renderWithRouter(<MachineList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    const confirmButton = screen.getByText('Sim');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockUseMachineList.handleDelete).toHaveBeenCalledWith([1]);
    });
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const editButton = screen.getByRole('button', { name: 'Editar' });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/machines/1');
  });

  it('should call handleInactivate when inactivate button is clicked', async () => {
    const user = userEvent.setup();
    mockUseMachineList.handleInactivate.mockResolvedValue(undefined);

    renderWithRouter(<MachineList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const inactivateButton = screen.getByRole('button', { name: 'Inativar' });
    await user.click(inactivateButton);

    await waitFor(() => {
      expect(mockUseMachineList.handleInactivate).toHaveBeenCalledWith([1]);
    });
  });

  it('should filter out items in trash', () => {
    const maquinasWithTrash = [
      ...mockMaquinas,
      {
        codigo: 3,
        nome: 'Máquina Lixeira',
        formula: ['x'],
        valor: 50.0,
        grupoMaquina: { codigo: 3, nome: 'Grupo C', situacao: 'ATIVO' as const },
        situacao: 'LIXEIRA' as const,
      },
    ];

    vi.mocked(useMachineListHook.useMachineList).mockReturnValue({
      ...mockUseMachineList,
      data: maquinasWithTrash,
    });

    renderWithRouter(<MachineList />);

    expect(screen.getByText('Máquina 1')).toBeInTheDocument();
    expect(screen.getByText('Máquina 2')).toBeInTheDocument();
    expect(screen.queryByText('Máquina Lixeira')).not.toBeInTheDocument();
  });
});
