import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UserForm from './index';
import * as useUserFormHook from '../../../../hooks/admin/useUserForm';
import { toast } from 'react-toastify';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ userId: 'create' }),
  };
});

// Mock the useUserForm hook
vi.mock('../../../../hooks/admin/useUserForm');

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('UserForm', () => {
  const mockRoles = [
    { id: 1, authority: 'ROLE_ADMIN' },
    { id: 2, authority: 'ROLE_OPERATOR' },
  ];

  const mockFormData = {
    name: {
      name: 'name',
      value: '',
      dirty: 'false',
      message: '',
      id: 'name',
      type: 'text',
      placeholder: 'Nome',
      validation: (value: string) => value.length > 0,
      invalid: 'false'
    },
    password: {
      name: 'password',
      value: '',
      dirty: 'false',
      message: '',
      id: 'password',
      type: 'password',
      placeholder: 'Senha',
      validation: (value: string) => value.length >= 6,
      invalid: 'false'
    },
    email: {
      name: 'email',
      value: '',
      dirty: 'false',
      message: '',
      id: 'email',
      type: 'email',
      placeholder: 'Email',
      validation: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      invalid: 'false'
    },
    roles: {
      name: 'roles',
      value: [],
      dirty: 'false',
      message: '',
      id: 'roles',
      placeholder: 'Roles',
      validation: (value: any[]) => value.length > 0,
      invalid: 'false'
    },
  };

  const mockUseUserForm = {
    formData: mockFormData,
    roles: mockRoles,
    rolesLoading: false,
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    loading: false,
    submitSuccess: false,
    isEditing: false,
    setFormData: vi.fn(),
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUserFormHook.useUserForm).mockReturnValue(mockUseUserForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<UserForm />);

    expect(screen.getByText('Usuário')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when name input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserForm />);

    const nameInput = screen.getByPlaceholderText('Nome');
    await user.type(nameInput, 'John Doe');

    expect(mockUseUserForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseUserForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useUserFormHook.useUserForm).mockReturnValue({
      ...mockUseUserForm,
      loading: true,
    });

    renderWithRouter(<UserForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation errors', () => {
    const formDataWithErrors = {
      ...mockFormData,
      name: { ...mockFormData.name, message: 'Nome é obrigatório' },
      email: { ...mockFormData.email, message: 'Email inválido' },
    };

    vi.mocked(useUserFormHook.useUserForm).mockReturnValue({
      ...mockUseUserForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<UserForm />);

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('should navigate to user list after successful creation', async () => {
    vi.mocked(useUserFormHook.useUserForm).mockReturnValue({
      ...mockUseUserForm,
      submitSuccess: true,
      isEditing: false,
    });

    renderWithRouter(<UserForm />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Usuário Inserido!');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/users');
    });
  });

  it('should navigate to user list after successful edit', async () => {
    vi.mocked(useUserFormHook.useUserForm).mockReturnValue({
      ...mockUseUserForm,
      submitSuccess: true,
      isEditing: true,
    });

    renderWithRouter(<UserForm />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Usuário editado!');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/users');
    });
  });

  it('should have cancel button that links to user list', () => {
    renderWithRouter(<UserForm />);

    const cancelLink = screen.getByText('Cancelar').closest('a');
    expect(cancelLink).toHaveAttribute('href', '/admin/users');
  });

  it('should call handleTurnDirty when field is focused', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserForm />);

    const nameInput = screen.getByPlaceholderText('Nome');
    await user.click(nameInput);
    await user.tab();
    
    await waitFor(() => {
      expect(mockUseUserForm.handleTurnDirty).toHaveBeenCalled();
    });
  });
});
