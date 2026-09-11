import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MachineGroupForm from './index';
import * as useMachineGroupFormHook from '../../../../../hooks/crud/useMachineGroupForm';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ machineGroupId: 'create' }),
  };
});

// Mock the useMachineGroupForm hook
vi.mock('../../../../../hooks/crud/useMachineGroupForm');

describe('MachineGroupForm', () => {
  const mockFormData = {
    nome: {
      name: 'nome',
      value: '',
      dirty: 'false',
      message: '',
      id: 'nome',
      type: 'text',
      placeholder: 'Nome',
      invalid: 'false'
    },
  };

  const mockUseMachineGroupForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    isEditing: false,
    error: null,
    submitSuccess: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMachineGroupFormHook.useMachineGroupForm).mockReturnValue(mockUseMachineGroupForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<MachineGroupForm />);

    expect(screen.getByText('Grupo de Máquina')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineGroupForm />);

    const nomeInput = screen.getByRole('textbox');
    await user.type(nomeInput, 'Test Group');

    expect(mockUseMachineGroupForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineGroupForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseMachineGroupForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useMachineGroupFormHook.useMachineGroupForm).mockReturnValue({
      ...mockUseMachineGroupForm,
      loading: true,
    });

    renderWithRouter(<MachineGroupForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation errors', () => {
    const formDataWithErrors = {
      nome: { ...mockFormData.nome, message: 'Nome é obrigatório' },
    };

    vi.mocked(useMachineGroupFormHook.useMachineGroupForm).mockReturnValue({
      ...mockUseMachineGroupForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<MachineGroupForm />);

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
  });

  it('should have cancel button that links to machine group list', () => {
    renderWithRouter(<MachineGroupForm />);

    const cancelLink = screen.getByText('Cancelar').closest('a');
    expect(cancelLink).toHaveAttribute('href', '/machinegroups');
  });
});
