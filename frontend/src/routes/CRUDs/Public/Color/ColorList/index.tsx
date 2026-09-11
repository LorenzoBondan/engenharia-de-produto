import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useColorList } from '../../../../../hooks/crud/useColorList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';
import { DCor } from '../../../../../models/cor';

export default function ColorList() {

    const navigate = useNavigate();
    const { data: cores, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useColorList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/colors/create");
    }

    function handleUpdateClick(cor: DCor) {
        navigate(`/colors/${cor.codigo}`);
    }

    function handleDeleteClick(cor: DCor) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: cor.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, colorId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(colorId) ? colorId : [colorId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(cor: DCor) {
        handleInactivate([cor.codigo]);
    }

    const columns: TableColumn<DCor>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (cor) => cor.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (cor) => cor.descricao,
            className: 'txt-left'
        },
        {
            key: 'hexa',
            header: 'Hexa',
            accessor: (cor) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {cor.hexa && (
                        <span
                            style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: `#${cor.hexa}`,
                                border: '1px solid #ccc'
                            }}
                        />
                    )}
                </div>
            ),
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Cores</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && cores.length === 0 ? (
                    <SkeletonTable columns={3} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={cores.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(cor) => cor.codigo}
                            rowClassName={(cor) => `situacao-${cor.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && cores.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <Spinner size="medium" aria-label="Carregando mais itens" />
                            </div>
                        )}

                        {
                            !isLastPage && !loading &&
                            <ButtonNextPage onNextPage={handleNextPage} />
                        }
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