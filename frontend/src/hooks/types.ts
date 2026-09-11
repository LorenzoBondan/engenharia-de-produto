import { AxiosResponse } from 'axios';
import { AccessTokenPayloadDTO, CredentialsDTO } from '../models/auth';

/**
 * Discriminated union type for hook states
 * Ensures type-safe state management with impossible states eliminated
 */
export type HookState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: string };

/**
 * Generic page response structure from backend
 */
export interface PageResponse<T> {
  content: T[];
  last: boolean;
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
}

/**
 * Configuration for usePaginatedList hook
 */
export interface PaginatedListConfig<T> {
  /**
   * Service function to fetch paginated data
   * @param colunas - Column names to search
   * @param operacoes - Search operations (=, !=, LIKE, etc.)
   * @param valores - Search values
   * @param page - Page number (0-indexed)
   * @param pageSize - Number of items per page
   * @param sort - Sort specification (e.g., "id;d" for descending)
   */
  fetchFunction: (
    colunas: string,
    operacoes: string,
    valores: string,
    page?: number,
    pageSize?: number,
    sort?: string
  ) => Promise<AxiosResponse<PageResponse<T>>>;

  /**
   * Column name to use for search operations
   */
  searchColumn: string;

  /**
   * Number of items per page (default: 8)
   */
  pageSize?: number;

  /**
   * Sort specification (default: "id;a")
   */
  sort?: string;

  /**
   * Optional delete function
   */
  deleteFunction?: (ids: number[]) => Promise<AxiosResponse>;

  /**
   * Optional inactivate function
   */
  inactivateFunction?: (ids: number[]) => Promise<AxiosResponse>;
}

/**
 * Return type for usePaginatedList hook
 */
export interface UsePaginatedListReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  isLastPage: boolean;
  handleSearch: (searchText: string) => void;
  handleNextPage: () => void;
  handleDelete: (ids: number[]) => Promise<void>;
  handleInactivate: (ids: number[]) => Promise<void>;
  refresh: () => void;
}

/**
 * Form data structure following forms.ts utility pattern
 */
export interface FormDataStructure {
  [fieldName: string]: FormFieldState;
}

/**
 * Individual form field state
 */
export interface FormFieldState {
  value: unknown;
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  validation?: (value: unknown) => boolean;
  message?: string;
  dirty?: string; // "true" | "false" as string (legacy pattern)
  invalid?: string; // "true" | "false" as string (legacy pattern)
}

/**
 * Configuration for useEntityForm hook
 */
export interface EntityFormConfig<T> {
  /**
   * Entity ID for edit mode (undefined for create mode)
   */
  entityId?: number | string;

  /**
   * Function to fetch existing entity data in edit mode
   */
  fetchFunction?: (id: number | string) => Promise<AxiosResponse<T>>;

  /**
   * Function to create new entity
   */
  createFunction: (entity: T) => Promise<AxiosResponse<T>>;

  /**
   * Function to update existing entity
   */
  updateFunction: (entity: T) => Promise<AxiosResponse<T>>;

  /**
   * Initial form data structure
   */
  initialFormData: FormDataStructure;

  /**
   * Function to map form values to entity type
   */
  toEntityMapper: (formValues: Record<string, unknown>) => T;
}

/**
 * Return type for useEntityForm hook
 */
export interface UseEntityFormReturn {
  formData: FormDataStructure;
  setFormData: React.Dispatch<React.SetStateAction<FormDataStructure>>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTurnDirty: (name: string) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  isEditing: boolean;
  loading: boolean;
  error: string | null;
  submitSuccess: boolean;
}

/**
 * Dropdown data source configuration
 */
export interface DropdownSource<T> {
  /**
   * Unique key for this dropdown source
   */
  key: string;

  /**
   * Function to fetch dropdown data
   */
  fetchFunction: () => Promise<AxiosResponse<T[]>>;

  /**
   * Optional transformation function for dropdown data
   */
  transform?: (data: T[]) => unknown[];
}

/**
 * Return type for useDropdownData hook
 */
export interface UseDropdownDataReturn<T extends Record<string, unknown>> {
  data: T;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Configuration for useEntityDetail hook
 */
export interface EntityDetailConfig<T, N = unknown> {
  /**
   * Entity ID to fetch
   */
  entityId?: number | string;

  /**
   * Function to fetch entity data
   */
  fetchFunction: (id: number | string) => Promise<AxiosResponse<T>>;

  /**
   * Optional key in entity object that contains nested list
   */
  nestedListKey?: keyof T;
}

/**
 * Return type for useEntityDetail hook
 */
export interface UseEntityDetailReturn<T, N = unknown> {
  entity: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  addToNested: (item: N) => void;
  removeFromNested: (itemId: number | string) => void;
  updateNested: (itemId: number | string, updates: Partial<N>) => void;
}

/**
 * Action type for dialog confirmation
 */
export type ActionType = 'delete' | 'inactivate' | 'custom';

/**
 * Return type for useDialogConfirmation hook
 */
export interface UseDialogConfirmationReturn {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  pendingAction: (() => Promise<void>) | null;
  openDialog: (item: unknown, action: () => Promise<void>) => void;
  closeDialog: () => void;
  handleConfirm: () => Promise<void>;
}

/**
 * Return type for useCurrentUser hook
 */
export interface UseCurrentUserReturn {
  user: AccessTokenPayloadDTO | null;
  isAuthenticated: boolean;
  email: string | null;
  roles: string[];
  hasRole: (role: string) => boolean;
  hasAnyRoles: (roles: string[]) => boolean;
}

/**
 * Configuration for usePdfDownload hook
 */
export interface PdfDownloadConfig {
  /**
   * Function that returns PDF Blob
   */
  downloadFunction: (...args: unknown[]) => Promise<AxiosResponse<Blob>>;

  /**
   * Optional function to generate filename
   */
  filenameGenerator?: (...args: unknown[]) => string;
}

/**
 * Return type for usePdfDownload hook
 */
export interface UsePdfDownloadReturn {
  download: (...args: any[]) => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * Return type for useDebouncedValue hook
 */
export interface UseDebouncedValueReturn<T> {
  value: T;
  debouncedValue: T;
  setValue: (newValue: T) => void;
}

/**
 * Authentication state for useAuth hook
 */
export type AuthState =
  | { status: 'idle'; user: null; error: null }
  | { status: 'loading'; user: null; error: null }
  | { status: 'authenticated'; user: AccessTokenPayloadDTO; error: null }
  | { status: 'error'; user: null; error: string }
  | { status: 'unauthenticated'; user: null; error: null };


/**
 * Return type for useAuth hook
 */
export interface UseAuthReturn {
  login: (credentials: CredentialsDTO) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasAnyRoles: (roles: string[]) => boolean;
  user: AccessTokenPayloadDTO | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic history record wrapping any entity type
 *
 * @template T - The entity type being tracked (e.g., DCor, DChapa)
 *
 * @example
 * ```typescript
 * // History record for Cor entity
 * const corHistory: HistoryRecord<DCor> = {
 *   id: 97,
 *   date: "2025-07-29T19:47:47.028828",
 *   author: "postgres",
 *   entity: { codigo: 1, descricao: "Minerale", hexa: "F12398", situacao: "ATIVO" },
 *   diff: { descricao: "Minerale CZ", situacao: "LIXEIRA" }
 * };
 * ```
 */
export interface HistoryRecord<T> {
  /**
   * Unique identifier for this history record
   */
  id: number;

  /**
   * ISO 8601 timestamp when this change occurred
   */
  date: string;

  /**
   * Username or identifier of the user who made this change
   */
  author: string;

  /**
   * Complete entity state at this point in history
   */
  entity: T;

  /**
   * Backend-provided diff containing previous values of changed fields
   * Null for the first version (no previous state to compare)
   */
  diff: Record<string, unknown> | null;
}

/**
 * Represents a single field change between two entity versions
 * Used for displaying "old value → new value" in the UI
 *
 * @example
 * ```typescript
 * const fieldChange: FieldChange = {
 *   fieldName: "descricao",
 *   oldValue: "Minerale",
 *   newValue: "Minerale CZ",
 *   displayName: "Descrição",
 *   isNested: false
 * };
 * ```
 */
export interface FieldChange {
  /**
   * Technical field name as it appears in the entity (e.g., "descricao")
   */
  fieldName: string;

  /**
   * Previous value of the field (supports all data types)
   */
  oldValue: unknown;

  /**
   * Current/new value of the field (supports all data types)
   */
  newValue: unknown;

  /**
   * Human-readable label for display (e.g., "Descrição")
   * Localized to Portuguese by default
   */
  displayName: string;

  /**
   * True if the value is a nested object (e.g., cor: { codigo, descricao })
   * False for primitives (string, number, boolean, date)
   */
  isNested: boolean;
}

/**
 * Configuration for useEntityHistory hook
 *
 * @template T - The entity type being tracked
 *
 * @example
 * ```typescript
 * const config: UseEntityHistoryConfig<DCor> = {
 *   fetchHistoryFn: corService.pesquisarHistorico,
 *   entityId: 123
 * };
 * ```
 */
export interface UseEntityHistoryConfig<T> {
  /**
   * Service method that fetches history for a specific entity
   * Must follow the pattern: (entityId: number) => Promise<AxiosResponse<HistoryRecord<T>[]>>
   *
   * @param entityId - The ID of the entity to fetch history for
   * @returns Promise resolving to array of history records
   */
  fetchHistoryFn: (entityId: number) => Promise<AxiosResponse<HistoryRecord<T>[]>>;

  /**
   * The ID of the entity to fetch history for
   * Must be a positive integer
   */
  entityId: number;
}

/**
 * Return type for useEntityHistory hook
 * Provides history data, loading state, error handling, and refresh capability
 *
 * @template T - The entity type being tracked
 *
 * @example
 * ```typescript
 * const { history, loading, error, refresh } = useEntityHistory({
 *   fetchHistoryFn: corService.pesquisarHistorico,
 *   entityId: 123
 * });
 *
 * if (loading) return <Spinner />;
 * if (error) return <Alert>{error}</Alert>;
 * return <HistoryTimeline history={history} />;
 * ```
 */
export interface UseEntityHistoryReturn<T> {
  /**
   * Array of history records sorted by date (newest first)
   * Empty array if no history exists or while loading
   */
  history: HistoryRecord<T>[];

  /**
   * True while fetching history data from the server
   * False once fetch completes (success or error)
   */
  loading: boolean;

  /**
   * User-friendly error message if fetch fails
   * Null when no error or while loading
   * Includes HTTP-status-aware messages (403, 404, 500, network errors)
   */
  error: string | null;

  /**
   * Function to manually refresh history data
   * Bypasses cache and refetches from server
   */
  refresh: () => void;
}
