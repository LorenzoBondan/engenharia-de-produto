import { formatDate, formatLocalDateTime } from './formatters';

/**
 * Situação (status) enum label mappings
 * Maps enum values to human-readable Portuguese labels
 */
export const SITUACAO_LABELS: Record<string, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  LIXEIRA: 'Lixeira',
};

/**
 * Tipo de Material (material type) enum label mappings
 * Maps enum values to human-readable Portuguese labels
 */
export const TIPO_MATERIAL_LABELS: Record<string, string> = {
  CHAPA_MDP: 'Chapa MDP',
  CHAPA_MDF: 'Chapa MDF',
  FITA_BORDA: 'Fita de Borda',
  COLA: 'Cola',
  PINTURA: 'Pintura',
  POLIESTER: 'Poliéster',
  PLASTICO: 'Plástico',
  TNT: 'TNT',
  POLIETILENO: 'Polietileno',
  PINTURA_BORDA_FUNDO: 'Pintura Borda Fundo',
  BAGUETE: 'Baguete',
  CANTONEIRA: 'Cantoneira',
};

/**
 * Enum field names to their corresponding label mappings
 */
const ENUM_MAPPINGS: Record<string, Record<string, string>> = {
  situacao: SITUACAO_LABELS,
  tipoMaterial: TIPO_MATERIAL_LABELS,
};

/**
 * Check if a string matches ISO 8601 date format
 */
function isDateString(value: string): boolean {
  // Match yyyy-MM-dd or yyyy-MM-ddTHH:mm:ss formats
  return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value);
}

/**
 * Check if a value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/**
 * Render a field value with type-aware formatting
 *
 * Handles all data types: strings, numbers, booleans, dates, objects, arrays, null, undefined.
 * Applies appropriate formatting based on type detection.
 *
 * @param value - The field value to render (any type)
 * @param fieldName - Optional field name for enum detection
 * @returns Formatted string representation of the value
 *
 * @example
 * ```typescript
 * renderFieldValue('Simple text') // 'Simple text'
 * renderFieldValue(123.45) // '123.45'
 * renderFieldValue(true) // 'Sim'
 * renderFieldValue('2025-07-29T19:47:47.028828') // '29/07/2025 - 19:47'
 * renderFieldValue({ codigo: 1, descricao: 'Test' }) // '1 - Test'
 * renderFieldValue('ATIVO', 'situacao') // 'Ativo'
 * renderFieldValue(null) // 'N/A'
 * ```
 */
export function renderFieldValue(
  value: unknown,
  fieldName?: string
): string {
  // Handle null and undefined
  if (value === null || value === undefined) {
    return 'N/A';
  }

  // Handle boolean
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  // Handle number
  if (typeof value === 'number') {
    return value.toString();
  }

  // Handle string
  if (typeof value === 'string') {
    // Check for date strings
    if (isDateString(value)) {
      try {
        // Try datetime format first (with time component)
        if (value.includes('T')) {
          return formatLocalDateTime(value);
        }
        // Otherwise use date-only format
        return formatDate(value);
      } catch (error) {
        // If formatting fails, return raw value
        return value;
      }
    }

    // Check for enum conversion
    if (fieldName && ENUM_MAPPINGS[fieldName]) {
      const enumLabel = ENUM_MAPPINGS[fieldName][value];
      if (enumLabel) {
        return enumLabel;
      }
    }

    // Return string as-is
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    return `[${value.map((item) => renderFieldValue(item)).join(', ')}]`;
  }

  // Handle plain objects
  if (isPlainObject(value)) {
    const codigo = value.codigo;
    const descricao = value.descricao;

    // Show codigo and descricao if available
    if (codigo !== undefined && descricao !== undefined) {
      return `${codigo} - ${descricao}`;
    }
    if (codigo !== undefined) {
      return `${codigo}`;
    }
    if (descricao !== undefined) {
      return `${descricao}`;
    }

    // Fallback for objects without codigo/descricao
    return '[Object]';
  }

  // Fallback for unknown types
  return String(value);
}
