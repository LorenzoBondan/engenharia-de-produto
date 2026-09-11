import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import * as forms from '../../utils/forms';
import { ContextToken } from '../../utils/context-token';

/**
 * Login form data structure
 */
interface LoginFormData {
  username: {
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
    dirty?: string;
    invalid?: string;
  };
}

/**
 * Return type for useLogin hook
 */
export interface UseLoginReturn {
  formData: LoginFormData;
  submitResponseFail: boolean;
  loading: boolean;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTurnDirty: (name: string) => void;
}

/**
 * Custom hook for login form management
 *
 * Features:
 * - Form state management with validation
 * - Integration with useAuth for authentication
 * - Automatic navigation on successful login
 * - Error handling for invalid credentials
 *
 * @returns Login form state and handlers
 *
 * @example
 * ```tsx
 * function Login() {
 *   const {
 *     formData,
 *     submitResponseFail,
 *     loading,
 *     handleSubmit,
 *     handleInputChange,
 *     handleTurnDirty
 *   } = useLogin();
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <FormInput
 *         {...formData.username}
 *         onChange={handleInputChange}
 *         onTurnDirty={handleTurnDirty}
 *       />
 *       <FormInput
 *         {...formData.password}
 *         onChange={handleInputChange}
 *         onTurnDirty={handleTurnDirty}
 *       />
 *       {submitResponseFail && <div>Usuário ou senha inválidos</div>}
 *       <button type="submit" disabled={loading}>Entrar</button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useLogin(): UseLoginReturn {
  const { setContextTokenPayload } = useContext(ContextToken);
  const navigate = useNavigate();

  const [submitResponseFail, setSubmitResponseFail] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    username: {
      value: '',
      id: 'username',
      name: 'username',
      type: 'email',
      placeholder: 'Email',
      validation: function (value: string) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          value.toLowerCase()
        );
      },
      message: 'Favor informar um email válido',
    },
    password: {
      value: '',
      id: 'password',
      name: 'password',
      type: 'password',
      placeholder: 'Senha',
    },
  });

  /**
   * Handle form submission
   */
  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();

    setSubmitResponseFail(false);

    // Validate form
    const formDataValidated = forms.dirtyAndValidateAll(formData);
    if (forms.hasAnyInvalid(formDataValidated)) {
      setFormData(formDataValidated as LoginFormData);
      return;
    }

    // Login
    setLoading(true);
    const credentials = forms.toValues(formData);
    try {
      const response = await authService.loginRequest(credentials);
      authService.saveAccessToken(response.data.access_token);
      setContextTokenPayload(authService.getAccessTokenPayload());
      setLoading(false);
      navigate('/');
    } catch {
      setLoading(false);
      setSubmitResponseFail(true);
    }
  }

  /**
   * Handle input change with validation
   */
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData(
      forms.updateAndValidate(formData, event.target.name, event.target.value) as LoginFormData
    );
  }

  /**
   * Mark field as dirty to trigger validation display
   */
  function handleTurnDirty(name: string) {
    setFormData(forms.dirtyAndValidate(formData, name) as LoginFormData);
  }

  return {
    formData,
    submitResponseFail,
    loading,
    handleSubmit,
    handleInputChange,
    handleTurnDirty,
  };
}
