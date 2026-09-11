import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachineList } from '../../../../../hooks/crud/useMachineList';
import ButtonInverse from '../../../../../components/ButtonInverse';
import SearchBar from '../../../../../components/SearchBar';
import ButtonNextPage from '../../../../../components/ButtonNextPage';
import DialogInfo from '../../../../../components/DialogInfo';
import DialogConfirmation from '../../../../../components/DialogConfirmation';
import GenericTable, { TableColumn } from '../../../../../components/GenericTable';
import { DMaquina } from '../../../../../models/maquina';
import { Spinner, SkeletonTable } from '../../../../../components/Loading';

export default function MachineList() {

    const navigate = useNavigate();
    const { data: maquinas, loading, isLastPage, handleSearch, handleNextPage, handleDelete, handleInactivate, error } = useMachineList();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleNewChallengeClick() {
        navigate("/machines/create");
    }

    function handleUpdateClick(maquina: DMaquina) {
        navigate(`/machines/${maquina.codigo}`);
    }

    function handleDeleteClick(maquina: DMaquina) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: maquina.codigo, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, machineId: number | number[]) {
        if (answer) {
            const ids = Array.isArray(machineId) ? machineId : [machineId];
            handleDelete(ids);
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleInactivateClick(maquina: DMaquina) {
        handleInactivate([maquina.codigo]);
    }

    const columns: TableColumn<DMaquina>[] = [
        {
            key: 'codigo',
            header: 'Código',
            accessor: (maquina) => maquina.codigo,
            className: 'col-codigo tb576'
        },
        {
            key: 'nome',
            header: 'Nome',
            accessor: (maquina) => maquina.nome,
            className: 'txt-left'
        },
        {
            key: 'grupoMaquina',
            header: 'Grupo Máquina',
            accessor: (maquina) => maquina.grupoMaquina.nome,
            className: 'txt-left'
        }
    ];

    return(
        <main>
            <section id="listing-section" className="container">
                <h2 className="section-title mb20">Cadastro de Máquina</h2>

                <div className="btn-page-container mb20">
                    <div onClick={handleNewChallengeClick}>
                        <ButtonInverse text="Novo" />
                    </div>
                </div>

                <SearchBar onSearch={handleSearch} />

                {loading && maquinas.length === 0 ? (
                    <SkeletonTable columns={3} rows={8} />
                ) : (
                    <>
                        <GenericTable
                            data={maquinas.filter(obj => obj.situacao !== 'LIXEIRA')}
                            columns={columns}
                            keyExtractor={(maquina) => maquina.codigo}
                            rowClassName={(maquina) => `situacao-${maquina.situacao.toLowerCase()}`}
                            onEdit={handleUpdateClick}
                            onDelete={handleDeleteClick}
                            onInactivate={handleInactivateClick}
                        />

                        {loading && maquinas.length > 0 && (
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