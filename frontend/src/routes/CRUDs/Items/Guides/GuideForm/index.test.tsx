import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GuideForm from './index';
import * as useGuideFormHook from '../../../../../hooks/crud/useGuideForm';

// Mock the useGuideForm hook
vi.mock('../../../../../hooks/crud/useGuideForm');

// Mock Flatpickr to avoid complex date picker testing
vi.mock('react-flatpickr', () => ({
  default: ({ id, name, value, className }: any) => (
    <input
      id={id}
      name={name}
      value={value}
      className={className}
      type="date"
    />
  ),
}));

describe('GuideForm', () => {
  const mockFormData = {
    descricao: {
      name: 'descricao',
      value: '',
      dirty: 'false',
      message: '',
      id: 'descricao',
      type: 'text',
      placeholder: 'Descrição',
      validation: (value: string) => /^.{3,50}$/.test(value),
      invalid: 'false'
    },
    implantacao: {
      name: 'implantacao',
      value: '',
      dirty: 'false',
      message: 'Implantação é obrigatório',
      id: 'implantacao',
      type: 'date',
      placeholder: 'Implantação',
      validation: (value: unknown) => value !== null,
      invalid: 'false'
    },
    dataFinal: {
      name: 'dataFinal',
      value: '',
      dirty: 'false',
      message: '',
      id: 'dataFinal',
      type: 'date',
      placeholder: 'Data Final',
      invalid: 'false'
    },
    valor: {
      name: 'valor',
      value: null,
      dirty: 'false',
      message: 'Valor não pode ser negativo',
      id: 'valor',
      type: 'number',
      placeholder: 'Valor',
      validation: (value: unknown) => Number(value) >= 0,
      invalid: 'false'
    },
  };

  const mockUseGuideForm = {
    formData: mockFormData,
    loading: false,
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    dateTimeStart: '2024-01-01',
    dateTimeEnd: '2024-12-31',
    handleDateTimeStartChange: vi.fn(),
    handleDateTimeEndChange: vi.fn(),
    isEditing: false,
    error: null,
    submitSuccess: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGuideFormHook.useGuideForm).mockReturnValue(mockUseGuideForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render guide form', () => {
    renderWithRouter(<GuideForm />);

    expect(screen.getByText('Roteiro')).toBeInTheDocument();
  });

  it('should render description field', () => {
    renderWithRouter(<GuideForm />);

    const descricaoInput = screen.getByPlaceholderText('Descrição');
    expect(descricaoInput).toBeInTheDocument();
    expect(descricaoInput).toHaveAttribute('type', 'text');
  });

  it('should render implantacao date field', () => {
    renderWithRouter(<GuideForm />);

    const implantacaoInput = screen.getByDisplayValue('2024-01-01');
    expect(implantacaoInput).toBeInTheDocument();
  });

  it('should render dataFinal date field', () => {
    renderWithRouter(<GuideForm />);

    const dataFinalInput = screen.getByDisplayValue('2024-12-31');
    expect(dataFinalInput).toBeInTheDocument();
  });

  it('should render valor field', () => {
    renderWithRouter(<GuideForm />);

    const valorInput = screen.getByPlaceholderText('Valor');
    expect(valorInput).toBeInTheDocument();
    expect(valorInput).toHaveAttribute('type', 'number');
  });

  it('should render submit button', () => {
    renderWithRouter(<GuideForm />);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should render cancel link', () => {
    renderWithRouter(<GuideForm />);

    const cancelLink = screen.getByRole('link', { name: /cancelar/i });
    expect(cancelLink).toBeInTheDocument();
  });
});
