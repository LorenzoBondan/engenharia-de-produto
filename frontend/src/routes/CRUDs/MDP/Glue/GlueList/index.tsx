import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlueList } from '../../../../../hooks/crud/useGlueList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DCola } from '../../../../../models/cola';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { hasAnyRoles } from '../../../../../services/authService';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function GlueList() {

    const navigate = useNavigate();
    const { data: colas, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useGlueList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/glues/create");
    }

    function handleUpdateClick(cola: DCola) {
        navigate(`/glues/${cola.codigo}`);
    }

    function handleDeleteClick(cola: DCola) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: cola.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, glueId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(glueId) ? glueId : [glueId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(cola: DCola) {
        handleInactivate([cola.codigo]);
    }

    const columns: TableColumn<DCola>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (cola) => cola.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (cola) => cola.descricao,
            className: 'txt-left'
        },
        {
            key: 'gramatura',
            header: 'Gramatura',
            accessor: (cola) => cola.gramatura,
            className: 'txt-left'
        }
    ];


    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Colas</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && colas.length === 0 ? (
                    <SkeletonTable columns={3} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={colas.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(cola) => cola.codigo}
                            rowClassName={(cola) => `situacao-${cola.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && colas.length > 0 && (
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