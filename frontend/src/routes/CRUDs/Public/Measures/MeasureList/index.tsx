import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeasureList } from '../../../../../hooks/crud/useMeasureList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DMedidas } from '../../../../../models/medidas';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function MeasureList() {

    const navigate = useNavigate();
    const { data: medidas, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useMeasureList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/measures/create");
    }

    function handleUpdateClick(medida: DMedidas) {
        navigate(`/measures/${medida.codigo}`);
    }

    function handleDeleteClick(medida: DMedidas) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: medida.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, measureId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(measureId) ? measureId : [measureId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(medida: DMedidas) {
        handleInactivate([medida.codigo]);
    }

    const columns: TableColumn<DMedidas>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (medida) => medida.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'altura',
            header: 'Altura',
            accessor: (medida) => medida.altura,
            className: 'txt-left'
        },
        {
            key: 'largura',
            header: 'Largura',
            accessor: (medida) => medida.largura,
            className: 'txt-left'
        },
        {
            key: 'espessura',
            header: 'Espessura',
            accessor: (medida) => medida.espessura,
            className: 'txt-left'
        }
    ];


    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Medidas</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && medidas.length === 0 ? (
                    <SkeletonTable columns={4} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={medidas.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(medida) => medida.codigo}
                            rowClassName={(medida) => `situacao-${medida.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && medidas.length > 0 && (
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