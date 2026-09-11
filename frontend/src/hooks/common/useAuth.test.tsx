import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import * as authService from '../../services/authService';
import { ContextToken } from '../../utils/context-token';
import { ReactNode } from 'react';

// Mock authService
vi.mock('../../services/authService', () => ({
  loginRequest: vi.fn(),
  logout: vi.fn(),
  saveAccessToken: vi.fn(),
  getAccessTokenPayload: vi.fn(),
  isAuthenticated: vi.fn(),
  hasAnyRoles: vi.fn(),
}));

describe('useAuth', () => {
  const mockSetContextTokenPayload = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <ContextToken.Provider
        value={{
          contextTokenPayload: undefined,
          setContextTokenPayload: mockSetContextTokenPayload,
        }}
      >
        {children}
      </ContextToken.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with idle state', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle successful login', async () => {
    const mockToken = 'mock-jwt-token';
    const mockPayload = {
      exp: Date.now() / 1000 + 3600,
      username: 'testuser',
      authorities: ['ROLE_OPERATOR'],
    };

    vi.mocked(authService.loginRequest).mockResolvedValue({
      data: { access_token: mockToken },
    } as any);
    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(mockPayload as any);
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        username: 'testuser',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(authService.loginRequest).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
    expect(authService.saveAccessToken).toHaveBeenCalledWith(mockToken);
    expect(mockSetContextTokenPayload).toHaveBeenCalledWith(mockPayload);
    expect(result.current.user).toEqual(mockPayload);
    expect(result.current.error).toBeNull();
  });

  it('should handle login failure', async () => {
    const mockError = new Error('Invalid credentials');
    vi.mocked(authService.loginRequest).mockRejectedValue(mockError);
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        username: 'testuser',
        password: 'wrongpassword',
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.user).toBeUndefined();
  });

  it('should handle logout', () => {
    const mockPayload = {
      exp: Date.now() / 1000 + 3600,
      username: 'testuser',
      authorities: ['ROLE_OPERATOR'],
    };

    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(mockPayload as any);
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(mockSetContextTokenPayload).toHaveBeenCalledWith(undefined);
  });

  it('should check if user is authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getAccessTokenPayload).mockReturnValue({
      exp: Date.now() / 1000 + 3600,
      username: 'testuser',
      authorities: ['ROLE_OPERATOR'],
    } as any);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should check user roles', () => {
    const mockPayload = {
      exp: Date.now() / 1000 + 3600,
      username: 'testuser',
      authorities: ['ROLE_OPERATOR', 'ROLE_ADMIN'],
    };

    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(mockPayload as any);
    vi.mocked(authService.hasAnyRoles).mockReturnValue(true);
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);

    const { result } = renderHook(() => useAuth(), { wrapper });

    const hasAdminRole = result.current.hasAnyRoles(['ROLE_ADMIN']);
    expect(hasAdminRole).toBe(true);

    vi.mocked(authService.hasAnyRoles).mockReturnValue(false);
    const hasManagerRole = result.current.hasAnyRoles(['ROLE_MANAGER']);
    expect(hasManagerRole).toBe(false);
  });

  it('should set loading state during login', async () => {
    vi.mocked(authService.loginRequest).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ data: { access_token: 'token' } } as any),
            100
          )
        )
    );
    vi.mocked(authService.getAccessTokenPayload).mockReturnValue({
      exp: Date.now() / 1000 + 3600,
      username: 'testuser',
      authorities: ['ROLE_OPERATOR'],
    } as any);

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({
        username: 'testuser',
        password: 'password123',
      });
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
