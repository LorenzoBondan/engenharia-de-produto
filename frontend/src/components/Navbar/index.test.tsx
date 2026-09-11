import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './index';
import { ContextToken } from '../../utils/context-token';
import * as authService from '../../services/authService';

// Mock the authService module
vi.mock('../../services/authService', () => ({
  logout: vi.fn(),
  isAuthenticated: vi.fn(),
  hasAnyRoles: vi.fn(),
}));

describe('Navbar', () => {
  const mockSetContextTokenPayload = vi.fn();

  const mockContextValue = {
    contextTokenPayload: {
      exp: Date.now() / 1000 + 3600,
      username: 'testuser',
      authorities: ['ROLE_ADMIN'],
    },
    setContextTokenPayload: mockSetContextTokenPayload,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render navbar with logo', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const logo = screen.getByRole('img', { name: /logo/i });
    expect(logo).toBeInTheDocument();
  });

  it('should render hamburger menu button', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    expect(hamburger).toBeInTheDocument();
  });

  it('should toggle navbar expansion when hamburger is clicked', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    const nav = container.querySelector('nav');

    // Initially collapsed (confusing naming: false = admin-nav-container-expanded)
    expect(nav).toHaveClass('admin-nav-container-expanded');

    if (hamburger) {
      fireEvent.click(hamburger);
    }

    // After click, expanded (true = admin-nav-container)
    expect(nav).toHaveClass('admin-nav-container');
  });

  it('should render navigation links when authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    // Need to expand menu first to see text
    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    expect(screen.getByText('Estruturas')).toBeInTheDocument();
    expect(screen.getByText('Itens')).toBeInTheDocument();
    expect(screen.getByText('Materiais base')).toBeInTheDocument();
  });

  it('should not render navigation links when not authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText('Estruturas')).not.toBeInTheDocument();
    expect(screen.queryByText('Itens')).not.toBeInTheDocument();
  });

  it('should render trash link for ANALYST role', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockImplementation((roles) => {
      return roles.includes('ROLE_ANALYST');
    });

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    expect(screen.getByText('Lixeira')).toBeInTheDocument();
  });

  it('should render trash link for ADMIN role', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockImplementation((roles) => {
      return roles.includes('ROLE_ADMIN');
    });

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    expect(screen.getByText('Lixeira')).toBeInTheDocument();
  });

  it('should render admin link for ADMIN role only', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockImplementation((roles) => {
      return roles.includes('ROLE_ADMIN') && roles.length === 1;
    });

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should not render admin link for non-admin users', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('should render profile link when authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('should render reports link when authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('should render logout link when authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should call logout and clear context when logout is clicked', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    const logoutLink = screen.getByText('Logout');
    fireEvent.click(logoutLink);

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(mockSetContextTokenPayload).toHaveBeenCalledWith(undefined);
  });

  it('should display username when authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('should not display username when not authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    const unauthenticatedContext = {
      contextTokenPayload: undefined,
      setContextTokenPayload: mockSetContextTokenPayload,
    };

    render(
      <MemoryRouter>
        <ContextToken.Provider value={unauthenticatedContext}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText('testuser')).not.toBeInTheDocument();
  });

  it('should have correct link to home page', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: /logo/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should have correct link to structures page', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    const structsLink = screen.getByRole('link', { name: /estruturas/i });
    expect(structsLink).toHaveAttribute('href', '/homestructs');
  });

  it('should have correct link to items page', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    const itemsLink = screen.getByRole('link', { name: /^itens$/i });
    expect(itemsLink).toHaveAttribute('href', '/homeitems');
  });

  it('should hide menu text when collapsed', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    const { container } = render(
      <MemoryRouter>
        <ContextToken.Provider value={mockContextValue}>
          <Navbar />
        </ContextToken.Provider>
      </MemoryRouter>
    );

    // Initially collapsed (text hidden, class is admin-nav-container-expanded)
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('admin-nav-container-expanded');

    const hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      fireEvent.click(hamburger);
    }

    // After click, expanded (text visible, class is admin-nav-container)
    expect(nav).toHaveClass('admin-nav-container');
  });
});
