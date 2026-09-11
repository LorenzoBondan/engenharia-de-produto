import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserForm } from './useUserForm';
import * as useEntityForm from '../common/useEntityForm';
import * as roleService from '../../services/roleService';
import { AxiosResponse } from 'axios';

// Mock the dependencies
vi.mock('../common/useEntityForm');
vi.mock('../../services/roleService');

describe('useUserForm', () => {
  const mockUseEntityForm = vi.mocked(useEntityForm.useEntityForm);
  const mockPesquisarTodos = vi.mocked(roleService.pesquisarTodos);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Hook Initialization', () => {
    it('should initialize with create mode when no userId provided', () => {
      const mockEntityFormReturn = {
        formData: {
          name: { value: '', dirty: '', invalid: '' },
          password: { value: '', dirty: '', invalid: '' },
          email: { value: '', dirty: '', invalid: '' },
          roles: { value: [], dirty: '', invalid: '' },
        },
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      renderHook(() => useUserForm());

      expect(mockUseEntityForm).toHaveBeenCalled();
      const config = mockUseEntityForm.mock.calls[0][0];
      expect(config.entityId).toBeUndefined();
      expect(config.fetchFunction).toBeUndefined();
    });

    it('should initialize with edit mode when userId provided', () => {
      const mockEntityFormReturn = {
        formData: {
          name: { value: 'John Doe', dirty: '', invalid: '' },
          password: { value: '', dirty: '', invalid: '' },
          email: { value: 'john@example.com', dirty: '', invalid: '' },
          roles: { value: [], dirty: '', invalid: '' },
        },
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      renderHook(() => useUserForm(123));

      expect(mockUseEntityForm).toHaveBeenCalled();
      const config = mockUseEntityForm.mock.calls[0][0];
      expect(config.entityId).toBe(123);
      expect(config.fetchFunction).toBeDefined();
    });

    it('should configure initial form data with correct fields', () => {
      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      renderHook(() => useUserForm());

      const config = mockUseEntityForm.mock.calls[0][0];
      const initialFormData = config.initialFormData as any;

      expect(initialFormData).toHaveProperty('name');
      expect(initialFormData).toHaveProperty('password');
      expect(initialFormData).toHaveProperty('email');
      expect(initialFormData).toHaveProperty('roles');
    });
  });

  describe('Form Field Configuration', () => {
    it('should configure name field with validation', () => {
      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      renderHook(() => useUserForm());

      const config = mockUseEntityForm.mock.calls[0][0];
      const nameField = (config.initialFormData as any).name;

      expect(nameField.id).toBe('name');
      expect(nameField.type).toBe('text');
      expect(nameField.validation).toBeDefined();
      expect(nameField.validation('John')).toBe(true);
      expect(nameField.validation('Jo')).toBe(false);
      expect(nameField.validation('a'.repeat(51))).toBe(false);
    });

    it('should configure password field with validation', () => {
      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      renderHook(() => useUserForm());

      const config = mockUseEntityForm.mock.calls[0][0];
      const passwordField = (config.initialFormData as any).password;

      expect(passwordField.id).toBe('password');
      expect(passwordField.type).toBe('password');
      expect(passwordField.validation).toBeDefined();
      expect(passwordField.validation('pass')).toBe(true);
      expect(passwordField.validation('pa')).toBe(false);
    });

    it('should configure email field with validation', () => {
      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      renderHook(() => useUserForm());

      const config = mockUseEntityForm.mock.calls[0][0];
      const emailField = (config.initialFormData as any).email;

      expect(emailField.id).toBe('email');
      expect(emailField.type).toBe('text');
      expect(emailField.validation).toBeDefined();
      expect(emailField.validation('test@example.com')).toBe(true);
      expect(emailField.validation('em')).toBe(false);
    });

    it('should configure roles field with validation', () => {
      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      renderHook(() => useUserForm());

      const config = mockUseEntityForm.mock.calls[0][0];
      const rolesField = (config.initialFormData as any).roles;

      expect(rolesField.id).toBe('roles');
      expect(rolesField.validation).toBeDefined();
      expect(rolesField.validation([{ id: 1, authority: 'ROLE_ADMIN' }])).toBe(true);
      expect(rolesField.validation([])).toBe(false);
    });
  });

  describe('Roles Loading', () => {
    it('should load roles on mount', async () => {
      const mockRoles = [
        { id: 1, authority: 'ROLE_ADMIN' },
        { id: 2, authority: 'ROLE_USER' },
      ];

      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: mockRoles },
      } as AxiosResponse);

      const { result } = renderHook(() => useUserForm());

      expect(result.current.rolesLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.roles).toEqual(mockRoles);
        expect(result.current.rolesLoading).toBe(false);
      });

      expect(mockPesquisarTodos).toHaveBeenCalledWith('', '', '');
    });

    it('should handle roles loading error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockRejectedValue(new Error('Failed to load roles'));

      const { result } = renderHook(() => useUserForm());

      await waitFor(() => {
        expect(result.current.rolesLoading).toBe(false);
        expect(result.current.roles).toEqual([]);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading roles:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should set rolesLoading to false after error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useUserForm());

      expect(result.current.rolesLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.rolesLoading).toBe(false);
      });
    });
  });

  describe('Entity Mapper', () => {
    it('should map form values to DUser entity for create', () => {
      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      renderHook(() => useUserForm());

      const config = mockUseEntityForm.mock.calls[0][0];
      const mapper = config.toEntityMapper!;

      const formValues = {
        name: 'John Doe',
        password: 'password123',
        email: 'john@example.com',
        roles: [{ id: 1, authority: 'ROLE_ADMIN' }],
      };

      const entity = mapper(formValues);

      expect(entity).toEqual({
        id: undefined,
        name: 'John Doe',
        password: 'password123',
        email: 'john@example.com',
        roles: [{ id: 1, authority: 'ROLE_ADMIN' }],
      });
    });

    it('should map form values to DUser entity for update', () => {
      const mockEntityFormReturn = {
        formData: {},
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      renderHook(() => useUserForm(123));

      const config = mockUseEntityForm.mock.calls[0][0];
      const mapper = config.toEntityMapper!;

      const formValues = {
        name: 'Jane Doe',
        password: 'newpassword',
        email: 'jane@example.com',
        roles: [{ id: 2, authority: 'ROLE_USER' }],
      };

      const entity = mapper(formValues);

      expect(entity).toEqual({
        id: 123,
        name: 'Jane Doe',
        password: 'newpassword',
        email: 'jane@example.com',
        roles: [{ id: 2, authority: 'ROLE_USER' }],
      });
    });
  });

  describe('Return Value', () => {
    it('should return entity form properties and roles data', async () => {
      const mockEntityFormReturn = {
        formData: {
          name: { value: '', dirty: '', invalid: '' },
          password: { value: '', dirty: '', invalid: '' },
          email: { value: '', dirty: '', invalid: '' },
          roles: { value: [], dirty: '', invalid: '' },
        },
        loading: false,
        submitSuccess: false,
        handleInputChange: vi.fn(),
        handleTurnDirty: vi.fn(),
        handleSubmit: vi.fn(),
      };

      mockUseEntityForm.mockReturnValue(mockEntityFormReturn);
      mockPesquisarTodos.mockResolvedValue({
        data: { content: [] },
      } as AxiosResponse);

      const { result } = renderHook(() => useUserForm());

      await waitFor(() => {
        expect(result.current.rolesLoading).toBe(false);
      });

      expect(result.current).toHaveProperty('formData');
      expect(result.current).toHaveProperty('roles');
      expect(result.current).toHaveProperty('rolesLoading');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('submitSuccess');
      expect(result.current).toHaveProperty('handleInputChange');
      expect(result.current).toHaveProperty('handleTurnDirty');
      expect(result.current).toHaveProperty('handleSubmit');
    });
  });
});
