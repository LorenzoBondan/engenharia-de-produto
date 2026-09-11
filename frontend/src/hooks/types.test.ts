import { describe, it, expect } from 'vitest';
import type {
  HookState,
  PageResponse,
  FormDataStructure,
  AuthState,
  ActionType
} from './types';

describe('Hook Types', () => {
  it('should define HookState discriminated union correctly', () => {
    const idleState: HookState<string> = {
      status: 'idle',
      data: null,
      error: null
    };

    const loadingState: HookState<string> = {
      status: 'loading',
      data: null,
      error: null
    };

    const successState: HookState<string> = {
      status: 'success',
      data: 'test data',
      error: null
    };

    const errorState: HookState<string> = {
      status: 'error',
      data: null,
      error: 'test error'
    };

    expect(idleState.status).toBe('idle');
    expect(loadingState.status).toBe('loading');
    expect(successState.status).toBe('success');
    expect(successState.data).toBe('test data');
    expect(errorState.status).toBe('error');
    expect(errorState.error).toBe('test error');
  });

  it('should define PageResponse interface correctly', () => {
    const pageResponse: PageResponse<{ id: number; name: string }> = {
      content: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ],
      last: false,
      totalElements: 10,
      totalPages: 2,
      number: 0,
      size: 5
    };

    expect(pageResponse.content).toHaveLength(2);
    expect(pageResponse.last).toBe(false);
    expect(pageResponse.totalElements).toBe(10);
  });

  it('should define FormDataStructure correctly', () => {
    const formData: FormDataStructure = {
      username: {
        value: 'test@example.com',
        id: 'username',
        name: 'username',
        type: 'email',
        placeholder: 'Email',
        validation: (value) => typeof value === 'string' && value.length > 0,
        message: 'Email is required',
        dirty: 'false',
        invalid: 'false'
      },
      password: {
        value: 'password123',
        id: 'password',
        name: 'password',
        type: 'password',
        dirty: 'false',
        invalid: 'false'
      }
    };

    expect(formData.username.value).toBe('test@example.com');
    expect(formData.username.validation?.('test')).toBe(true);
    expect(formData.password.value).toBe('password123');
  });

  it('should define AuthState discriminated union correctly', () => {
    const authenticatedState: AuthState = {
      status: 'authenticated',
      user: {
        exp: Date.now() + 3600000,
        username: 'testuser',
        authorities: ['ROLE_ADMIN', 'ROLE_OPERATOR'],
      },
      error: null
    };

    const unauthenticatedState: AuthState = {
      status: 'unauthenticated',
      user: null,
      error: null
    };

    expect(authenticatedState.status).toBe('authenticated');
    expect(authenticatedState.user?.username).toBe('testuser');
    expect(unauthenticatedState.status).toBe('unauthenticated');
  });

  it('should define ActionType correctly', () => {
    const deleteAction: ActionType = 'delete';
    const inactivateAction: ActionType = 'inactivate';
    const customAction: ActionType = 'custom';

    expect(deleteAction).toBe('delete');
    expect(inactivateAction).toBe('inactivate');
    expect(customAction).toBe('custom');
  });

  it('should allow type-safe narrowing for HookState', () => {
    const state: HookState<number> = {
      status: 'success',
      data: 42,
      error: null
    };

    if (state.status === 'success') {
      // TypeScript should allow accessing data here
      const data: number = state.data;
      expect(data).toBe(42);
    }

    const errorState: HookState<number> = {
      status: 'error',
      data: null,
      error: 'test error'
    };

    if (errorState.status === 'error') {
      // This block should execute for error state
      expect(errorState.error).toBe('test error');
    }
  });
});
