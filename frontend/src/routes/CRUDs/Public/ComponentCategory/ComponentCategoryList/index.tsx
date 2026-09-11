import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComponentCategoryList } from '../../../../../hooks/crud/useComponentCategoryList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DCategoriaComponente } from '../../../../../models/categoriaComponente';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function ComponentCategoryList() {

    const navigate = useNavigate();
    const { data: categoriaComponentes, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useComponentCategoryList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/componentcategories/create");
    }

    function handleUpdateClick(categoriaComponente: DCategoriaComponente) {
        navigate(`/componentcategories/${categoriaComponente.codigo}`);
    }

    function handleDeleteClick(categoriaComponente: DCategoriaComponente) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: categoriaComponente.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, componentCategoryId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(componentCategoryId) ? componentCategoryId : [componentCategoryId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(categoriaComponente: DCategoriaComponente) {
        handleInactivate([categoriaComponente.codigo]);
    }

    const columns: TableColumn<DCategoriaComponente>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (categoriaComponente) => categoriaComponente.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (categoriaComponente) => categoriaComponente.descricao,
            className: 'txt-left'
        }
    ];


    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Categorias de Componentes</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && categoriaComponentes.length === 0 ? (
                    <SkeletonTable columns={2} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={categoriaComponentes.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(categoriaComponente) => categoriaComponente.codigo}
                            rowClassName={(categoriaComponente) => `situacao-${categoriaComponente.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && categoriaComponentes.length > 0 && (
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