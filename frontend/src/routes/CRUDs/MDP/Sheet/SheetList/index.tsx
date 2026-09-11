import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSheetList } from '../../../../../hooks/crud/useSheetList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DChapa } from '../../../../../models/chapa';
import DropdownMenu from '../../../../../components/DropdownMenu';
import { hasAnyRoles } from '../../../../../services/authService';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function SheetList() {

    const navigate = useNavigate();
    const { data: chapas, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useSheetList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/sheets/create");
    }

    function handleUpdateClick(chapa: DChapa) {
        navigate(`/sheets/${chapa.codigo}`);
    }

    function handleDeleteClick(chapa: DChapa) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: chapa.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, sheetId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(sheetId) ? sheetId : [sheetId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(chapa: DChapa) {
        handleInactivate([chapa.codigo]);
    }

    const columns: TableColumn<DChapa>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (chapa) => chapa.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (chapa) => chapa.descricao,
            className: 'txt-left'
        },
        {
            key: 'cor',
            header: 'Cor',
            accessor: (chapa) => chapa.cor ? chapa.cor.descricao : '',
            className: 'txt-left'
        },
        {
            key: 'espessura',
            header: 'Espessura',
            accessor: (chapa) => chapa.espessura,
            className: 'txt-left'
        },
        {
            key: 'faces',
            header: 'Faces',
            accessor: (chapa) => chapa.faces,
            className: 'txt-left'
        }
    ];


    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Chapas</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && chapas.length === 0 ? (
                    <SkeletonTable columns={5} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={chapas.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(chapa) => chapa.codigo}
                            rowClassName={(chapa) => `situacao-${chapa.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && chapas.length > 0 && (
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