import React from 'react';
import DropdownMenu from '../DropdownMenu';
import { hasAnyRoles } from '../../services/authService';

/**
 * Configuration for a table column
 */
export interface TableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Header text to display */
  header: string;
  /** Function to extract/render cell content from row data */
  accessor: (item: T) => React.ReactNode;
  /** Optional CSS class for header and cells */
  className?: string;
}

/**
 * Props for GenericTable component
 */
export interface GenericTableProps<T> {
  /** Array of data items to display */
  data: T[];
  /** Column configuration array */
  columns: TableColumn<T>[];
  /** Function to extract unique key from each item */
  keyExtractor: (item: T) => string | number;
  /** Optional function to determine row CSS class based on item */
  rowClassName?: (item: T) => string;
  /** Optional edit handler - shows edit action if provided */
  onEdit?: (item: T) => void;
  /** Optional delete handler - shows delete action if provided */
  onDelete?: (item: T) => void;
  /** Optional inactivate handler - shows inactivate action if provided */
  onInactivate?: (item: T) => void;
  /** Whether to show action column - defaults to checking user roles */
  showActions?: boolean;
  /** Optional custom action column renderer */
  customActions?: (item: T) => React.ReactNode;
}

/**
 * Generic reusable table component for CRUD list pages
 *
 * Features:
 * - Type-safe column configuration
 * - Automatic action menu (edit/delete/inactivate)
 * - Row styling based on item state
 * - Flexible cell rendering via accessor functions
 * - Optional custom actions column
 *
 * @example
 * ```tsx
 * <GenericTable
 *   data={colors}
 *   keyExtractor={(color) => color.codigo}
 *   rowClassName={(color) => `situacao-${color.situacao.toLowerCase()}`}
 *   columns={[
 *     { key: 'codigo', header: 'Código', accessor: (c) => c.codigo, className: 'tb576' },
 *     { key: 'descricao', header: 'Descrição', accessor: (c) => c.descricao, className: 'txt-left' }
 *   ]}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onInactivate={handleInactivate}
 * />
 * ```
 */
export default function GenericTable<T>({
  data,
  columns,
  keyExtractor,
  rowClassName,
  onEdit,
  onDelete,
  onInactivate,
  showActions = hasAnyRoles(['ROLE_ADMIN', 'ROLE_ANALYST']),
  customActions,
}: GenericTableProps<T>) {

  const hasDropdownActions = onEdit || onDelete || onInactivate;
  const shouldShowActionsColumn = showActions && (hasDropdownActions || customActions);

  return (
    <table className="table mb20 mt20">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className={column.className}>
              {column.header}
            </th>
          ))}
          {shouldShowActionsColumn && <th></th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          const key = keyExtractor(item);
          const className = rowClassName ? rowClassName(item) : '';

          return (
            <tr key={key} className={className}>
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.accessor(item)}
                </td>
              ))}
              {shouldShowActionsColumn && (
                <td>
                  {customActions ? (
                    customActions(item)
                  ) : (
                    hasDropdownActions && (
                      <DropdownMenu
                        onEdit={onEdit ? () => onEdit(item) : () => {}}
                        onInactivate={onInactivate ? () => onInactivate(item) : () => {}}
                        onDelete={onDelete ? () => onDelete(item) : () => {}}
                      />
                    )
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
