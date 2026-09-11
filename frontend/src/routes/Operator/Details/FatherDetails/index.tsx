import { getLabel } from "../../../../models/enums/tipoPintura";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Package, Tag, Layers, Frame, Sparkles, Box, Eye, Edit, Trash2, Ban } from "lucide-react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import DialogConfirmation from "../../../../components/DialogConfirmation";
import DialogInfo from "../../../../components/DialogInfo";
import { useFatherDetails } from "../../../../hooks/crud/useFatherDetails";
import { Spinner } from "../../../../components/Loading";

export default function FatherDetails() {
  const navigate = useNavigate();
  const {
    pai: entity,
    loading,
    error,
    dialogInfoData,
    setDialogInfoData,
    dialogConfirmationData,
    handleDialogInfoClose,
    handleUpdateClick,
    handleDeleteClick,
    handleDialogConfirmationAnswer,
    handleInactivate,
  } = useFatherDetails();

  return (
    <main className="father-details-main">
      <section className="container father-details-container">
        {loading ? (
          <div className="father-loading">
            <Spinner size="large" aria-label="Carregando detalhes" />
          </div>
        ) : entity ? (
          <>
            <div className="father-header-card">
              <div className="father-header-content">
                <div className="father-header-left">
                  <div className="father-icon-wrapper">
                    <Package size={32} />
                  </div>
                  <div className="father-header-info">
                    <h1 className="father-title">{entity?.codigo}</h1>
                    <p className="father-description">{entity?.descricao}</p>
                  </div>
                </div>
                <div className="father-header-actions">
                  <button
                    className="btn-edit-father"
                    onClick={() => navigate(`/fathers/${entity?.codigo}`)}
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                </div>
              </div>
            </div>

            <div className="father-info-grid">
              <div className="info-card">
                <div className="info-card-icon">
                  <Tag size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Código</span>
                  <span className="info-card-value">{entity?.codigo}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Layers size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Modelo</span>
                  <span className="info-card-value">{entity?.modelo?.descricao || "Não especificado"}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Box size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Categoria</span>
                  <span className="info-card-value">{entity?.categoriaComponente?.descricao || "Não especificada"}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Frame size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Bordas - Comprimento</span>
                  <span className="info-card-value">{entity?.bordasComprimento || "Não especificado"}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Frame size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Bordas - Largura</span>
                  <span className="info-card-value">{entity?.bordasLargura || "Não especificado"}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Sparkles size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Tipo de Pintura</span>
                  <span className="info-card-value">{entity?.tipoPintura ? getLabel(entity.tipoPintura) : "Não Especificado"}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-content" style={{flexDirection: 'row', gap: '12px', alignItems: 'center'}}>
                  <span className="info-card-label">TNT Uma Face:</span>
                  {entity?.tntUmaFace ?
                    <FaCheckCircle className="status-icon success" size={20} /> :
                    <FaTimesCircle className="status-icon error" size={20} />
                  }
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-content" style={{flexDirection: 'row', gap: '12px', alignItems: 'center'}}>
                  <span className="info-card-label">Plástico Acima:</span>
                  {entity?.plasticoAcima ?
                    <FaCheckCircle className="status-icon success" size={20} /> :
                    <FaTimesCircle className="status-icon error" size={20} />
                  }
                </div>
              </div>
            </div>

            <div className="sons-section">
              <div className="sons-header">
                <h2 className="sons-title">Filhos</h2>
                <span className="sons-count">{entity?.filhos.filter(obj => obj.situacao !== 'LIXEIRA').length} itens</span>
              </div>

              <div className="sons-table-wrapper">
                <table className="sons-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descrição</th>
                      <th>Cor</th>
                      <th>Medidas</th>
                      <th>Status</th>
                      <th className="actions-column">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entity?.filhos.filter(obj => obj.situacao !== 'LIXEIRA')
                    .map((filho) => (
                      <tr key={filho.codigo} className={`son-row situacao-${filho.situacao.toLowerCase()}`}>
                        <td className="son-code">{filho.codigo}</td>
                        <td className="son-description">{filho.descricao}</td>
                        <td className="son-color">
                          <span className="color-badge">{filho.cor.descricao}</span>
                        </td>
                        <td className="son-measures">
                          {filho.medidas.altura} × {filho.medidas.largura} × {filho.medidas.espessura}
                        </td>
                        <td className="son-status">
                          <span className={`status-badge status-${filho.situacao.toLowerCase()}`}>
                            {filho.situacao}
                          </span>
                        </td>
                        <td className="son-actions">
                          <Link to={`/sons/details/${filho.codigo}`} className="action-btn action-view" title="Visualizar">
                            <Eye size={18} />
                          </Link>
                          <button
                            className="action-btn action-edit"
                            onClick={() => handleUpdateClick(filho.codigo)}
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="action-btn action-inactive"
                            onClick={() => handleInactivate([filho.codigo])}
                            title="Inativar"
                          >
                            <Ban size={18} />
                          </button>
                          <button
                            className="action-btn action-delete"
                            onClick={() => handleDeleteClick(filho.codigo)}
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </section>

      {
        dialogInfoData.visible &&
          <DialogInfo
            message={dialogInfoData.message}
            onDialogClose={handleDialogInfoClose}
          />
      }

      {
        dialogConfirmationData.visible &&
          <DialogConfirmation
            id={dialogConfirmationData.id}
            message={dialogConfirmationData.message}
            onDialogAnswer={handleDialogConfirmationAnswer}
          />
      }
    </main>
  );
}
