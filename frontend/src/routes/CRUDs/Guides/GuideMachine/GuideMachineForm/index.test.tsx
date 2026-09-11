import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GuideMachineForm from './index';
import * as useGuideMachineFormHook from '../../../../../hooks/crud/useGuideMachineForm';

// Mock the useGuideMachineForm hook
vi.mock('../../../../../hooks/crud/useGuideMachineForm');

describe('GuideMachineForm', () => {
  const mockFormData = {
    roteiro: {
      name: 'roteiro',
      value: null,
      dirty: 'false',
      message: 'Roteiro é obrigatório',
      id: 'roteiro',
      type: 'select',
      placeholder: 'Roteiro',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
    maquina: {
      name: 'maquina',
      value: null,
      dirty: 'false',
      message: 'Máquina é obrigatória',
      id: 'maquina',
      type: 'select',
      placeholder: 'Máquina',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
    tempoHomem: {
      name: 'tempoHomem',
      value: null,
      dirty: 'false',
      message: 'Tempo Homem não pode ser negativo',
      id: 'tempoHomem',
      type: 'number',
      placeholder: 'Tempo Homem',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
    tempoMaquina: {
      name: 'tempoMaquina',
      value: null,
      dirty: 'false',
      message: 'Tempo Máquina não pode ser negativo',
      id: 'tempoMaquina',
      type: 'number',
      placeholder: 'Tempo Máquina',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
  };

  const mockRoteiros = [
    { codigo: 1, descricao: 'Roteiro 1', situacao: 'ATIVO' as const, implantacao: new Date('2024-01-01'), dataFinal: new Date('2024-12-31'), valor: 100, roteiroMaquinas: [] },
    { codigo: 2, descricao: 'Roteiro 2', situacao: 'ATIVO' as const, implantacao: new Date('2024-02-01'), dataFinal: new Date('2024-11-30'), valor: 150, roteiroMaquinas: [] },
  ];

  const mockMaquinas = [
    { codigo: 1, nome: 'Máquina 1', formula: ['x + y'], valor: 50, grupoMaquina: { codigo: 1, nome: 'Grupo 1', situacao: 'ATIVO' as const }, situacao: 'ATIVO' as const },
    { codigo: 2, nome: 'Máquina 2', formula: ['x * y'], valor: 75, grupoMaquina: { codigo: 2, nome: 'Grupo 2', situacao: 'ATIVO' as const }, situacao: 'ATIVO' as const },
  ];

  const mockUseGuideMachineForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    roteiros: mockRoteiros,
    maquinas: mockMaquinas,
    previousPath: '/',
    isEditing: false,
    error: null,
    submitSuccess: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGuideMachineFormHook.useGuideMachineForm).mockReturnValue(mockUseGuideMachineForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render guide machine form', () => {
    renderWithRouter(<GuideMachineForm />);

    expect(screen.getByText('Roteiro Máquina')).toBeInTheDocument();
  });

  it('should render form title', () => {
    renderWithRouter(<GuideMachineForm />);

    expect(screen.getByText('Roteiro Máquina')).toBeInTheDocument();
  });

  it('should render tempoHomem field', () => {
    renderWithRouter(<GuideMachineForm />);

    const tempoHomemInput = screen.getByPlaceholderText('Tempo Homem');
    expect(tempoHomemInput).toBeInTheDocument();
    expect(tempoHomemInput).toHaveAttribute('type', 'number');
  });

  it('should render tempoMaquina field', () => {
    renderWithRouter(<GuideMachineForm />);

    const tempoMaquinaInput = screen.getByPlaceholderText('Tempo Máquina');
    expect(tempoMaquinaInput).toBeInTheDocument();
    expect(tempoMaquinaInput).toHaveAttribute('type', 'number');
  });

  it('should render submit button', () => {
    renderWithRouter(<GuideMachineForm />);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should render cancel link', () => {
    renderWithRouter(<GuideMachineForm />);

    const cancelLink = screen.getByRole('link', { name: /cancelar/i });
    expect(cancelLink).toBeInTheDocument();
  });
});
