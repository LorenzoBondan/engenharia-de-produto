import type { HistoryRecord } from '../../hooks/types';
import { renderFieldValue } from '../../utils/historyFieldRenderer';
import { formatLocalDateTime } from '../../utils/formatters';
import styles from './HistoryRecordCard.module.css';

/**
 * Field name mappings for Portuguese labels
 * Supports both camelCase and snake_case field names
 */
const FIELD_LABELS: Record<string, string> = {
  codigo: 'Código',
  descricao: 'Descrição',
  situacao: 'Situação',
  hexa: 'Hexa',
  valor: 'Valor',
  implantacao: 'Implantação',
  porcentagemPerda: 'Porcentagem de Perda',
  porcentagem_perda: 'Porcentagem de Perda',
  espessura: 'Espessura',
  faces: 'Faces',
  tipoMaterial: 'Tipo de Material',
  tipo_material: 'Tipo de Material',
  cor: 'Cor',
  medidas: 'Medidas',
  modelo: 'Modelo',
  categoriaComponente: 'Categoria de Componente',
  categoria_componente: 'Categoria de Componente',
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
  grupo_maquina: 'Grupo de Máquina',
  roteiro: 'Roteiro',
};

/**
 * Audit fields that should be excluded from history display
 * These are system metadata fields managed automatically
 */
const AUDIT_FIELDS = new Set([
  'criadoem',
  'criado_em',
  'criadopor',
  'criado_por',
  'modificadoem',
  'modificado_em',
  'modificadopor',
  'modificado_por',
]);

/**
 * Get display name for a field
 * Converts technical field names to human-readable Portuguese labels
 */
function getFieldDisplayName(fieldName: string): string {
  return FIELD_LABELS[fieldName] || fieldName;
}

/**
 * Convert snake_case to camelCase
 * Example: "porcentagem_perda" -> "porcentagemPerda"
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Get value from entity, trying both snake_case and camelCase
 * Backend may send fields in snake_case in diff but camelCase in entity
 */
function getEntityValue(entity: Record<string, unknown>, fieldName: string): unknown {
  // Try exact match first
  if (fieldName in entity) {
    return entity[fieldName];
  }

  // Try camelCase version if fieldName is snake_case
  if (fieldName.includes('_')) {
    const camelCase = snakeToCamel(fieldName);
    if (camelCase in entity) {
      return entity[camelCase];
    }
  }

  return undefined;
}

/**
 * Props for HistoryRecordCard component
 * @template T - The entity type being tracked
 */
export interface HistoryRecordCardProps<T> {
  /** The current history record to display */
  record: HistoryRecord<T>;
  /** Whether this is the latest/current version */
  isLatest: boolean;
}

/**
 * HistoryRecordCard Component
 *
 * Displays a single history record with metadata and field changes.
 * Uses the backend-provided diff field to show what changed in this version.
 *
 * @template T - The entity type
 * @param props - Component props
 *
 * @example
 * ```tsx
 * <HistoryRecordCard
 *   record={currentRecord}
 *   isLatest={false}
 * />
 * ```
 */
export function HistoryRecordCard<T extends Record<string, unknown>>({
  record,
  isLatest,
}: HistoryRecordCardProps<T>) {
  // Use backend-provided diff to show only changed fields
  // record.diff contains the PREVIOUS values of fields that changed
  // We only iterate over fields present in diff (not all entity fields)
  const fieldChanges: Array<{
    fieldName: string;
    oldValue: unknown;
    newValue: unknown;
  }> = [];

  if (record.diff && Object.keys(record.diff).length > 0) {
    // Iterate ONLY over fields that exist in diff (fields that changed)
    for (const fieldName of Object.keys(record.diff)) {
      // Skip audit fields (system metadata)
      if (AUDIT_FIELDS.has(fieldName.toLowerCase())) {
        continue;
      }

      const oldValue = record.diff[fieldName];
      // Try to get value from entity, handling both snake_case and camelCase
      const newValue = getEntityValue(record.entity, fieldName);

      fieldChanges.push({
        fieldName,
        oldValue,
        newValue,
      });
    }
  }

  return (
    <div className={styles.card}>
      {/* Header with metadata */}
      <div className={styles.header}>
        <div className={styles.metadata}>
          <span className={styles.date}>
            {formatLocalDateTime(record.date)}
          </span>
          <span className={styles.author}>{record.author}</span>
        </div>
        {isLatest && (
          <span className={styles.latestBadge}>Versão Atual</span>
        )}
      </div>

      {/* Body with field changes */}
      <div className={styles.body}>
        {!record.diff ? (
          // First version - no changes to show (diff is null)
          <div className={styles.initialVersion}>
            Versão inicial criada
          </div>
        ) : fieldChanges.length === 0 ? (
          // No changes detected (rare edge case)
          <div className={styles.noChanges}>
            Nenhuma alteração detectada
          </div>
        ) : (
          // Show field changes
          <div className={styles.changes}>
            {fieldChanges.map((change) => (
              <div key={change.fieldName} className={styles.changeRow}>
                <span className={styles.fieldLabel}>
                  {getFieldDisplayName(change.fieldName)}:
                </span>
                <div className={styles.valueChange}>
                  <span className={styles.oldValue}>
                    {renderFieldValue(change.oldValue, change.fieldName)}
                  </span>
                  <span className={styles.arrow}>→</span>
                  <span className={styles.newValue}>
                    {renderFieldValue(change.newValue, change.fieldName)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
