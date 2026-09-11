import { useState, useEffect } from 'react';
import { useEntityForm } from '../common/useEntityForm';
import * as userService from '../../services/userService';
import * as roleService from '../../services/roleService';
import { DUser, DRole } from '../../models/user';
import { UseEntityFormReturn } from '../types';

/**
 * Form data structure for User form
 */
interface UserFormData {
  name: {
    value: string;
    id: string;
    name: string;
    type: string;
    placeholder: string;
    validation: (value: string) => boolean;
    message: string;
    dirty?: string;
    invalid?: string;
  };
  password: {
    value: string;
    id: string;
    name: string;
    type: string;
    placeholder: string;
    validation: (value: string) => boolean;
    message: string;
    dirty?: string;
    invalid?: string;
  };
  email: {
    value: string;
    id: string;
    name: string;
    type: string;
    placeholder: string;
    validation: (value: string) => boolean;
    message: string;
    dirty?: string;
    invalid?: string;
  };
  roles: {
    value: DRole[];
    id: string;
    name: string;
    placeholder: string;
    validation: (value: DRole[]) => boolean;
    message: string;
    dirty?: string;
    invalid?: string;
  };
  [key: string]: any;
}

/**
 * Return type extending UseEntityFormReturn with roles data
 */
export interface UseUserFormReturn extends UseEntityFormReturn {
  roles: DRole[];
  rolesLoading: boolean;
  formData: UserFormData;
}

/**
 * Custom hook for User form management
 *
 * Features:
 * - Wraps useEntityForm with userService configuration
 * - Loads role dropdown options
 * - Type-safe DUser interface
 * - Handles create and edit modes
 * - Form validation for user fields
 *
 * @param userId - User ID for edit mode (undefined for create mode)
 * @returns User form state and control functions
 *
 * @example
 * ```tsx
 * function UserForm({ userId }: { userId?: number }) {
 *   const {
 *     formData,
 *     roles,
 *     rolesLoading,
 *     handleInputChange,
 *     handleTurnDirty,
 *     handleSubmit,
 *     loading,
 *     submitSuccess
 *   } = useUserForm(userId);
 *
 *   if (submitSuccess) {
 *     navigate('/admin/users');
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         name="name"
 *         value={formData.name.value}
 *         onChange={handleInputChange}
 *       />
 *       <select name="roles" multiple>
 *         {roles.map(role => <option key={role.id} value={role.id}>{role.authority}</option>)}
 *       </select>
 *       <button type="submit" disabled={loading}>Save</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useUserForm(userId?: number | string): UseUserFormReturn {
  const [roles, setRoles] = useState<DRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Initial form data structure
  const initialFormData: UserFormData = {
    name: {
      value: '',
      id: 'name',
      name: 'name',
      type: 'text',
      placeholder: 'Nome',
      validation: (value: string) => /^.{3,50}$/.test(value),
      message: 'Nome deve ter entre 3 e 50 caracteres',
    },
    password: {
      value: '',
      id: 'password',
      name: 'password',
      type: 'password',
      placeholder: 'Senha',
      validation: (value: string) => /^.{3,250}$/.test(value),
      message: 'Senha deve ter entre 3 e 250 caracteres',
    },
    email: {
      value: '',
      id: 'email',
      name: 'email',
      type: 'text',
      placeholder: 'Email',
      validation: (value: string) => /^.{3,50}$/.test(value),
      message: 'Email deve ter entre 3 e 50 caracteres',
    },
    roles: {
      value: [],
      id: 'roles',
      name: 'roles',
      placeholder: 'Papéis',
      validation: (value: DRole[]) => value.length > 0,
      message: 'Escolha ao menos um papel',
    },
  };

  // Use the entity form hook
  const entityForm = useEntityForm<DUser>({
    entityId: userId,
    fetchFunction: userId ? (id) => userService.pesquisarPorId(Number(id)) : undefined,
    createFunction: userService.criar,
    updateFunction: userService.atualizar,
    initialFormData,
    toEntityMapper: (values) => ({
      id: userId ? Number(userId) : undefined,
      name: values.name as string,
      password: values.password as string,
      email: values.email as string,
      roles: values.roles as DRole[],
    } as DUser),
  });

  // Load roles for dropdown
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await roleService.pesquisarTodos('', '', '');
        setRoles(response.data.content);
        setRolesLoading(false);
      } catch (error) {
        console.error('Error loading roles:', error);
        setRolesLoading(false);
      }
    };

    loadRoles();
  }, []);

  return {
    ...entityForm,
    formData: entityForm.formData as UserFormData,
    roles,
    rolesLoading,
  };
}
