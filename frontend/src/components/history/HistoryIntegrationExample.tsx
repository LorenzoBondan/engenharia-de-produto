/**
 * INTEGRATION EXAMPLE - Color Detail Page with History
 *
 * This file demonstrates how to integrate history functionality into a CRUD detail page.
 * Copy this pattern and adapt it for any entity type (Chapa, Material, Acessório, etc.).
 *
 * Key Integration Points:
 * 1. Import HistoryButton and HistoryModal components
 * 2. Add useState for modal visibility
 * 3. Place HistoryButton in page actions area
 * 4. Mount HistoryModal with entity-specific props
 *
 * This example is fully functional and follows production patterns.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HistoryButton } from './HistoryButton';
import { HistoryModal } from './HistoryModal';

// Import your entity type and service
// Replace with actual imports from your codebase
type DCor = {
  codigo: number;
  descricao: string;
  hexa: string;
  situacao: 'ATIVO' | 'INATIVO' | 'LIXEIRA';
};

// Mock service - replace with actual service import
const corService = {
  buscarPorId: async (id: number) => ({
    data: {
      codigo: id,
      descricao: 'Azul Minerale',
      hexa: 'F12398',
      situacao: 'ATIVO' as const,
    },
  }),
  pesquisarHistorico: async (id: number) => ({
    data: [],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  }),
};

/**
 * CorDetailPage Component
 *
 * CRUD detail page for Color entity with integrated history functionality.
 * This serves as a template for all other entity detail pages.
 */
export function CorDetailPageExample() {
  // ========================================
  // 1. ROUTE PARAMS & NAVIGATION
  // ========================================
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const corId = parseInt(id || '0');

  // ========================================
  // 2. STATE MANAGEMENT
  // ========================================
  const [cor, setCor] = useState<DCor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // HISTORY INTEGRATION: Add modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // ========================================
  // 3. DATA LOADING
  // ========================================
  useEffect(() => {
    const loadCor = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await corService.buscarPorId(corId);
        setCor(response.data);
      } catch (err: any) {
        console.error('Error loading cor:', err);
        setError('Erro ao carregar cor. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (corId > 0) {
      loadCor();
    } else {
      setError('ID inválido');
      setLoading(false);
    }
  }, [corId]);

  // ========================================
  // 4. EVENT HANDLERS
  // ========================================
  const handleEdit = () => {
    navigate(`/cor/${corId}/editar`);
  };

  const handleDelete = async () => {
    if (confirm('Deseja realmente excluir esta cor?')) {
      // Delete logic here
      console.log('Delete cor:', corId);
    }
  };

  // HISTORY INTEGRATION: Handler to open modal
  const handleViewHistory = () => {
    setIsHistoryModalOpen(true);
  };

  // ========================================
  // 5. RENDER STATES
  // ========================================
  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <p>{error}</p>
        <button onClick={() => navigate('/cor')}>Voltar</button>
      </div>
    );
  }

  if (!cor) {
    return (
      <div className="page-not-found">
        <p>Cor não encontrada</p>
        <button onClick={() => navigate('/cor')}>Voltar</button>
      </div>
    );
  }

  // ========================================
  // 6. MAIN RENDER
  // ========================================
  return (
    <div className="cor-detail-page">
      {/* PAGE HEADER */}
      <header className="page-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/cor')}>
            ← Voltar
          </button>
          <h1>Cor - {cor.descricao}</h1>
        </div>

        {/* ACTION BUTTONS */}
        <div className="page-actions">
          <button className="btn-edit" onClick={handleEdit}>
            Editar
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Excluir
          </button>

          {/* HISTORY INTEGRATION: Add history button */}
          <HistoryButton onClick={handleViewHistory} />
        </div>
      </header>

      {/* ENTITY DETAILS */}
      <main className="page-content">
        <section className="details-card">
          <h2>Informações</h2>

          <div className="details-grid">
            <div className="detail-field">
              <label>Código:</label>
              <span>{cor.codigo}</span>
            </div>

            <div className="detail-field">
              <label>Descrição:</label>
              <span>{cor.descricao}</span>
            </div>

            <div className="detail-field">
              <label>Hexa:</label>
              <span>
                #{cor.hexa}
                <span
                  className="color-preview"
                  style={{ backgroundColor: `#${cor.hexa}` }}
                />
              </span>
            </div>

            <div className="detail-field">
              <label>Situação:</label>
              <span className={`status status-${cor.situacao.toLowerCase()}`}>
                {cor.situacao}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* HISTORY INTEGRATION: Add history modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        entityId={corId}
        fetchHistoryFn={corService.pesquisarHistorico}
        entityName={`Cor - ${cor.descricao}`}
      />
    </div>
  );
}

/**
 * ADAPTATION GUIDE FOR OTHER ENTITIES
 *
 * To adapt this example for other entities:
 *
 * 1. RENAME COMPONENT:
 *    CorDetailPageExample → ChapaDetailPageExample, MaterialDetailPageExample, etc.
 *
 * 2. UPDATE IMPORTS:
 *    import type { DChapa } from '../models/chapa';
 *    import { chapaService } from '../services/chapaService';
 *
 * 3. UPDATE TYPE:
 *    DCor → DChapa, DMaterial, etc.
 *
 * 4. UPDATE SERVICE CALLS:
 *    corService.buscarPorId → chapaService.buscarPorId
 *    corService.pesquisarHistorico → chapaService.pesquisarHistorico
 *
 * 5. UPDATE ENTITY NAME:
 *    "Cor" → "Chapa", "Material", etc.
 *
 * 6. UPDATE FIELDS:
 *    Replace details-grid content with entity-specific fields
 *
 * 7. KEEP HISTORY INTEGRATION UNCHANGED:
 *    The HistoryButton and HistoryModal components work identically
 *    for all entity types - just update the props.
 *
 * EXAMPLE for Chapa:
 * ```typescript
 * <HistoryModal
 *   isOpen={isHistoryModalOpen}
 *   onClose={() => setIsHistoryModalOpen(false)}
 *   entityId={chapaId}
 *   fetchHistoryFn={chapaService.pesquisarHistorico}
 *   entityName={`Chapa - ${chapa.descricao}`}
 * />
 * ```
 */

/**
 * CSS EXAMPLE (adapt to your styling system)
 */
const exampleStyles = `
.cor-detail-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e0e0e0;
}

.page-actions {
  display: flex;
  gap: 12px;
}

.details-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-field label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.detail-field span {
  font-size: 16px;
  color: #333;
}

.color-preview {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-left: 8px;
  vertical-align: middle;
  border: 1px solid #ddd;
}

.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-ativo {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-inativo {
  background-color: #fafafa;
  color: #616161;
}

.status-lixeira {
  background-color: #ffebee;
  color: #c62828;
}
`;

// Export styles for reference (optional)
export { exampleStyles };
