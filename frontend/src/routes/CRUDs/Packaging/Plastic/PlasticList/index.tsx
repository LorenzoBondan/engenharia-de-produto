import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlasticList } from '../../../../../hooks/crud/usePlasticList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DPlastico } from '../../../../../models/plastico';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function PlasticList() {

    const navigate = useNavigate();
    const { data: plasticos, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = usePlasticList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/plastics/create");
    }

    function handleUpdateClick(plastico: DPlastico) {
        navigate(`/plastics/${plastico.codigo}`);
    }

    function handleDeleteClick(plastico: DPlastico) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: plastico.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, plasticId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(plasticId) ? plasticId : [plasticId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(plastico: DPlastico) {
        handleInactivate([plastico.codigo]);
    }

    const columns: TableColumn<DPlastico>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (plastico) => plastico.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (plastico) => plastico.descricao,
            className: 'txt-left'
        },
        {
            key: 'gramatura',
            header: 'Gramatura',
            accessor: (plastico) => plastico.gramatura,
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Plásticos</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && plasticos.length === 0 ? (
                    <SkeletonTable columns={3} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={plasticos.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(plastico) => plastico.codigo}
                            rowClassName={(plastico) => `situacao-${plastico.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && plasticos.length > 0 && (
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