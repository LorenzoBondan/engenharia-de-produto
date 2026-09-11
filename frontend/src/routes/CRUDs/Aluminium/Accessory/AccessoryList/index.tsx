import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessoryList } from '../../../../../hooks/crud/useAccessoryList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DAcessorio } from '../../../../../models/acessorio';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function AccessoryList() {

    const navigate = useNavigate();
    const { data: acessorios, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useAccessoryList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/accessories/create");
    }

    function handleUpdateClick(acessorio: DAcessorio) {
        navigate(`/accessories/${acessorio.codigo}`);
    }

    function handleDeleteClick(acessorio: DAcessorio) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: acessorio.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, accessoryId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(accessoryId) ? accessoryId : [accessoryId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(acessorio: DAcessorio) {
        handleInactivate([acessorio.codigo]);
    }

    const columns: TableColumn<DAcessorio>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (acessorio) => acessorio.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (acessorio) => acessorio.descricao,
            className: 'txt-left'
        },
        {
            key: 'cor',
            header: 'Cor',
            accessor: (acessorio) => acessorio.cor?.descricao || '',
            className: 'txt-left'
        },
        {
            key: 'altura',
            header: 'Altura',
            accessor: (acessorio) => acessorio.medidas?.altura || '',
            className: 'txt-left'
        },
        {
            key: 'largura',
            header: 'Largura',
            accessor: (acessorio) => acessorio.medidas?.largura || '',
            className: 'txt-left'
        },
        {
            key: 'espessura',
            header: 'Espessura',
            accessor: (acessorio) => acessorio.medidas?.espessura || '',
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Acessórios</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && acessorios.length === 0 ? (
                    <SkeletonTable columns={6} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={acessorios.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(acessorio) => acessorio.codigo}
                            rowClassName={(acessorio) => `situacao-${acessorio.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && acessorios.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <Spinner size="medium" aria-label="Carregando mais itens" />
                            </div>
                        )}

                        {!isLastPage && !loading && <ButtonNextPage onNextPage={handleNextPage} />}
                    </>
                )}
            </section>

            {
                error &&
                <DialogInfo
                    message={error}
                    onDialogClose={() => {}}
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