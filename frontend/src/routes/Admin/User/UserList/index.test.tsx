import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UserList from './index';
import * as useUserListHook from '../../../../hooks/admin/useUserList';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useUserList hook
vi.mock('../../../../hooks/admin/useUserList');

// Mock authService to allow admin actions
vi.mock('../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('UserList', () => {
  const mockUsers: any[] = [
    {
      id: 1,
      name: 'User 1',
      email: 'user1@test.com',
      situacao: 'ATIVO',
      password: '',
      userAnexo: {
        codigo: 1,
        user: {} as any, // Circular reference - minimal mock to avoid infinite recursion
        anexo: {
          codigo: 1,
          nomeArquivo: 'user1-photo.jpg',
          tipoArquivo: 'image/jpeg',
          tamanho: 1024,
          binario: {
            codigo: 1,
            conteudo: new Uint8Array([]),
          },
        },
      },
      roles: [],
    },
    {
      id: 2,
      name: 'User 2',
      email: 'user2@test.com',
      situacao: 'ATIVO',
      password: '',
      userAnexo: {
        codigo: 2,
        user: {} as any, // Circular reference - minimal mock to avoid infinite recursion
        anexo: {
          codigo: 2,
          nomeArquivo: 'user2-photo.jpg',
          tipoArquivo: 'image/jpeg',
          tamanho: 2048,
          binario: {
            codigo: 2,
            conteudo: new Uint8Array([]),
          },
        },
      },
      roles: [],
    },
  ];

  const mockUseUserList = {
    data: mockUsers,
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
    vi.mocked(useUserListHook.useUserList).mockReturnValue(mockUseUserList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render user list when data is loaded', () => {
    renderWithRouter(<UserList />);

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    vi.mocked(useUserListHook.useUserList).mockReturnValue({
      ...mockUseUserList,
      loading: true,
      data: [],
    });

    renderWithRouter(<UserList />);

    expect(screen.queryByText('User 1')).not.toBeInTheDocument();
  });

  it('should show error message when error occurs', () => {
    vi.mocked(useUserListHook.useUserList).mockReturnValue({
      ...mockUseUserList,
      error: 'Failed to load users',
      data: [],
    });

    renderWithRouter(<UserList />);

    expect(screen.getByText(/Failed to load users/i)).toBeInTheDocument();
  });

  it('should navigate to create page when new button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserList />);

    const newButton = screen.getByText('Novo');
    await user.click(newButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/users/create');
  });

  it('should call handleSearch when search is performed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserList />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: '🔎︎' });

    await user.type(searchInput, 'test query');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockUseUserList.handleSearch).toHaveBeenCalled();
    });
  });

  it('should call handleNextPage when next page button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserList />);

    const nextPageButton = screen.getByText('Carregar mais');
    await user.click(nextPageButton);

    expect(mockUseUserList.handleNextPage).toHaveBeenCalled();
  });

  it('should not show next page button when on last page', () => {
    vi.mocked(useUserListHook.useUserList).mockReturnValue({
      ...mockUseUserList,
      isLastPage: true,
    });

    renderWithRouter(<UserList />);

    const nextPageButton = screen.queryByText('Carregar mais');
    expect(nextPageButton).not.toBeInTheDocument();
  });

  it('should show confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserList />);

    // Open dropdown menu
    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    // Click delete option
    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    expect(screen.getByText(/você tem certeza/i)).toBeInTheDocument();
  });

  it('should call handleDelete when deletion is confirmed', async () => {
    const user = userEvent.setup();
    mockUseUserList.handleDelete.mockResolvedValue(undefined);

    renderWithRouter(<UserList />);

    // Open dropdown menu
    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    // Click delete option
    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    const confirmButton = screen.getByText('Sim');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockUseUserList.handleDelete).toHaveBeenCalledWith([1]);
    });
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserList />);

    // Open dropdown menu
    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    // Click edit option
    const editButton = screen.getByRole('button', { name: 'Editar' });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/users/1');
  });

  it('should call handleInactivate when inactivate button is clicked', async () => {
    const user = userEvent.setup();
    mockUseUserList.handleInactivate.mockResolvedValue(undefined);

    renderWithRouter(<UserList />);

    // Open dropdown menu
    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    // Click inactivate option
    const inactivateButton = screen.getByRole('button', { name: 'Inativar' });
    await user.click(inactivateButton);

    await waitFor(() => {
      expect(mockUseUserList.handleInactivate).toHaveBeenCalledWith([1]);
    });
  });
});
