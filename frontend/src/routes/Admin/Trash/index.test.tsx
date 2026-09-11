import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Trash from './index';
import * as lixeiraService from '../../../services/lixeiraService';
import { createMockAxiosResponse } from '../../../tests/helpers/mockFactories';

vi.mock('../../../services/lixeiraService');

describe('Trash', () => {
  const mockLixeiraItems = [
    {
      id: 1,
      nometabela: 'users',
      entidadeid: { id: 10 },
      data: '2024-01-01T10:00:00',
      usuario: 'admin',
      situacao: 'ATIVO',
    },
    {
      id: 2,
      nometabela: 'products',
      entidadeid: { id: 20 },
      data: '2024-01-02T11:00:00',
      usuario: 'admin',
      situacao: 'ATIVO',
    },
  ];

  const mockResponse = {
    content: mockLixeiraItems,
    last: false,
    totalPages: 2,
    totalElements: 10,
    number: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(lixeiraService.pesquisarTodos).mockResolvedValue(
      createMockAxiosResponse(mockResponse)
    );
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should load trash items on mount', async () => {
    renderWithRouter(<Trash />);

    await waitFor(() => {
      expect(lixeiraService.pesquisarTodos).toHaveBeenCalledWith(
        '',
        '=',
        '',
        0,
        8,
        'id;a'
      );
    });
  });

  it('should display trash items after loading', async () => {
    renderWithRouter(<Trash />);

    await waitFor(() => {
      expect(screen.getByText('users')).toBeInTheDocument();
      expect(screen.getByText('products')).toBeInTheDocument();
    });
  });

  it('should load next page when next page button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Trash />);

    await waitFor(() => {
      expect(screen.getByText('users')).toBeInTheDocument();
    });

    const nextPageButton = screen.getByText('Carregar mais');
    await user.click(nextPageButton);

    await waitFor(() => {
      expect(lixeiraService.pesquisarTodos).toHaveBeenCalledWith(
        '',
        '=',
        '',
        1,
        8,
        'id;a'
      );
    });
  });

  it('should not show next page button when on last page', async () => {
    vi.mocked(lixeiraService.pesquisarTodos).mockResolvedValue(
      createMockAxiosResponse({ ...mockResponse, last: true })
    );

    renderWithRouter(<Trash />);

    await waitFor(() => {
      expect(screen.getByText('users')).toBeInTheDocument();
    });

    const nextPageButton = screen.queryByText('Carregar mais');
    expect(nextPageButton).not.toBeInTheDocument();
  });

  it('should show confirmation dialog when restore is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Trash />);

    await waitFor(() => {
      expect(screen.getByText('users')).toBeInTheDocument();
    });

    const restoreButtons = screen.getAllByRole('button', { name: /recuperar/i });
    await user.click(restoreButtons[0]);

    expect(screen.getByText(/deseja recuperar os dependentes/i)).toBeInTheDocument();
  });

  it('should handle restore confirmation', async () => {
    const user = userEvent.setup();
    vi.mocked(lixeiraService.recuperarPorId).mockResolvedValue(createMockAxiosResponse({}));

    renderWithRouter(<Trash />);

    await waitFor(() => {
      expect(screen.getByText('users')).toBeInTheDocument();
    });

    const restoreButtons = screen.getAllByRole('button', { name: /recuperar/i });
    await user.click(restoreButtons[0]);

    const confirmButton = screen.getByRole('button', { name: /sim/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(lixeiraService.recuperarPorId).toHaveBeenCalled();
    });
  });
});
