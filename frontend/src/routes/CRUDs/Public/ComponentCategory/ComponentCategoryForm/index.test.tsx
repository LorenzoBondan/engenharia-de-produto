import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ComponentCategoryForm from './index';
import * as useComponentCategoryFormHook from '../../../../../hooks/crud/useComponentCategoryForm';

vi.mock('../../../../../hooks/crud/useComponentCategoryForm');

describe('ComponentCategoryForm', () => {
  const mockFormData = {
    descricao: {
      name: 'descricao',
      value: '',
      dirty: 'false',
      message: 'Descrição deve ter entre 3 e 50 caracteres',
      id: 'descricao',
      type: 'text',
      placeholder: 'Descrição',
      validation: (value: unknown) => /^.{3,50}$/.test(value as string),
      invalid: 'false'
    },
  };

  const mockUseComponentCategoryForm = {
    formData: mockFormData,
    loading: false,
    setFormData: vi.fn(),
    handleInputChange: vi.fn(),
    handleTurnDirty: vi.fn(),
    handleSubmit: vi.fn(),
    isEditing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useComponentCategoryFormHook.useComponentCategoryForm).mockReturnValue(mockUseComponentCategoryForm);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render form with all fields', () => {
    renderWithRouter(<ComponentCategoryForm />);

    expect(screen.getByRole('heading', { name: 'Categoria Componente' })).toBeInTheDocument();
    expect(screen.getAllByText('Descrição').length).toBeGreaterThan(0);
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('should call handleInputChange when input changes', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ComponentCategoryForm />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Test');

    expect(mockUseComponentCategoryForm.handleInputChange).toHaveBeenCalled();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ComponentCategoryForm />);

    const submitButton = screen.getByText('Salvar');
    await user.click(submitButton);

    expect(mockUseComponentCategoryForm.handleSubmit).toHaveBeenCalled();
  });

  it('should show loading state when submitting', () => {
    vi.mocked(useComponentCategoryFormHook.useComponentCategoryForm).mockReturnValue({
      ...mockUseComponentCategoryForm,
      loading: true,
    });

    renderWithRouter(<ComponentCategoryForm />);

    expect(screen.getByText('Salvando...')).toBeInTheDocument();
  });

  it('should display validation messages', () => {
    const formDataWithErrors = {
      ...mockFormData,
      descricao: { ...mockFormData.descricao, invalid: 'true' },
    };

    vi.mocked(useComponentCategoryFormHook.useComponentCategoryForm).mockReturnValue({
      ...mockUseComponentCategoryForm,
      formData: formDataWithErrors,
    });

    renderWithRouter(<ComponentCategoryForm />);

    expect(screen.getByText('Descrição deve ter entre 3 e 50 caracteres')).toBeInTheDocument();
  });

  it('should have cancel link pointing to /component-categories', () => {
    renderWithRouter(<ComponentCategoryForm />);

    const cancelButton = screen.getByText('Cancelar');
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/componentcategories');
  });
});
