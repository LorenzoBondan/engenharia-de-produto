import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DropdownMenu from './index';

describe('DropdownMenu', () => {
  it('should render dropdown toggle button', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole('button', { name: '⋮' })).toBeInTheDocument();
  });

  it('should not show menu items initially', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    expect(screen.queryByText('Inativar')).not.toBeInTheDocument();
    expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
  });

  it('should show menu items when toggle button is clicked', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Inativar')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('should hide menu items when toggle button is clicked twice', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);

    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });

  it('should call onEdit when Edit button is clicked', () => {
    const handleEdit = vi.fn();
    render(<DropdownMenu onEdit={handleEdit} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const editButton = screen.getByText('Editar');
    fireEvent.click(editButton);

    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onInactivate when Inactivate button is clicked', () => {
    const handleInactivate = vi.fn();
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={handleInactivate} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const inactivateButton = screen.getByText('Inativar');
    fireEvent.click(inactivateButton);

    expect(handleInactivate).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when Delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={handleDelete} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const deleteButton = screen.getByText('Excluir');
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('should close menu after clicking Edit button', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const editButton = screen.getByText('Editar');
    fireEvent.click(editButton);

    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });

  it('should close menu after clicking Inactivate button', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const inactivateButton = screen.getByText('Inativar');
    fireEvent.click(inactivateButton);

    expect(screen.queryByText('Inativar')).not.toBeInTheDocument();
  });

  it('should close menu after clicking Delete button', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const deleteButton = screen.getByText('Excluir');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
  });

  it('should have dropdown class', () => {
    const { container } = render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    expect(container.querySelector('.dropdown')).toBeInTheDocument();
  });

  it('should have dropdown-toggle class on toggle button', () => {
    const { container } = render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    expect(container.querySelector('.dropdown-toggle')).toBeInTheDocument();
  });

  it('should have dropdown-menu class when open', () => {
    const { container } = render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    expect(container.querySelector('.dropdown-menu')).toBeInTheDocument();
  });

  it('should have dropdown-item class on menu items', () => {
    const { container } = render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const items = container.querySelectorAll('.dropdown-item');
    expect(items).toHaveLength(3);
  });

  it('should close menu when clicking outside', async () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    expect(screen.getByText('Editar')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    });
  });

  it('should not close menu when clicking inside dropdown', () => {
    const { container } = render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const dropdown = container.querySelector('.dropdown');
    if (dropdown) {
      fireEvent.mouseDown(dropdown);
    }

    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('should render three menu items when open', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4); // toggle + 3 menu items
  });

  it('should toggle menu state correctly', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });

    // First click - open
    fireEvent.click(toggleButton);
    expect(screen.getByText('Editar')).toBeInTheDocument();

    // Second click - close
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();

    // Third click - open again
    fireEvent.click(toggleButton);
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('should maintain menu items order', () => {
    render(<DropdownMenu onEdit={vi.fn()} onInactivate={vi.fn()} onDelete={vi.fn()} />);

    const toggleButton = screen.getByRole('button', { name: '⋮' });
    fireEvent.click(toggleButton);

    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveTextContent('Editar');
    expect(buttons[2]).toHaveTextContent('Inativar');
    expect(buttons[3]).toHaveTextContent('Excluir');
  });
});
