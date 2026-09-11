import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './index';
import * as useLoginHook from '../../../hooks/auth/useLogin';

// Mock the useLogin hook
vi.mock('../../../hooks/auth/useLogin');

describe('Login', () => {
  const mockFormData = {
    username: {
      id: 'username',
      name: 'username',
      type: 'text',
      placeholder: 'Usuário',
      value: '',
      message: 'Favor informar um email válido',
      validation: (value: string) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value.toLowerCase()),
      dirty: 'false',
      invalid: 'false',
    },
    password: {
      id: 'password',
      name: 'password',
      type: 'password',
      placeholder: 'Senha',
      value: '',
      dirty: 'false',
      invalid: 'false',
    },
  };

  const mockUseLogin = {
    formData: mockFormData,
    submitResponseFail: false,
    loading: false,
    handleSubmit: vi.fn((e) => e.preventDefault()),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLoginHook.useLogin).mockReturnValue(mockUseLogin);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render login form', () => {
    renderWithRouter(<Login />);

    expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('should render username and password inputs', () => {
    renderWithRouter(<Login />);

    const usernameInput = screen.getByPlaceholderText('Usuário');
    const passwordInput = screen.getByPlaceholderText('Senha');

    expect(usernameInput).toHaveAttribute('type', 'text');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const submitButton = screen.getByText('Entrar');
    await user.click(submitButton);

    expect(mockUseLogin.handleSubmit).toHaveBeenCalled();
  });

  it('should call handleInputChange when username is typed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const usernameInput = screen.getByPlaceholderText('Usuário');
    await user.type(usernameInput, 'testuser');

    expect(mockUseLogin.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleInputChange when password is typed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const passwordInput = screen.getByPlaceholderText('Senha');
    await user.type(passwordInput, 'password123');

    expect(mockUseLogin.handleInputChange).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useLoginHook.useLogin).mockReturnValue({
      ...mockUseLogin,
      loading: true,
    });

    renderWithRouter(<Login />);

    expect(screen.getByText('Entrando...')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('should show error message when login fails', () => {
    vi.mocked(useLoginHook.useLogin).mockReturnValue({
      ...mockUseLogin,
      submitResponseFail: true,
    });

    renderWithRouter(<Login />);

    expect(screen.getByText('Usuário ou senha inválidos')).toBeInTheDocument();
  });

  it('should not show error message when login has not failed', () => {
    renderWithRouter(<Login />);

    expect(screen.queryByText('Usuário ou senha inválidos')).not.toBeInTheDocument();
  });

  it('should display validation message for username field', () => {
    vi.mocked(useLoginHook.useLogin).mockReturnValue({
      ...mockUseLogin,
      formData: {
        ...mockFormData,
        username: {
          ...mockFormData.username,
          message: 'Campo obrigatório',
          invalid: 'true',
        },
      },
    });

    renderWithRouter(<Login />);

    const usernameInput = screen.getByPlaceholderText('Usuário');
    expect(usernameInput).toHaveAttribute('message', 'Campo obrigatório');
  });

  it('should have login section container', () => {
    const { container } = renderWithRouter(<Login />);

    const section = container.querySelector('#login-section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('container');
  });

  it('should call handleTurnDirty when username field loses focus', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const usernameInput = screen.getByPlaceholderText('Usuário');
    await user.click(usernameInput);
    await user.tab();

    await waitFor(() => {
      expect(mockUseLogin.handleTurnDirty).toHaveBeenCalled();
    });
  });

  it('should call handleTurnDirty when password field loses focus', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const passwordInput = screen.getByPlaceholderText('Senha');
    await user.click(passwordInput);
    await user.tab();

    await waitFor(() => {
      expect(mockUseLogin.handleTurnDirty).toHaveBeenCalled();
    });
  });

  it('should have submit button with correct text when not loading', () => {
    renderWithRouter(<Login />);

    const button = screen.getByText('Entrar');
    expect(button).toBeInTheDocument();
    expect(screen.queryByText('Entrando...')).not.toBeInTheDocument();
  });

  it('should render main element', () => {
    renderWithRouter(<Login />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
