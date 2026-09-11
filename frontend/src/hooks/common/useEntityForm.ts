import { useState, useEffect, useCallback } from 'react';
import { EntityFormConfig, UseEntityFormReturn } from '../types';
import * as forms from '../../utils/forms';

/**
 * Custom hook for entity form management with create/edit modes
 *
 * Features:
 * - Automatic mode detection (create vs edit) based on entityId
 * - Fetch existing entity data in edit mode
 * - Form state management using forms.ts utility
 * - Client-side validation before submission
 * - Backend error mapping to form fields
 * - Success state for post-submission navigation
 *
 * @template T - The entity type
 * @param config - Configuration object for the entity form
 * @returns Entity form state and control functions
 *
 * @example
 * ```tsx
 * function UserForm({ userId }: { userId?: number }) {
 *   const {
 *     formData,
 *     handleInputChange,
 *     handleSubmit,
 *     loading,
 *     submitSuccess
 *   } = useEntityForm({
 *     entityId: userId,
 *     fetchFunction: userService.buscarPorId,
 *     createFunction: userService.inserir,
 *     updateFunction: userService.atualizar,
 *     initialFormData: {
 *       name: { value: '', id: 'name', name: 'name', type: 'text', validation: (v) => !!v }
 *     },
 *     toEntityMapper: (values) => ({ name: values.name as string })
 *   });
 *
 *   if (submitSuccess) {
 *     navigate('/users');
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         name="name"
 *         value={formData.name.value}
 *         onChange={handleInputChange}
 *       />
 *       <button type="submit" disabled={loading}>Save</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useEntityForm<T>(
  config: EntityFormConfig<T>
): UseEntityFormReturn {
  const {
    entityId,
    fetchFunction,
    createFunction,
    updateFunction,
    initialFormData,
    toEntityMapper,
  } = config;

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isEditing = !!entityId;

  /**
   * Fetch existing entity data in edit mode
   */
  useEffect(() => {
    if (isEditing && fetchFunction) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetchFunction(entityId);
          const entityData = response.data;

          // Update form data with entity values
          setFormData(forms.updateAll(initialFormData, entityData));
          setLoading(false);
        } catch (err: any) {
          setLoading(false);
          setError(
            err.response?.data?.error ||
              err.message ||
              'Erro ao carregar dados. Tente novamente.'
          );
        }
      };

      fetchData();
    }
  }, [entityId, isEditing]);

  /**
   * Handle input change with validation
   */
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData((prev) => forms.updateAndValidate(prev, name, value));
    },
    []
  );

  /**
   * Mark a field as dirty
   */
  const handleTurnDirty = useCallback((name: string) => {
    setFormData((prev) => forms.dirtyAndValidate(prev, name));
  }, []);

  /**
   * Handle form submission
   * Validates all fields, then calls create or update service
   */
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      try {
        // Validate all fields
        const validatedFormData = forms.dirtyAndValidateAll(formData);
        setFormData(validatedFormData);

        // Check for validation errors
        if (forms.hasAnyInvalid(validatedFormData)) {
          return;
        }

        setLoading(true);
        setError(null);

        // Convert form data to entity
        const formValues = forms.toValues(validatedFormData);
        const entity = toEntityMapper(formValues);

        // Call create or update service
        if (isEditing) {
          await updateFunction(entity);
        } else {
          await createFunction(entity);
        }

        setSubmitSuccess(true);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);

        // Handle backend validation errors
        if (err.response?.data?.errors) {
          const backendErrors = err.response.data.errors;
          setFormData((prev) => forms.setBackendErrors(prev, backendErrors));
        } else {
          setError(
            err.response?.data?.error ||
              err.message ||
              'Erro ao salvar. Tente novamente.'
          );
        }
      }
    },
    [formData, isEditing, toEntityMapper, createFunction, updateFunction]
  );

  return {
    formData,
    setFormData,
    handleInputChange,
    handleTurnDirty,
    handleSubmit,
    isEditing,
    loading,
    error,
    submitSuccess,
  };
}
