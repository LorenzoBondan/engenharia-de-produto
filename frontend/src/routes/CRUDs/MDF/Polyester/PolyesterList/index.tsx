import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePolyesterList } from '../../../../../hooks/crud/usePolyesterList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DPoliester } from '../../../../../models/poliester';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { hasAnyRoles } from '../../../../../services/authService';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function PolyesterList() {

    const navigate = useNavigate();
    const { data: poliesters, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = usePolyesterList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/polyesters/create");
    }

    function handleUpdateClick(poliester: DPoliester) {
        navigate(`/polyesters/${poliester.codigo}`);
    }

    function handleDeleteClick(poliester: DPoliester) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: poliester.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, polyesterId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(polyesterId) ? polyesterId : [polyesterId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(poliester: DPoliester) {
        handleInactivate([poliester.codigo]);
    }

    const columns: TableColumn<DPoliester>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (poliester) => poliester.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (poliester) => poliester.descricao,
            className: 'txt-left'
        }
    ];


    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Poliesters</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && poliesters.length === 0 ? (
                    <SkeletonTable columns={2} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={poliesters.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(poliester) => poliester.codigo}
                            rowClassName={(poliester) => `situacao-${poliester.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && poliesters.length > 0 && (
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