import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MachineGroupList from './index';
import * as useMachineGroupListHook from '../../../../../hooks/crud/useMachineGroupList';
import { DGrupoMaquina } from '../../../../../models/grupoMaquina';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useMachineGroupList hook
vi.mock('../../../../../hooks/crud/useMachineGroupList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('MachineGroupList', () => {
  const mockGruposMaquinas: DGrupoMaquina[] = [
    {
      codigo: 1,
      nome: 'Grupo A',
      situacao: 'ATIVO' as const,
    },
    {
      codigo: 2,
      nome: 'Grupo B',
      situacao: 'ATIVO' as const,
    },
  ];

  const mockUseMachineGroupList = {
    data: mockGruposMaquinas,
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
    vi.mocked(useMachineGroupListHook.useMachineGroupList).mockReturnValue(mockUseMachineGroupList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render machine group list with title', () => {
    renderWithRouter(<MachineGroupList />);

    expect(screen.getByText('Cadastro de Grupos de Máquinas')).toBeInTheDocument();
  });

  it('should render machine group data when loaded', () => {
    renderWithRouter(<MachineGroupList />);

    expect(screen.getByText('Grupo A')).toBeInTheDocument();
    expect(screen.getByText('Grupo B')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    vi.mocked(useMachineGroupListHook.useMachineGroupList).mockReturnValue({
      ...mockUseMachineGroupList,
      loading: true,
      data: [],
    });

    renderWithRouter(<MachineGroupList />);

    expect(screen.queryByText('Grupo A')).not.toBeInTheDocument();
  });

  it('should show error dialog when error occurs', () => {
    vi.mocked(useMachineGroupListHook.useMachineGroupList).mockReturnValue({
      ...mockUseMachineGroupList,
      error: 'Failed to load machine groups',
      data: [],
    });

    renderWithRouter(<MachineGroupList />);

    expect(screen.getByText('Failed to load machine groups')).toBeInTheDocument();
  });

  it('should navigate to create page when new button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineGroupList />);

    const newButton = screen.getByText('Novo');
    await user.click(newButton);

    expect(mockNavigate).toHaveBeenCalledWith('/machinegroups/create');
  });

  it('should call handleSearch when search is performed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineGroupList />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: '🔎︎' });

    await user.type(searchInput, 'test query');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockUseMachineGroupList.handleSearch).toHaveBeenCalled();
    });
  });

  it('should call handleNextPage when next page button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineGroupList />);

    const nextPageButton = screen.getByText('Carregar mais');
    await user.click(nextPageButton);

    expect(mockUseMachineGroupList.handleNextPage).toHaveBeenCalled();
  });

  it('should not show next page button when on last page', () => {
    vi.mocked(useMachineGroupListHook.useMachineGroupList).mockReturnValue({
      ...mockUseMachineGroupList,
      isLastPage: true,
    });

    renderWithRouter(<MachineGroupList />);

    expect(screen.queryByText('Carregar mais')).not.toBeInTheDocument();
  });

  it('should show confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineGroupList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    expect(screen.getByText(/você tem certeza/i)).toBeInTheDocument();
  });

  it('should call handleDelete when deletion is confirmed', async () => {
    const user = userEvent.setup();
    mockUseMachineGroupList.handleDelete.mockResolvedValue(undefined);

    renderWithRouter(<MachineGroupList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    const confirmButton = screen.getByText('Sim');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockUseMachineGroupList.handleDelete).toHaveBeenCalledWith([1]);
    });
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineGroupList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const editButton = screen.getByRole('button', { name: 'Editar' });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/machinegroups/1');
  });

  it('should call handleInactivate when inactivate button is clicked', async () => {
    const user = userEvent.setup();
    mockUseMachineGroupList.handleInactivate.mockResolvedValue(undefined);

    renderWithRouter(<MachineGroupList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const inactivateButton = screen.getByRole('button', { name: 'Inativar' });
    await user.click(inactivateButton);

    await waitFor(() => {
      expect(mockUseMachineGroupList.handleInactivate).toHaveBeenCalledWith([1]);
    });
  });

  it('should filter out items in trash', () => {
    const gruposWithTrash = [
      ...mockGruposMaquinas,
      {
        codigo: 3,
        nome: 'Grupo Lixeira',
        situacao: 'LIXEIRA' as const,
      },
    ];

    vi.mocked(useMachineGroupListHook.useMachineGroupList).mockReturnValue({
      ...mockUseMachineGroupList,
      data: gruposWithTrash,
    });

    renderWithRouter(<MachineGroupList />);

    expect(screen.getByText('Grupo A')).toBeInTheDocument();
    expect(screen.getByText('Grupo B')).toBeInTheDocument();
    expect(screen.queryByText('Grupo Lixeira')).not.toBeInTheDocument();
  });
});
