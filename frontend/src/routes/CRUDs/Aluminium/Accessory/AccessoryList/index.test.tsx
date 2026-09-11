import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AccessoryList from './index';
import * as useAccessoryListHook from '../../../../../hooks/crud/useAccessoryList';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useAccessoryList hook
vi.mock('../../../../../hooks/crud/useAccessoryList');

// Mock authService to allow admin actions
vi.mock('../../../../../services/authService', () => ({
  hasAnyRoles: () => true,
}));

describe('AccessoryList', () => {
  const mockAccessories = [
    {
      codigo: 1,
      descricao: 'Accessory 1',
      situacao: 'ATIVO' as const,
      cor: { codigo: 1, descricao: 'Red', hexa: '#FF0000', situacao: 'ATIVO' as const },
      medidas: { codigo: 1, altura: 100, largura: 50, espessura: 10, situacao: 'ATIVO' as const },
      implantacao: new Date('2024-01-01'),
      valor: 99.99,
    },
    {
      codigo: 2,
      descricao: 'Accessory 2',
      situacao: 'ATIVO' as const,
      cor: { codigo: 2, descricao: 'Blue', hexa: '#0000FF', situacao: 'ATIVO' as const },
      medidas: { altura: 200, largura: 75, espessura: 15, situacao: 'ATIVO' as const, codigo: 2 },
      implantacao: new Date('2024-01-01'),
      valor: 99.99,
    },
  ];

  const mockUseAccessoryList = {
    data: mockAccessories,
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
    vi.mocked(useAccessoryListHook.useAccessoryList).mockReturnValue(mockUseAccessoryList);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render accessory list when data is loaded', () => {
    renderWithRouter(<AccessoryList />);

    expect(screen.getByText('Accessory 1')).toBeInTheDocument();
    expect(screen.getByText('Accessory 2')).toBeInTheDocument();
  });

  it('should show loading skeleton when loading', () => {
    vi.mocked(useAccessoryListHook.useAccessoryList).mockReturnValue({
      ...mockUseAccessoryList,
      loading: true,
      data: [],
    });

    renderWithRouter(<AccessoryList />);

    expect(screen.queryByText('Accessory 1')).not.toBeInTheDocument();
  });

  it('should navigate to create page when new button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AccessoryList />);

    const newButton = screen.getByText('Novo');
    await user.click(newButton);

    expect(mockNavigate).toHaveBeenCalledWith('/accessories/create');
  });

  it('should call handleSearch when search is performed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AccessoryList />);

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: '🔎︎' });

    await user.type(searchInput, 'test query');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockUseAccessoryList.handleSearch).toHaveBeenCalled();
    });
  });

  it('should call handleNextPage when next page button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AccessoryList />);

    const nextPageButton = screen.getByText('Carregar mais');
    await user.click(nextPageButton);

    expect(mockUseAccessoryList.handleNextPage).toHaveBeenCalled();
  });

  it('should not show next page button when on last page', () => {
    vi.mocked(useAccessoryListHook.useAccessoryList).mockReturnValue({
      ...mockUseAccessoryList,
      isLastPage: true,
    });

    renderWithRouter(<AccessoryList />);

    const nextPageButton = screen.queryByText('Carregar mais');
    expect(nextPageButton).not.toBeInTheDocument();
  });

  it('should show confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AccessoryList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    expect(screen.getByText(/você tem certeza/i)).toBeInTheDocument();
  });

  it('should call handleDelete when deletion is confirmed', async () => {
    const user = userEvent.setup();
    mockUseAccessoryList.handleDelete.mockResolvedValue(undefined);

    renderWithRouter(<AccessoryList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const deleteButton = screen.getByRole('button', { name: 'Excluir' });
    await user.click(deleteButton);

    const confirmButton = screen.getByText('Sim');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockUseAccessoryList.handleDelete).toHaveBeenCalledWith([1]);
    });
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AccessoryList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const editButton = screen.getByRole('button', { name: 'Editar' });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/accessories/1');
  });

  it('should call handleInactivate when inactivate button is clicked', async () => {
    const user = userEvent.setup();
    mockUseAccessoryList.handleInactivate.mockResolvedValue(undefined);

    renderWithRouter(<AccessoryList />);

    const dropdownToggles = screen.getAllByRole('button', { name: '⋮' });
    await user.click(dropdownToggles[0]);

    const inactivateButton = screen.getByRole('button', { name: 'Inativar' });
    await user.click(inactivateButton);

    await waitFor(() => {
      expect(mockUseAccessoryList.handleInactivate).toHaveBeenCalledWith([1]);
    });
  });

  it('should show error dialog when error occurs', () => {
    vi.mocked(useAccessoryListHook.useAccessoryList).mockReturnValue({
      ...mockUseAccessoryList,
      error: 'Failed to load accessories',
    });

    renderWithRouter(<AccessoryList />);

    expect(screen.getByText('Failed to load accessories')).toBeInTheDocument();
  });

  it('should filter out items with LIXEIRA status', () => {
    const accessoriesWithTrash = [
      ...mockAccessories,
      {
        codigo: 3,
        descricao: 'Deleted Accessory',
        situacao: 'LIXEIRA' as const,
        cor: { codigo: 3, descricao: 'Gray', hexa: '#808080', situacao: 'ATIVO' as const },
        medidas: { codigo: 3, altura: 150, largura: 60, espessura: 12, situacao: 'ATIVO' as const },
        implantacao: new Date('2024-01-01'),
        valor: 0,
      },
    ];

    vi.mocked(useAccessoryListHook.useAccessoryList).mockReturnValue({
      ...mockUseAccessoryList,
      data: accessoriesWithTrash,
    });

    renderWithRouter(<AccessoryList />);

    expect(screen.queryByText('Deleted Accessory')).not.toBeInTheDocument();
    expect(screen.getByText('Accessory 1')).toBeInTheDocument();
  });
});
