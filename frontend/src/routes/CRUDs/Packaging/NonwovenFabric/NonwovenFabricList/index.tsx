import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNonwovenFabricList } from '../../../../../hooks/crud/useNonwovenFabricList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DTnt } from '../../../../../models/tnt';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function NonwovenFabricList() {

    const navigate = useNavigate();
    const { data: tnts, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useNonwovenFabricList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/nonwovenfabrics/create");
    }

    function handleUpdateClick(tnt: DTnt) {
        navigate(`/nonwovenfabrics/${tnt.codigo}`);
    }

    function handleDeleteClick(tnt: DTnt) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: tnt.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, nonwovenFabricId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(nonwovenFabricId) ? nonwovenFabricId : [nonwovenFabricId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(tnt: DTnt) {
        handleInactivate([tnt.codigo]);
    }

    const columns: TableColumn<DTnt>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (tnt) => tnt.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (tnt) => tnt.descricao,
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de TNTs</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && tnts.length === 0 ? (
                    <SkeletonTable columns={2} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={tnts.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(tnt) => tnt.codigo}
                            rowClassName={(tnt) => `situacao-${tnt.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && tnts.length > 0 && (
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