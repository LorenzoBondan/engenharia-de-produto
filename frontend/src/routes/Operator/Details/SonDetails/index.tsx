import { getLabel } from "../../../../models/enums/tipoFilho";
import { formatDate } from "../../../../utils/formatters";
import { FileText, Tag, Palette, Ruler, Route, Calendar, DollarSign, Package, Link as LinkIcon, Eye, Edit, Trash2, Ban } from "lucide-react";
import "./styles.css";
import DialogConfirmation from "../../../../components/DialogConfirmation";
import DialogInfo from "../../../../components/DialogInfo";
import { Link, useNavigate } from "react-router-dom";
import { useSonDetails } from "../../../../hooks/crud/useSonDetails";
import { Spinner } from "../../../../components/Loading";

export default function SonDetails() {
  const navigate = useNavigate();
  const {
    filho: entity,
    loading,
    error,
    dialogInfoData,
    dialogConfirmationData,
    handleDialogInfoClose,
    handleAccessoryInactivate,
    handleMaterialInactivate,
    handleSonInactivate,
    handleAccessoryDeleteClick,
    handleMaterialDeleteClick,
    handleSonDeleteClick,
    handleDialogConfirmationAnswer,
  } = useSonDetails();

  return (
    <main className="son-details-main">
      <section className="container son-details-container">
        {loading ? (
          <div className="son-loading">
            <Spinner size="large" aria-label="Carregando detalhes" />
          </div>
        ) : entity ? (
          <>
            <div className="son-header-card">
              <div className="son-header-content">
                <div className="son-header-left">
                  <div className="son-icon-wrapper">
                    <FileText size={32} />
                  </div>
                  <div className="son-header-info">
                    <h1 className="son-title">{entity?.codigo}</h1>
                    <p className="son-description">{entity?.descricao}</p>
                  </div>
                </div>
                <div className="son-header-actions">
                  <button
                    className="btn-edit-son"
                    onClick={() => navigate(`/sons/${entity?.codigo}`)}
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                </div>
              </div>
            </div>

            <div className="son-info-grid">
              <div className="info-card">
                <div className="info-card-icon">
                  <Tag size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Código</span>
                  <span className="info-card-value">{entity?.codigo}</span>
                </div>
              </div>

              <div className="info-card clickable" onClick={() => entity?.pai && navigate(`/fathers/details/${entity?.pai.codigo}`)}>
                <div className="info-card-icon">
                  <Package size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Pai</span>
                  <span className="info-card-value">
                    {entity?.pai ? entity?.pai.descricao : "Não especificado"}
                  </span>
                </div>
                {entity?.pai && <LinkIcon className="info-card-link-icon" size={16} />}
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Palette size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Cor</span>
                  <span className="info-card-value">{entity?.cor ? entity?.cor?.descricao : "Não especificada"}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Ruler size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Altura</span>
                  <span className="info-card-value">{entity?.medidas ? entity?.medidas.altura : "Não especificada"} mm</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Ruler size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Largura</span>
                  <span className="info-card-value">{entity?.medidas ? entity?.medidas.largura : "Não especificada"} mm</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Ruler size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Espessura</span>
                  <span className="info-card-value">{entity?.medidas ? entity?.medidas.espessura : "Não especificada"} mm</span>
                </div>
              </div>

              <div className="info-card clickable" onClick={() => entity?.roteiro && navigate(`/guides/details/${entity?.roteiro.codigo}`)}>
                <div className="info-card-icon">
                  <Route size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Roteiro</span>
                  <span className="info-card-value">
                    {entity?.roteiro ? entity?.roteiro.descricao : "Não especificado"}
                  </span>
                </div>
                {entity?.roteiro && <LinkIcon className="info-card-link-icon" size={16} />}
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <Calendar size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Implantação</span>
                  <span className="info-card-value">
                    {entity?.implantacao ? formatDate(entity.implantacao.toString()) : "Não especificado"}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <FileText size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Tipo</span>
                  <span className="info-card-value">{entity?.tipo ? getLabel(entity.tipo) : "Não Especificado"}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <DollarSign size={20} />
                </div>
                <div className="info-card-content">
                  <span className="info-card-label">Valor</span>
                  <span className="info-card-value">R$ {entity?.valor}</span>
                </div>
              </div>
            </div>

            <div className="son-section">
              <div className="son-section-header">
                <h2 className="son-section-title">Materiais</h2>
                <span className="son-section-count">
                  {entity?.materiaisUsados?.filter(obj => obj.situacao !== 'LIXEIRA').length} itens
                </span>
              </div>

              <div className="son-table-wrapper">
                <table className="son-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descrição</th>
                      <th>Qtd. Líquida</th>
                      <th>Qtd. Bruta</th>
                      <th>Valor (R$)</th>
                      <th>Status</th>
                      <th className="actions-column">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entity?.materiaisUsados?.filter(obj => obj.situacao !== 'LIXEIRA')
                    .map((materialUsado) => (
                      <tr key={materialUsado.codigo} className={`situacao-${materialUsado.situacao.toLowerCase()}`}>
                        <td className="item-code">{materialUsado.material.codigo}</td>
                        <td className="item-description">{materialUsado.material.descricao}</td>
                        <td className="item-quantity">{materialUsado.quantidadeLiquida} {materialUsado.unidadeMedida}</td>
                        <td className="item-quantity">{materialUsado.quantidadeBruta} {materialUsado.unidadeMedida}</td>
                        <td className="item-value">{materialUsado.valor}</td>
                        <td className="item-status">
                          <span className={`status-badge status-${materialUsado.situacao.toLowerCase()}`}>
                            {materialUsado.situacao}
                          </span>
                        </td>
                        <td className="item-actions">
                          <button
                            className="action-btn action-edit"
                            onClick={() => window.location.href = `/usedMaterials/${materialUsado.codigo}`}
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="action-btn action-inactive"
                            onClick={() => handleMaterialInactivate([materialUsado.codigo])}
                            title="Inativar"
                          >
                            <Ban size={18} />
                          </button>
                          <button
                            className="action-btn action-delete"
                            onClick={() => handleMaterialDeleteClick(materialUsado.codigo)}
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

            <div className="son-section">
              <div className="son-section-header">
                <h2 className="son-section-title">Acessórios</h2>
                <span className="son-section-count">
                  {entity?.acessoriosUsados?.filter(obj => obj.situacao !== 'LIXEIRA').length} itens
                </span>
              </div>

              <div className="son-table-wrapper">
                <table className="son-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descrição</th>
                      <th>Quantidade</th>
                      <th>Valor (R$)</th>
                      <th>Status</th>
                      <th className="actions-column">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entity?.acessoriosUsados?.filter(obj => obj.situacao !== 'LIXEIRA')
                    .map((acessorioUsado) => (
                      <tr key={acessorioUsado.codigo} className={`situacao-${acessorioUsado.situacao.toLowerCase()}`}>
                        <td className="item-code">{acessorioUsado.acessorio.codigo}</td>
                        <td className="item-description">{acessorioUsado.acessorio.descricao}</td>
                        <td className="item-quantity">{acessorioUsado.quantidade} {acessorioUsado.unidadeMedida}</td>
                        <td className="item-value">{acessorioUsado.valor}</td>
                        <td className="item-status">
                          <span className={`status-badge status-${acessorioUsado.situacao.toLowerCase()}`}>
                            {acessorioUsado.situacao}
                          </span>
                        </td>
                        <td className="item-actions">
                          <button
                            className="action-btn action-edit"
                            onClick={() => window.location.href = `/usedAccessories/${acessorioUsado.codigo}`}
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="action-btn action-inactive"
                            onClick={() => handleAccessoryInactivate([acessorioUsado.codigo])}
                            title="Inativar"
                          >
                            <Ban size={18} />
                          </button>
                          <button
                            className="action-btn action-delete"
                            onClick={() => handleAccessoryDeleteClick(acessorioUsado.codigo)}
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

            <div className="son-section">
              <div className="son-section-header">
                <h2 className="son-section-title">Filhos</h2>
                <span className="son-section-count">
                  {entity?.filhos?.filter(obj => obj.situacao !== 'LIXEIRA').length} itens
                </span>
              </div>

              <div className="son-table-wrapper">
                <table className="son-table">
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
                    {entity?.filhos?.filter(obj => obj.situacao !== 'LIXEIRA')
                    .map((sonItem) => (
                      <tr key={sonItem.codigo} className={`situacao-${sonItem.situacao.toLowerCase()}`}>
                        <td className="item-code">{sonItem.codigo}</td>
                        <td className="item-description">{sonItem.descricao}</td>
                        <td className="item-color">
                          <span className="color-badge">{sonItem.cor.descricao}</span>
                        </td>
                        <td className="item-measures">
                          {sonItem.medidas.altura} × {sonItem.medidas.largura} × {sonItem.medidas.espessura}
                        </td>
                        <td className="item-status">
                          <span className={`status-badge status-${sonItem.situacao.toLowerCase()}`}>
                            {sonItem.situacao}
                          </span>
                        </td>
                        <td className="item-actions">
                          <Link to={`/sons/details/${sonItem.codigo}`} className="action-btn action-view" title="Visualizar">
                            <Eye size={18} />
                          </Link>
                          <button
                            className="action-btn action-edit"
                            onClick={() => window.location.href = `/sons/${sonItem.codigo}`}
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="action-btn action-inactive"
                            onClick={() => handleSonInactivate([sonItem.codigo])}
                            title="Inativar"
                          >
                            <Ban size={18} />
                          </button>
                          <button
                            className="action-btn action-delete"
                            onClick={() => handleSonDeleteClick(sonItem.codigo)}
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
