import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MachineForm from './index';
import * as useMachineFormHook from '../../../../../hooks/crud/useMachineForm';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ machineId: 'create' }),
  };
});

// Mock the useMachineForm hook
vi.mock('../../../../../hooks/crud/useMachineForm');

describe('MachineForm', () => {
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
    formula: {
      name: 'formula',
      value: '',
      dirty: 'false',
      message: '',
      id: 'formula',
      type: 'text',
      placeholder: 'Fórmula',
      invalid: 'false'
    },
    grupoMaquina: {
      name: 'grupoMaquina',
      value: null,
      dirty: 'false',
      message: '',
      id: 'grupoMaquina',
      type: 'select',
      placeholder: 'Grupo Máquina',
      invalid: 'false'
    },
    valor: {
      name: 'valor',
      value: '',
      dirty: 'false',
      message: '',
      id: 'valor',
      type: 'number',
      placeholder: 'Valor',
      invalid: 'false'
    },
  };

  const mockGrupoMaquinas = [
    { codigo: 1, nome: 'Grupo A', situacao: 'ATIVO' as const },
    { codigo: 2, nome: 'Grupo B', situacao: 'ATIVO' as const },
  ];

  const mockUseMachineForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    grupoMaquinas: mockGrupoMaquinas,
    isEditing: false,
    error: null,
    submitSuccess: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMachineFormHook.useMachineForm).mockReturnValue(mockUseMachineForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<MachineForm />);

    expect(screen.getByText('Máquina')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Fórmula')).toBeInTheDocument();
    expect(screen.getByText('Grupo Máquina')).toBeInTheDocument();
    expect(screen.getByText('Valor (R$)')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineForm />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Test Machine');

    expect(mockUseMachineForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseMachineForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useMachineFormHook.useMachineForm).mockReturnValue({
      ...mockUseMachineForm,
      loading: true,
    });

    renderWithRouter(<MachineForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation errors', () => {
    const formDataWithErrors = {
      ...mockFormData,
      nome: { ...mockFormData.nome, message: 'Nome é obrigatório' },
      formula: { ...mockFormData.formula, message: 'Fórmula inválida' },
    };

    vi.mocked(useMachineFormHook.useMachineForm).mockReturnValue({
      ...mockUseMachineForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<MachineForm />);

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Fórmula inválida')).toBeInTheDocument();
  });

  it('should have cancel button that links to machine list', () => {
    renderWithRouter(<MachineForm />);

    const cancelLink = screen.getByText('Cancelar').closest('a');
    expect(cancelLink).toHaveAttribute('href', '/machines');
  });

  it('should call handleTurnDirty when field is focused', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MachineForm />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);

    expect(mockUseMachineForm.handleTurnDirty).toHaveBeenCalled();
    });
  });

  it('should render textarea for formula field', () => {
    renderWithRouter(<MachineForm />);

    const textareas = screen.getAllByRole('textbox');
    const formulaTextarea = textareas.find(el => el.tagName === 'TEXTAREA');
    expect(formulaTextarea).toBeDefined();
  });
});
