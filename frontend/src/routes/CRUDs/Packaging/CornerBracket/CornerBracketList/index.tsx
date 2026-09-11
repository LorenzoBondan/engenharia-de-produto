import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCornerBracketList } from '../../../../../hooks/crud/useCornerBracketList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DCantoneira } from '../../../../../models/cantoneira';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function CornerBracketList() {

    const navigate = useNavigate();
    const { data: cantoneiras, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useCornerBracketList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/cornerbrackets/create");
    }

    function handleUpdateClick(cantoneira: DCantoneira) {
        navigate(`/cornerbrackets/${cantoneira.codigo}`);
    }

    function handleDeleteClick(cantoneira: DCantoneira) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: cantoneira.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, cornerBracketId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(cornerBracketId) ? cornerBracketId : [cornerBracketId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(cantoneira: DCantoneira) {
        handleInactivate([cantoneira.codigo]);
    }

    const columns: TableColumn<DCantoneira>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (cantoneira) => cantoneira.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (cantoneira) => cantoneira.descricao,
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Cantoneiras</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && cantoneiras.length === 0 ? (
                    <SkeletonTable columns={2} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={cantoneiras.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(cantoneira) => cantoneira.codigo}
                            rowClassName={(cantoneira) => `situacao-${cantoneira.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && cantoneiras.length > 0 && (
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