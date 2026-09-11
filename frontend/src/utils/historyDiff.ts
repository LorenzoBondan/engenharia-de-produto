import type { FieldChange } from '../hooks/types';

/**
 * Default Portuguese field label mappings
 * Maps technical field names to human-readable Portuguese labels
 */
const DEFAULT_FIELD_LABELS: Record<string, string> = {
  codigo: 'Código',
  descricao: 'Descrição',
  situacao: 'Situação',
  hexa: 'Hexa',
  valor: 'Valor',
  implantacao: 'Implantação',
  porcentagemPerda: 'Porcentagem de Perda',
  espessura: 'Espessura',
  faces: 'Faces',
  tipoMaterial: 'Tipo de Material',
  cor: 'Cor',
  medidas: 'Medidas',
  modelo: 'Modelo',
  categoriaComponente: 'Categoria de Componente',
  categoria: 'Categoria',
  altura: 'Altura',
  largura: 'Largura',
  nome: 'Nome',
  formula: 'Fórmula',
  ativo: 'Ativo',
  observacao: 'Observação',
  tags: 'Tags',
  pai: 'Pai',
  filho: 'Filho',
  maquina: 'Máquina',
  grupoMaquina: 'Grupo de Máquina',
  roteiro: 'Roteiro',
  customField: 'Campo Customizado',
};

/**
 * Audit fields that should be excluded from diff results
 * These are metadata fields managed by the system
 */
const AUDIT_FIELDS = new Set([
  'criadoem',
  'criadopor',
  'modificadoem',
  'modificadopor',
]);

/**
 * Maximum recursion depth for nested object comparison
 * Prevents infinite loops on circular references
 */
const MAX_RECURSION_DEPTH = 5;

/**
 * Checks if a value is a plain object (not array, date, or null)
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
 * Deep comparison of two values to detect if they are equal
 * Handles primitives, objects, arrays, null, and undefined
 */
function areValuesEqual(
  value1: unknown,
  value2: unknown,
  depth: number = 0,
  visited: WeakSet<object> = new WeakSet()
): boolean {
  // Prevent infinite recursion
  if (depth > MAX_RECURSION_DEPTH) {
    return true; // Assume equal if too deep
  }

  // Check for circular references
  if (isPlainObject(value1) && visited.has(value1)) {
    return true;
  }
  if (isPlainObject(value2) && visited.has(value2)) {
    return true;
  }

  // Handle identical references
  if (value1 === value2) {
    return true;
  }

  // Handle null and undefined
  if (value1 === null || value1 === undefined) {
    return value2 === null || value2 === undefined ? value1 === value2 : false;
  }
  if (value2 === null || value2 === undefined) {
    return false;
  }

  // Handle different types
  if (typeof value1 !== typeof value2) {
    return false;
  }

  // Handle arrays
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false;
    }
    return value1.every((item, index) =>
      areValuesEqual(item, value2[index], depth + 1, visited)
    );
  }

  // Handle objects
  if (isPlainObject(value1) && isPlainObject(value2)) {
    // Track visited objects to handle circular references
    visited.add(value1);
    visited.add(value2);

    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key) =>
      areValuesEqual(value1[key], value2[key], depth + 1, visited)
    );
  }

  // Handle primitives (string, number, boolean)
  return value1 === value2;
}

/**
 * Calculate field differences between two entity snapshots
 *
 * Compares all fields between current and previous entity versions,
 * detecting changes in primitives, nested objects, arrays, and null/undefined values.
 * Excludes audit fields from results.
 *
 * @template T - The entity type being compared
 * @param currentEntity - Current entity state
 * @param previousEntity - Previous entity state
 * @param customFieldLabels - Optional custom field name to label mappings
 * @returns Array of FieldChange objects representing changed fields only
 *
 * @example
 * ```typescript
 * const current = { codigo: 1, descricao: 'New', valor: 100 };
 * const previous = { codigo: 1, descricao: 'Old', valor: 100 };
 * const changes = calculateFieldDifferences(current, previous);
 * // Returns: [{ fieldName: 'descricao', oldValue: 'Old', newValue: 'New', displayName: 'Descrição', isNested: false }]
 * ```
 */
export function calculateFieldDifferences<T extends Record<string, unknown>>(
  currentEntity: T,
  previousEntity: T,
  customFieldLabels?: Record<string, string>
): FieldChange[] {
  const changes: FieldChange[] = [];
  const fieldLabels = { ...DEFAULT_FIELD_LABELS, ...customFieldLabels };

  // Get all unique field names from both entities
  const allFieldNames = new Set([
    ...Object.keys(currentEntity),
    ...Object.keys(previousEntity),
  ]);

  for (const fieldName of allFieldNames) {
    // Skip audit fields
    if (AUDIT_FIELDS.has(fieldName)) {
      continue;
    }

    const currentValue = currentEntity[fieldName];
    const previousValue = previousEntity[fieldName];

    // Check if values are equal
    if (areValuesEqual(currentValue, previousValue)) {
      continue;
    }

    // Determine if field is nested object
    const isNested =
      isPlainObject(currentValue) || isPlainObject(previousValue);

    // Get display name (use custom label, default label, or field name)
    const displayName = fieldLabels[fieldName] || fieldName;

    changes.push({
      fieldName,
      oldValue: previousValue,
      newValue: currentValue,
      displayName,
      isNested,
    });
  }

  return changes;
}
