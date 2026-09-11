import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogin } from './useLogin';
import * as authService from '../../services/authService';
import { BrowserRouter } from 'react-router-dom';
import { ContextToken } from '../../utils/context-token';
import { useState } from 'react';

vi.mock('../../services/authService');

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper component with ContextToken
function Wrapper({ children }: { children: React.ReactNode }) {
  const [contextTokenPayload, setContextTokenPayload] = useState<any>(undefined);

  return (
    <BrowserRouter>
      <ContextToken.Provider value={{ contextTokenPayload, setContextTokenPayload }}>
        {children}
      </ContextToken.Provider>
    </BrowserRouter>
  );
}

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('should initialize with empty form', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    expect(result.current.formData.username.value).toBe('');
    expect(result.current.formData.password.value).toBe('');
    expect(result.current.submitResponseFail).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should update username field on input change', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    act(() => {
      const event = {
        target: { name: 'username', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleInputChange(event);
    });

    expect(result.current.formData.username.value).toBe('test@example.com');
  });

  it('should update password field on input change', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    act(() => {
      const event = {
        target: { name: 'password', value: 'mypassword123' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleInputChange(event);
    });

    expect(result.current.formData.password.value).toBe('mypassword123');
  });

  it('should validate email format', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    act(() => {
      const event = {
        target: { name: 'username', value: 'invalid-email' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleInputChange(event);
    });

    expect(result.current.formData.username.invalid).toBe('true');
  });

  it('should mark field as dirty', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    act(() => {
      result.current.handleTurnDirty('username');
    });

    expect(result.current.formData.username.dirty).toBe('true');
  });

  it('should not submit with invalid email', async () => {
    vi.mocked(authService.loginRequest).mockResolvedValue({
      data: { access_token: 'fake-token' },
    } as any);

    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    await act(async () => {
      const event = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent;
      result.current.handleSubmit(event);
    });

    expect(authService.loginRequest).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.formData.username.invalid).toBe('true');
  });

  it('should submit successfully with valid credentials', async () => {
    vi.mocked(authService.loginRequest).mockResolvedValue({
      data: { access_token: 'fake-token' },
    } as any);

    vi.mocked(authService.getAccessTokenPayload).mockReturnValue({
      username: 'test@example.com',
      authorities: ['ROLE_USER'],
      exp: Date.now() / 1000 + 3600,
    } as any);

    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    // Fill form with valid data
    act(() => {
      result.current.handleInputChange({
        target: { name: 'username', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleInputChange({
        target: { name: 'password', value: 'password123' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Verify form is filled
    expect(result.current.formData.username.value).toBe('test@example.com');
    expect(result.current.formData.password.value).toBe('password123');

    // Submit form
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(authService.loginRequest).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(result.current.submitResponseFail).toBe(false);
  });

  it('should show error on login failure', async () => {
    vi.mocked(authService.loginRequest).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    // Fill form with valid data
    act(() => {
      result.current.handleInputChange({
        target: { name: 'username', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleInputChange({
        target: { name: 'password', value: 'wrongpassword' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.submitResponseFail).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should clear error on new submission', async () => {
    vi.mocked(authService.loginRequest).mockRejectedValueOnce(new Error('Invalid'));
    vi.mocked(authService.getAccessTokenPayload).mockReturnValue({
      username: 'test@example.com',
      authorities: ['ROLE_USER'],
      exp: Date.now() / 1000 + 3600,
    } as any);

    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    // Fill and submit (will fail)
    act(() => {
      result.current.handleInputChange({
        target: { name: 'username', value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleInputChange({
        target: { name: 'password', value: 'wrong' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.submitResponseFail).toBe(true);
    expect(result.current.loading).toBe(false);

    // Mock successful response for second submission
    vi.mocked(authService.loginRequest).mockResolvedValueOnce({
      data: { access_token: 'fake-token' },
    } as any);

    // Submit again - error should be cleared
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(result.current.submitResponseFail).toBe(false);
    expect(result.current.loading).toBe(false);
  });
});
