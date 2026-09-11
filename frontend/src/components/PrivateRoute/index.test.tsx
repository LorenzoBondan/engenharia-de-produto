import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './index';
import * as authService from '../../services/authService';

// Mock the authService module
vi.mock('../../services/authService', () => ({
  isAuthenticated: vi.fn(),
  hasAnyRoles: vi.fn(),
}));

describe('PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when authenticated and no roles required', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div>Protected Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <div>Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render children when authenticated with required role', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['ROLE_ADMIN']}>
                <div>Admin Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should redirect to operations when authenticated but lacking required role', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['ROLE_ADMIN']}>
                <div>Admin Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/operations" element={<div>Operations Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.getByText('Operations Page')).toBeInTheDocument();
  });

  it('should render children when authenticated with ROLE_ADMIN', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockImplementation((roles) => {
      return roles.includes('ROLE_ADMIN');
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['ROLE_ADMIN']}>
                <div>Admin Panel</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('should render children when authenticated with ROLE_ANALYST', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockImplementation((roles) => {
      return roles.includes('ROLE_ANALYST');
    });

    render(
      <MemoryRouter initialEntries={['/analyst']}>
        <Routes>
          <Route
            path="/analyst"
            element={
              <PrivateRoute roles={['ROLE_ANALYST']}>
                <div>Analyst Panel</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Analyst Panel')).toBeInTheDocument();
  });

  it('should render children when authenticated with ROLE_OPERATOR', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockImplementation((roles) => {
      return roles.includes('ROLE_OPERATOR');
    });

    render(
      <MemoryRouter initialEntries={['/operator']}>
        <Routes>
          <Route
            path="/operator"
            element={
              <PrivateRoute roles={['ROLE_OPERATOR']}>
                <div>Operator Panel</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Operator Panel')).toBeInTheDocument();
  });

  it('should allow access with any of multiple required roles', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/multi']}>
        <Routes>
          <Route
            path="/multi"
            element={
              <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_ANALYST']}>
                <div>Multi Role Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Multi Role Content')).toBeInTheDocument();
    expect(authService.hasAnyRoles).toHaveBeenCalledWith(['ROLE_ADMIN', 'ROLE_ANALYST']);
  });

  it('should deny access when user has none of the required roles', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/restricted']}>
        <Routes>
          <Route
            path="/restricted"
            element={
              <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_ANALYST']}>
                <div>Restricted Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/operations" element={<div>Operations Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Restricted Content')).not.toBeInTheDocument();
    expect(screen.getByText('Operations Page')).toBeInTheDocument();
  });

  it('should render children when roles array is empty', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/public']}>
        <Routes>
          <Route
            path="/public"
            element={
              <PrivateRoute roles={[]}>
                <div>Public Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated regardless of roles', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute roles={['ROLE_ADMIN']}>
                <div>Protected Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should call isAuthenticated exactly once', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route
            path="/test"
            element={
              <PrivateRoute>
                <div>Test Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(authService.isAuthenticated).toHaveBeenCalledTimes(1);
  });

  it('should call hasAnyRoles with correct roles', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route
            path="/test"
            element={
              <PrivateRoute roles={['ROLE_ADMIN', 'ROLE_OPERATOR']}>
                <div>Test Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(authService.hasAnyRoles).toHaveBeenCalledWith(['ROLE_ADMIN', 'ROLE_OPERATOR']);
  });

  it('should not call hasAnyRoles when not authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route
            path="/test"
            element={
              <PrivateRoute roles={['ROLE_ADMIN']}>
                <div>Test Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(authService.hasAnyRoles).not.toHaveBeenCalled();
  });

  it('should render complex JSX children', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/complex']}>
        <Routes>
          <Route
            path="/complex"
            element={
              <PrivateRoute>
                <div>
                  <h1>Title</h1>
                  <p>Paragraph</p>
                  <button>Action</button>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('should check authentication state on render', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute roles={['ROLE_ADMIN']}>
                <div>Protected Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(authService.isAuthenticated).toHaveBeenCalled();
    expect(authService.hasAnyRoles).toHaveBeenCalled();
  });

  it('should work with default roles parameter', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/default']}>
        <Routes>
          <Route
            path="/default"
            element={
              <PrivateRoute>
                <div>Default Roles Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Default Roles Content')).toBeInTheDocument();
    expect(authService.hasAnyRoles).toHaveBeenCalledWith([]);
  });

  it('should prioritize authentication check over role check', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route
            path="/test"
            element={
              <PrivateRoute roles={['ROLE_ADMIN']}>
                <div>Test Content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/operations" element={<div>Operations Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to login, not operations, because auth failed first
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Operations Page')).not.toBeInTheDocument();
  });
});
