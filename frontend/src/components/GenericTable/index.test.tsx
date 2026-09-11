import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenericTable, { TableColumn } from './index';
import * as authService from '../../services/authService';

// Mock authService
vi.mock('../../services/authService', () => ({
  hasAnyRoles: vi.fn(() => true),
}));

// Mock DropdownMenu component
vi.mock('../DropdownMenu', () => ({
  default: ({ onEdit, onDelete, onInactivate }: any) => (
    <div data-testid="dropdown-menu">
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
      <button onClick={onInactivate}>Inactivate</button>
    </div>
  ),
}));

interface TestItem {
  id: number;
  name: string;
  status: string;
}

describe('GenericTable', () => {
  const mockData: TestItem[] = [
    { id: 1, name: 'Item 1', status: 'ACTIVE' },
    { id: 2, name: 'Item 2', status: 'INACTIVE' },
    { id: 3, name: 'Item 3', status: 'ACTIVE' },
  ];

  const mockColumns: TableColumn<TestItem>[] = [
    {
      key: 'id',
      header: 'ID',
      accessor: (item) => item.id,
      className: 'tb576',
    },
    {
      key: 'name',
      header: 'Name',
      accessor: (item) => item.name,
      className: 'txt-left',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item) => item.status,
    },
  ];

  describe('Rendering', () => {
    it('should render table with correct headers', () => {
      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
        />
      );

      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render all data rows', () => {
      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should apply column className to headers', () => {
      const { container } = render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
        />
      );

      const headers = container.querySelectorAll('th');
      expect(headers[0]).toHaveClass('tb576');
      expect(headers[1]).toHaveClass('txt-left');
    });

    it('should apply column className to cells', () => {
      const { container } = render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
        />
      );

      const firstRowCells = container.querySelectorAll('tbody tr:first-child td');
      expect(firstRowCells[0]).toHaveClass('tb576');
      expect(firstRowCells[1]).toHaveClass('txt-left');
    });

    it('should apply row className when provided', () => {
      const { container } = render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
          rowClassName={(item) => `situacao-${item.status.toLowerCase()}`}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows[0]).toHaveClass('situacao-active');
      expect(rows[1]).toHaveClass('situacao-inactive');
      expect(rows[2]).toHaveClass('situacao-active');
    });

    it('should render empty table when no data provided', () => {
      const { container } = render(
        <GenericTable
          data={[]}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
        />
      );

      const tbody = container.querySelector('tbody');
      expect(tbody?.children).toHaveLength(0);
    });
  });

  describe('Actions Column', () => {
    it('should show actions column when user has roles and handlers provided', () => {
      vi.mocked(authService.hasAnyRoles).mockReturnValue(true);

      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );

      const dropdownMenus = screen.getAllByTestId('dropdown-menu');
      expect(dropdownMenus).toHaveLength(mockData.length);
    });

    it('should not show actions column when user lacks roles', () => {
      vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );

      expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    });

    it('should respect showActions prop override', () => {
      vi.mocked(authService.hasAnyRoles).mockReturnValue(false);

      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
          onEdit={vi.fn()}
          showActions={true}
        />
      );

      const dropdownMenus = screen.getAllByTestId('dropdown-menu');
      expect(dropdownMenus).toHaveLength(mockData.length);
    });

    it('should not show actions column when no handlers provided', () => {
      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
        />
      );

      expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    });
  });

  describe('Action Handlers', () => {
    it('should call onEdit with correct item when edit clicked', async () => {
      const user = userEvent.setup();
      const handleEdit = vi.fn();

      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
          onEdit={handleEdit}
          showActions={true}
        />
      );

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      expect(handleEdit).toHaveBeenCalledWith(mockData[0]);
    });

    it('should call onDelete with correct item when delete clicked', async () => {
      const user = userEvent.setup();
      const handleDelete = vi.fn();

      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
          onDelete={handleDelete}
          showActions={true}
        />
      );

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[1]);

      expect(handleDelete).toHaveBeenCalledWith(mockData[1]);
    });

    it('should call onInactivate with correct item when inactivate clicked', async () => {
      const user = userEvent.setup();
      const handleInactivate = vi.fn();

      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
          onInactivate={handleInactivate}
          showActions={true}
        />
      );

      const inactivateButtons = screen.getAllByText('Inactivate');
      await user.click(inactivateButtons[2]);

      expect(handleInactivate).toHaveBeenCalledWith(mockData[2]);
    });
  });

  describe('Custom Actions', () => {
    it('should render custom actions when provided', () => {
      const customActions = (item: TestItem) => (
        <button data-testid={`custom-${item.id}`}>Custom Action</button>
      );

      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
          customActions={customActions}
          showActions={true}
        />
      );

      expect(screen.getByTestId('custom-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-2')).toBeInTheDocument();
      expect(screen.getByTestId('custom-3')).toBeInTheDocument();
    });

    it('should prefer custom actions over dropdown menu', () => {
      const customActions = (item: TestItem) => (
        <button data-testid={`custom-${item.id}`}>Custom Action</button>
      );

      render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => item.id}
          onEdit={vi.fn()}
          customActions={customActions}
          showActions={true}
        />
      );

      expect(screen.getByTestId('custom-1')).toBeInTheDocument();
      expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
    });
  });

  describe('Complex Accessors', () => {
    it('should render complex ReactNode from accessor', () => {
      const columnsWithComplexAccessor: TableColumn<TestItem>[] = [
        {
          key: 'name',
          header: 'Name',
          accessor: (item) => (
            <div data-testid={`complex-${item.id}`}>
              <strong>{item.name}</strong> - {item.status}
            </div>
          ),
        },
      ];

      render(
        <GenericTable
          data={mockData}
          columns={columnsWithComplexAccessor}
          keyExtractor={(item) => item.id}
        />
      );

      expect(screen.getByTestId('complex-1')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('Key Extraction', () => {
    it('should use keyExtractor to generate unique keys', () => {
      const { container } = render(
        <GenericTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={(item) => `custom-${item.id}`}
        />
      );

      const rows = container.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(mockData.length);
    });
  });
});
