import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCurrentUser } from './useCurrentUser';
import * as authService from '../../services/authService';

vi.mock('../../services/authService');

describe('useCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return current user from auth service', () => {
    const mockUser = {
      username: 'user@example.com',
      authorities: ['ROLE_USER'],
      exp: Date.now() / 1000 + 3600,
    };

    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(mockUser as any);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should return null when no user is authenticated', () => {
    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(undefined);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should check if user has specific role', () => {
    const mockUser = {
      username: 'admin@example.com',
      authorities: ['ROLE_ADMIN', 'ROLE_USER'],
      exp: Date.now() / 1000 + 3600,
    };

    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(mockUser as any);
    vi.mocked(authService.hasAnyRoles).mockImplementation((roles) =>
      roles.some((role: string) => mockUser.authorities.includes(role))
    );

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.hasRole('ROLE_ADMIN')).toBe(true);
    expect(result.current.hasRole('ROLE_MANAGER')).toBe(false);
  });

  it('should check if user has any of multiple roles', () => {
    const mockUser = {
      username: 'user@example.com',
      authorities: ['ROLE_USER'],
      exp: Date.now() / 1000 + 3600,
    };

    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(mockUser as any);
    vi.mocked(authService.hasAnyRoles).mockImplementation((roles) =>
      roles.some((role: string) => mockUser.authorities.includes(role))
    );

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.hasAnyRoles(['ROLE_ADMIN', 'ROLE_USER'])).toBe(true);
    expect(result.current.hasAnyRoles(['ROLE_ADMIN', 'ROLE_MANAGER'])).toBe(
      false
    );
  });

  it('should get user email from username field', () => {
    const mockUser = {
      username: 'test@example.com',
      authorities: ['ROLE_USER'],
      exp: Date.now() / 1000 + 3600,
    };

    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(mockUser as any);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.email).toBe('test@example.com');
  });

  it('should return null email when no user', () => {
    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(undefined);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.email).toBeNull();
  });

  it('should get user roles', () => {
    const mockUser = {
      username: 'user@example.com',
      authorities: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_MANAGER'],
      exp: Date.now() / 1000 + 3600,
    };

    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(mockUser as any);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.roles).toEqual([
      'ROLE_ADMIN',
      'ROLE_USER',
      'ROLE_MANAGER',
    ]);
  });

  it('should return empty array for roles when no user', () => {
    vi.mocked(authService.getAccessTokenPayload).mockReturnValue(undefined);

    const { result } = renderHook(() => useCurrentUser());

    expect(result.current.roles).toEqual([]);
  });
});
