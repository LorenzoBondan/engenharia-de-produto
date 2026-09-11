import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModelList } from '../../../../../hooks/crud/useModelList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import DropdownMenu from '../../../../../components/DropdownMenu';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DModelo } from '../../../../../models/modelo';
import { hasAnyRoles } from '../../../../../services/authService';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function ModelList() {

    const navigate = useNavigate();
    const { data: modelos, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useModelList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState<{
        visible: boolean;
        id: number | number[];
        message: string;
    }>({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    function handleSelect(id: number, checked: boolean) {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    }

    function handleSelectAll(checked: boolean) {
        if (checked) {
            const allIds = modelos
                .filter(m => m.situacao !== 'LIXEIRA')
                .map(m => m.codigo);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    }

    function handleNewChallengeClick() {
        navigate("/models/create");
    }

    function handleUpdateClick(modelo: DModelo) {
        navigate(`/models/${modelo.codigo}`);
    }

    function handleDeleteClick(modelId: number | number[]) {
        const ids = Array.isArray(modelId) ? modelId : [modelId];
        const message = `Você tem certeza que deseja excluir ${ids.length} registro${ids.length > 1 ? 's' : ''}?`;

        setDialogConfirmationData({
            visible: true,
            id: ids,
            message
        });
    }

    function handleDialogConfirmationAnswer(answer: boolean, modelId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(modelId) ? modelId : [modelId];
            handleDelete(ids);
            setSelectedIds([]);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(ids: number[]) {
        handleInactivate(ids);
        setSelectedIds([]);
    }

    const columns: TableColumn<DModelo>[] = [
        {
            key: 'checkbox',
            header: hasAnyRoles(['ROLE_ADMIN', 'ROLE_ANALYST']) ? (
                <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedIds.length === modelos.filter(m => m.situacao !== 'LIXEIRA').length && modelos.filter(m => m.situacao !== 'LIXEIRA').length > 0}
                />
            ) : '',
            accessor: (modelo) => hasAnyRoles(['ROLE_ADMIN', 'ROLE_ANALYST']) ? (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(modelo.codigo)}
                    onChange={(e) => handleSelect(modelo.codigo, e.target.checked)}
                />
            ) : null,
            className: ''
        },
        {
            key: 'codigo',
            header: 'Código',
            accessor: (modelo) => modelo.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'descricao',
            header: 'Descrição',
            accessor: (modelo) => modelo.descricao,
            className: 'txt-left'
        }
    ];


    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Modelos</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {hasAnyRoles(['ROLE_ADMIN', 'ROLE_ANALYST']) && selectedIds.length > 0 && (
                    <div className="mb10 mt20" style={{ display: 'flex', gap: '10px' }}>
                        <ButtonInverse
                            text={`Inativar selecionados (${selectedIds.length})`}
                            onClick={() => handleInactivate(selectedIds)}
                        />
                        <ButtonInverse
                            text={`Excluir selecionados (${selectedIds.length})`}
                            onClick={() =>
                                setDialogConfirmationData({ ...dialogConfirmationData, id: selectedIds,
                                    message: `Você tem certeza que deseja excluir ${selectedIds.length} registro${selectedIds.length > 1 ? 's' : ''}?`
                                })
                            }
                        />
                    </div>
                )}

                {loading && modelos.length === 0 ? (
                    <SkeletonTable columns={3} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={modelos.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(modelo) => modelo.codigo}
                            rowClassName={(modelo) => `situacao-${modelo.situacao.toLowerCase()}`}
                            customActions={(modelo) => (
                                <DropdownMenu
                                    onEdit={() => handleUpdateClick(modelo)}
                                    onInactivate={() => handleInactivateClick(modelo)}
                                    onDelete={() => handleDeleteClick(modelo)}
                                />
                            )}
                        />

                        {loading && modelos.length > 0 && (
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