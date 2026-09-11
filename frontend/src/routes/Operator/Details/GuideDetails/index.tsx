import { formatDate } from "../../../../utils/formatters";
import { Route, Tag, Calendar, CalendarCheck, DollarSign, Cog, Edit, Trash2, Ban, Clock } from "lucide-react";
import "./styles.css";
import { useGuideDetails } from "../../../../hooks/crud/useGuideDetails";
import DialogInfo from "../../../../components/DialogInfo";
import DialogConfirmation from "../../../../components/DialogConfirmation";
import { Spinner } from "../../../../components/Loading";
import { useNavigate } from "react-router-dom";

export default function GuideDetails() {
  const navigate = useNavigate();

  const {
    roteiro: entity,
    loading,
    error,
    dialogInfoData,
    dialogConfirmationData,
    handleDialogInfoClose,
    handleUpdateClick,
    handleDeleteClick,
    handleDialogConfirmationAnswer,
    handleInactivate,
  } = useGuideDetails();

  return (
    <main className="guide-details-main">
      <section className="container guide-details-container">
        {loading ? (
          <div className="guide-loading">
            <Spinner size="large" aria-label="Carregando detalhes" />
          </div>
        ) : entity ? (
          <>
            <div className="guide-header-card">
              <div className="guide-header-content">
                <div className="guide-header-left">
                  <div className="guide-icon-wrapper">
                    <Route size={32} />
                  </div>
                  <div className="guide-header-info">
                    <h1 className="guide-title">{entity?.codigo}</h1>
                    <p className="guide-description">{entity?.descricao}</p>
                  </div>
                </div>
                <div className="guide-header-actions">
                  <button
                    className="btn-edit-guide"
                    onClick={() => navigate(`/guides/${entity?.codigo}`)}
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                </div>
              </div>
            </div>

            <div className="guide-info-grid">
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
                  <Calendar size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Implantação</span>
                  <span className="info-card-value">
                    {entity?.implantacao ? formatDate(entity?.implantacao.toString()) : "Não especificado"}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <CalendarCheck size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Data Final</span>
                  <span className="info-card-value">
                    {entity?.dataFinal ? formatDate(entity?.dataFinal.toString()) : "Não especificado"}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <DollarSign size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Valor</span>
                  <span className="info-card-value">{entity?.valor || "Não especificado"}</span>
                </div>
              </div>
            </div>

            <div className="guide-section">
              <div className="guide-section-header">
                <h2 className="guide-section-title">Máquinas</h2>
                <span className="guide-section-count">
                  {entity?.roteiroMaquinas.filter(obj => obj.situacao !== 'LIXEIRA').length} itens
                </span>
              </div>

              <div className="guide-table-wrapper">
                <table className="guide-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nome</th>
                      <th>Tempo</th>
                      <th>Status</th>
                      <th className="actions-column">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entity?.roteiroMaquinas.filter(obj => obj.situacao !== 'LIXEIRA')
                    .map((roteiroMaquina) => (
                      <tr key={roteiroMaquina.codigo} className={`situacao-${roteiroMaquina.situacao.toLowerCase()}`}>
                        <td className="machine-code">{roteiroMaquina.maquina.codigo}</td>
                        <td className="machine-name">
                          <div className="machine-name-wrapper">
                            <Cog size={16} className="machine-icon" />
                            {roteiroMaquina.maquina.nome}
                          </div>
                        </td>
                        <td className="machine-time">
                          <div className="time-badge">
                            <Clock size={14} />
                            {roteiroMaquina.tempoMaquina}
                          </div>
                        </td>
                        <td className="machine-status">
                          <span className={`status-badge status-${roteiroMaquina.situacao.toLowerCase()}`}>
                            {roteiroMaquina.situacao}
                          </span>
                        </td>
                        <td className="machine-actions">
                          <button
                            className="action-btn action-edit"
                            onClick={() => handleUpdateClick(roteiroMaquina.codigo)}
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="action-btn action-inactive"
                            onClick={() => handleInactivate([roteiroMaquina.codigo])}
                            title="Inativar"
                          >
                            <Ban size={18} />
                          </button>
                          <button
                            className="action-btn action-delete"
                            onClick={() => handleDeleteClick(roteiroMaquina.codigo)}
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
