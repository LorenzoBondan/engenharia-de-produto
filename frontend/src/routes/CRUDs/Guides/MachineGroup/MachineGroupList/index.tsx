import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachineGroupList } from '../../../../../hooks/crud/useMachineGroupList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DGrupoMaquina } from '../../../../../models/grupoMaquina';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function MachineGroupList() {

    const navigate = useNavigate();
    const { data: gruposMaquinas, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useMachineGroupList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/machinegroups/create");
    }

    function handleUpdateClick(grupoMaquina: DGrupoMaquina) {
        navigate(`/machinegroups/${grupoMaquina.codigo}`);
    }

    function handleDeleteClick(grupoMaquina: DGrupoMaquina) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: grupoMaquina.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, machineGroupId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(machineGroupId) ? machineGroupId : [machineGroupId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(grupoMaquina: DGrupoMaquina) {
        handleInactivate([grupoMaquina.codigo]);
    }

    const columns: TableColumn<DGrupoMaquina>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (grupoMaquina) => grupoMaquina.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'nome',
            header: 'Nome',
            accessor: (grupoMaquina) => grupoMaquina.nome,
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Grupos de Máquinas</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && gruposMaquinas.length === 0 ? (
                    <SkeletonTable columns={2} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={gruposMaquinas.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(grupoMaquina) => grupoMaquina.codigo}
                            rowClassName={(grupoMaquina) => `situacao-${grupoMaquina.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && gruposMaquinas.length > 0 && (
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