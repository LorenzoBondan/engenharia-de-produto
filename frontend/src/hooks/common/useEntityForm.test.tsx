import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEntityForm } from './useEntityForm';
import { EntityFormConfig } from '../types';

describe('useEntityForm', () => {
  const mockFetchFunction = vi.fn();
  const mockCreateFunction = vi.fn();
  const mockUpdateFunction = vi.fn();

  const initialFormData = {
    name: {
      value: '',
      id: 'name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter name',
      validation: (value: unknown) => !!value && String(value).length > 0,
      message: '',
      dirty: 'false',
      invalid: 'false',
    },
    email: {
      value: '',
      id: 'email',
      name: 'email',
      type: 'email',
      placeholder: 'Enter email',
      validation: (value: unknown) =>
        !!value && String(value).includes('@'),
      message: '',
      dirty: 'false',
      invalid: 'false',
    },
  };

  const toEntityMapper = (formValues: Record<string, unknown>) => ({
    name: formValues.name as string,
    email: formValues.email as string,
  });

  const createConfig: EntityFormConfig<{ name: string; email: string }> = {
    createFunction: mockCreateFunction,
    updateFunction: mockUpdateFunction,
    initialFormData,
    toEntityMapper,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should initialize in create mode without entityId', () => {
      const { result } = renderHook(() => useEntityForm(createConfig));

      expect(result.current.isEditing).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.submitSuccess).toBe(false);
      expect(result.current.formData).toEqual(initialFormData);
    });

    it('should handle input change and validation', () => {
      const { result } = renderHook(() => useEntityForm(createConfig));

      act(() => {
        const event = {
          target: { name: 'name', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleInputChange(event);
      });

      expect(result.current.formData.name.value).toBe('John Doe');
    });

    it('should handle turn dirty for a field', () => {
      const { result } = renderHook(() => useEntityForm(createConfig));

      act(() => {
        result.current.handleTurnDirty('name');
      });

      expect(result.current.formData.name.dirty).toBe('true');
    });

    it('should submit successfully in create mode', async () => {
      mockCreateFunction.mockResolvedValue({
        data: { id: 1, name: 'John Doe', email: 'john@example.com' },
      });

      const { result } = renderHook(() => useEntityForm(createConfig));

      // Fill form
      act(() => {
        const nameEvent = {
          target: { name: 'name', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleInputChange(nameEvent);

        const emailEvent = {
          target: { name: 'email', value: 'john@example.com' },
        } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleInputChange(emailEvent);
      });

      // Submit
      await act(async () => {
        const event = {
          preventDefault: vi.fn(),
        } as unknown as React.FormEvent;
        await result.current.handleSubmit(event);
      });

      expect(mockCreateFunction).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(result.current.submitSuccess).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should not submit with invalid fields', async () => {
      const { result } = renderHook(() => useEntityForm(createConfig));

      // Leave fields empty (invalid)
      await act(async () => {
        const event = {
          preventDefault: vi.fn(),
        } as unknown as React.FormEvent;
        await result.current.handleSubmit(event);
      });

      expect(mockCreateFunction).not.toHaveBeenCalled();
      expect(result.current.formData.name.dirty).toBe('true');
      expect(result.current.formData.name.invalid).toBe('true');
    });

    it('should handle create failure with backend errors', async () => {
      mockCreateFunction.mockRejectedValue({
        response: {
          data: {
            errors: [
              { fieldName: 'email', message: 'Email already exists' },
            ],
          },
        },
      });

      const { result } = renderHook(() => useEntityForm(createConfig));

      // Fill form
      act(() => {
        const nameEvent = {
          target: { name: 'name', value: 'John Doe' },
        } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleInputChange(nameEvent);

        const emailEvent = {
          target: { name: 'email', value: 'john@example.com' },
        } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleInputChange(emailEvent);
      });

      // Submit
      await act(async () => {
        const event = {
          preventDefault: vi.fn(),
        } as unknown as React.FormEvent;
        await result.current.handleSubmit(event);
      });

      expect(result.current.formData.email.message).toBe('Email already exists');
      expect(result.current.formData.email.invalid).toBe('true');
      expect(result.current.submitSuccess).toBe(false);
    });
  });

  describe('Edit Mode', () => {
    const editConfig: EntityFormConfig<{ name: string; email: string }> = {
      entityId: 1,
      fetchFunction: mockFetchFunction,
      createFunction: mockCreateFunction,
      updateFunction: mockUpdateFunction,
      initialFormData,
      toEntityMapper,
    };

    it('should initialize in edit mode and fetch entity data', async () => {
      mockFetchFunction.mockResolvedValue({
        data: { name: 'John Doe', email: 'john@example.com' },
      });

      const { result } = renderHook(() => useEntityForm(editConfig));

      expect(result.current.isEditing).toBe(true);
      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockFetchFunction).toHaveBeenCalledWith(1);
      expect(result.current.formData.name.value).toBe('John Doe');
      expect(result.current.formData.email.value).toBe('john@example.com');
    });

    it('should handle fetch errors in edit mode', async () => {
      mockFetchFunction.mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => useEntityForm(editConfig));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('should submit successfully in edit mode', async () => {
      mockFetchFunction.mockResolvedValue({
        data: { name: 'John Doe', email: 'john@example.com' },
      });

      mockUpdateFunction.mockResolvedValue({
        data: { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
      });

      const { result } = renderHook(() => useEntityForm(editConfig));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Update name
      act(() => {
        const event = {
          target: { name: 'name', value: 'Jane Doe' },
        } as React.ChangeEvent<HTMLInputElement>;
        result.current.handleInputChange(event);
      });

      // Submit
      await act(async () => {
        const event = {
          preventDefault: vi.fn(),
        } as unknown as React.FormEvent;
        await result.current.handleSubmit(event);
      });

      expect(mockUpdateFunction).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'john@example.com',
      });
      expect(result.current.submitSuccess).toBe(true);
    });
  });
});
