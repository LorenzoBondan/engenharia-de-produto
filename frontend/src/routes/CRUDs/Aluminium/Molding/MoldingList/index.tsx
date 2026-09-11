import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoldingList } from '../../../../../hooks/crud/useMoldingList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DBaguete } from '../../../../../models/baguete';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function MoldingList() {

    const navigate = useNavigate();
    const { data: baguetes, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useMoldingList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/moldings/create");
    }

    function handleUpdateClick(baguete: DBaguete) {
        navigate(`/moldings/${baguete.codigo}`);
    }

    function handleDeleteClick(baguete: DBaguete) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: baguete.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, moldingId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(moldingId) ? moldingId : [moldingId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(baguete: DBaguete) {
        handleInactivate([baguete.codigo]);
    }

    const columns: TableColumn<DBaguete>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (baguete) => baguete.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (baguete) => baguete.descricao,
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Baguete</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && baguetes.length === 0 ? (
                    <SkeletonTable columns={2} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={baguetes.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(baguete) => baguete.codigo}
                            rowClassName={(baguete) => `situacao-${baguete.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && baguetes.length > 0 && (
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