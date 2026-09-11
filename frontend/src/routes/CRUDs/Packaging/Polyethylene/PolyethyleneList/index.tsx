import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolyethyleneList } from '../../../../../hooks/crud/usePolyethyleneList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DPolietileno } from '../../../../../models/polietileno';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function PolyethyleneList() {

    const navigate = useNavigate();
    const { data: polietilenos, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = usePolyethyleneList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/polyethylenes/create");
    }

    function handleUpdateClick(polietileno: DPolietileno) {
        navigate(`/polyethylenes/${polietileno.codigo}`);
    }

    function handleDeleteClick(polietileno: DPolietileno) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: polietileno.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, polyethyleneId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(polyethyleneId) ? polyethyleneId : [polyethyleneId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(polietileno: DPolietileno) {
        handleInactivate([polietileno.codigo]);
    }

    const columns: TableColumn<DPolietileno>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (polietileno) => polietileno.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (polietileno) => polietileno.descricao,
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Polietilenos</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && polietilenos.length === 0 ? (
                    <SkeletonTable columns={2} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={polietilenos.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(polietileno) => polietileno.codigo}
                            rowClassName={(polietileno) => `situacao-${polietileno.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && polietilenos.length > 0 && (
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