import * as lixeiraService from "../../../services/lixeiraService";
import { useEffect, useState } from 'react';
import { DLixeira } from '../../../models/lixeira';
import ButtonNextPage from '../../../components/ButtonNextPage';
import { formatLocalDateTime } from '../../../utils/formatters';
import DialogConfirmation from "../../../components/DialogConfirmation";
import DialogInfo from "../../../components/DialogInfo";
import { Trash2, RotateCcw, Database, Calendar, User, Hash, Table } from 'lucide-react';
import './styles.css';

type QueryParams = {
    page: number;
    nometabela: string;
}

export default function Trash(){

    const [isLastPage, setIsLastPage] = useState(false);

    const [lixeiras, setLixeiras] = useState<DLixeira[]>([]);

    const [queryParams, setQueryParam] = useState<QueryParams>({
        page: 0,
        nometabela: ""
    });

    const [dialogInfoData, setDialogInfoData] = useState({
        visible: false,
        message: "Sucesso!"
    });

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Deseja recuperar os dependentes desse item também?"
    });

    useEffect(() => {
        lixeiraService.pesquisarTodos('', '=', queryParams.nometabela, queryParams.page, 8, "id;a")
            .then(response => {
                const nextPage = response.data.content;
                setLixeiras(lixeiras.concat(nextPage));
                setIsLastPage(response.data.last);
            });
    }, [queryParams]);

    function handleNextPageClick() {
        setQueryParam({ ...queryParams, page: queryParams.page + 1 });
    }

    function handleDialogInfoClose() {
        setDialogInfoData({ ...dialogInfoData, visible: false });
    }

    function handleDialogConfirmationAnswer(answer: boolean, lixeiraId: number | number[]) {
        const id = typeof lixeiraId === 'number' ? lixeiraId : lixeiraId[0];
        lixeiraService.recuperarPorId(id, answer)
            .then(() => {
                setLixeiras([]);
                setQueryParam({ ...queryParams, page: 0 });
            })
            .catch(error => {
                setDialogInfoData({
                    visible: true,
                    message: error.response.data.error
                })
            });

        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleRecuperarClick(lixeiraId: number) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: lixeiraId, visible: true });
    }

    return(
        <div className="trash-main">
            <div className="trash-container">
                <div className="trash-header-card">
                    <div className="trash-header-content">
                        <div className="trash-icon-wrapper">
                            <Trash2 size={32} />
                        </div>
                        <div className="trash-header-info">
                            <h1 className="trash-title">Lixeira</h1>
                            <p className="trash-subtitle">Visualize e recupere itens removidos do sistema</p>
                        </div>
                    </div>
                </div>

                {lixeiras.length === 0 ? (
                    <div className="trash-empty-card">
                        <div className="trash-empty-icon">
                            <Trash2 size={48} />
                        </div>
                        <h3 className="trash-empty-title">Nenhum item na lixeira</h3>
                        <p className="trash-empty-message">
                            Não há itens removidos para exibir
                        </p>
                    </div>
                ) : (
                    <div className="trash-items-container">
                        {lixeiras.map(lixeira => (
                            <div key={lixeira.id} className="trash-item-card">
                                <div className="trash-item-header">
                                    <div className="trash-item-icon">
                                        <Database size={20} />
                                    </div>
                                    <div className="trash-item-id">
                                        <Hash size={14} />
                                        {lixeira.id}
                                    </div>
                                </div>

                                <div className="trash-item-content">
                                    <div className="trash-item-row">
                                        <div className="trash-item-label">
                                            <Table size={16} />
                                            Tabela
                                        </div>
                                        <div className="trash-item-value">{lixeira.nometabela}</div>
                                    </div>

                                    <div className="trash-item-row">
                                        <div className="trash-item-label">
                                            <Calendar size={16} />
                                            Data
                                        </div>
                                        <div className="trash-item-value">
                                            {formatLocalDateTime(lixeira.data.toString())}
                                        </div>
                                    </div>

                                    <div className="trash-item-row">
                                        <div className="trash-item-label">
                                            <Hash size={16} />
                                            ID Entidade
                                        </div>
                                        <div className="trash-item-value">
                                            {Object.values(lixeira.entidadeid).join(", ")}
                                        </div>
                                    </div>

                                    <div className="trash-item-row">
                                        <div className="trash-item-label">
                                            <User size={16} />
                                            Usuário
                                        </div>
                                        <div className="trash-item-value">{lixeira.usuario}</div>
                                    </div>
                                </div>

                                <div className="trash-item-footer">
                                    <button
                                        className="trash-item-restore-btn"
                                        onClick={() => handleRecuperarClick(lixeira.id)}
                                        title="Recuperar item"
                                    >
                                        <RotateCcw size={18} />
                                        Recuperar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLastPage && lixeiras.length > 0 && (
                    <div className="trash-load-more">
                        <ButtonNextPage onNextPage={handleNextPageClick} />
                    </div>
                )}
            </div>

            {dialogInfoData.visible && (
                <DialogInfo
                    message={dialogInfoData.message}
                    onDialogClose={handleDialogInfoClose}
                />
            )}

            {dialogConfirmationData.visible && (
                <DialogConfirmation
                    id={dialogConfirmationData.id}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            )}
        </div>
    );
}